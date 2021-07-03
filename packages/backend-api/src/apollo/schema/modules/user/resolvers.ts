import { ApolloError } from 'apollo-server-fastify';

import type { User } from '@prisma/client';
import type { Resolvers } from '../resolvers.gen';

export const resolvers: Resolvers = {
  Query: {
    findAllUsers: async (_, __, context) => {
      let users: User[];

      try {
        users = await context.prisma.user.findMany({
          orderBy: [{ no: 'asc' }]
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

      return { done: true, users };
    },
    findOneUserByID: async (_, { input }, context) => {
      let user: User | null;

      try {
        user = await context.prisma.user.findUnique({
          where: {
            id: input.id
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

      return { done: true, user };
    },
    findOneUserByEmailAddress: async (_, { input }, context) => {
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

      return { done: true, user };
    },
    findMyUser: async (_, __, context) => {
      if (context.me === null) {
        throw new ApolloError(
          'graphql operation has reached unexpected state',
          'INTERNAL_SERVER_ERROR'
        );
      }

      let user: User | null;

      try {
        user = await context.prisma.user.findUnique({
          where: {
            id: context.me.userID
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
        throw new ApolloError(
          'graphql operation has reached unexpected state',
          'INTERNAL_SERVER_ERROR'
        );
      }

      return { done: true, user };
    }
  }
};
