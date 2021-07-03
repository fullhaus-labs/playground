import { Prisma } from '@prisma/client';
import { UserInputError, ApolloError } from 'apollo-server-fastify';

import type { User } from '@prisma/client';
import type { Resolvers } from '../resolvers.gen';

export const resolvers: Resolvers = {
  Mutation: {
    registerUserAccount: async (_, { input }, context) => {
      const [id, passwordHash] = await Promise.all([
        context.lib.nanoid.async(),
        context.lib.bcrypt.hash(input.password)
      ]);

      let user: User;

      try {
        user = await context.prisma.user.create({
          data: {
            id,
            firstName: input.firstName.trim(),
            lastName: input.lastName.trim(),
            emailAddress: input.emailAddress.toLowerCase(),
            passwordHash
          }
        });
      } catch (error) {
        if (
          error instanceof Prisma.PrismaClientKnownRequestError &&
          error.code === 'P2002'
        ) {
          const uniqueContraintFailedKey = (error.meta as { target: string[] })
            .target[0];
          if (uniqueContraintFailedKey === 'email_address') {
            throw new UserInputError(
              'graphql operation has received bad user input',
              {
                reason: 'email address belongs to an existing user',
                input: { emailAddress: input.emailAddress }
              }
            );
          }
        }

        context.winston.error(
          'graphql operation has reached unexpected state',
          { error }
        );

        throw new ApolloError(
          'graphql operation has reached unexpected state',
          'INTERNAL_SERVER_ERROR'
        );
      }

      const token = context.lib.jwt.sign({ userID: user.id });
      const account = { token };

      return { done: true, account };
    },
    authenticateUserAccount: async (_, { input }, context) => {
      let user: User | null;

      try {
        user = await context.prisma.user.findUnique({
          where: {
            emailAddress: input.emailAddress.toLowerCase()
          }
        });
      } catch (error) {
        context.winston.error(
          'graphql operation has reached unexpected state',
          { error }
        );

        throw new ApolloError(
          'graphql operation has reached unexpected state',
          'INTERNAL_SERVER_ERROR'
        );
      }
      if (user === null) {
        throw new UserInputError(
          'graphql operation has received bad user input',
          {
            reason: 'email address does not belong to any user',
            input: {
              emailAddress: input.emailAddress
            }
          }
        );
      }

      const matches = await context.lib.bcrypt.compare(
        input.password,
        user.passwordHash
      );
      if (!matches) {
        throw new UserInputError(
          'graphql operation has received bad user input',
          {
            reason:
              'email address belongs to an existing user but password does not match',
            input: {
              emailAddress: input.emailAddress,
              password: input.password
            }
          }
        );
      }

      const token = context.lib.jwt.sign({ userID: user.id });
      const account = { token };

      return { done: true, account };
    }
  }
};
