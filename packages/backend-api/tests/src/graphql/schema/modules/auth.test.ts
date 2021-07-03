import { createTestContext } from '../../../context';

import gql from 'graphql-tag';

import { Prisma } from '@prisma/client';
import { mocked } from 'ts-jest/utils';

const context = createTestContext();
const now = Date.parse('2021-07-01T00:00:00.000Z');

describe('GraphQL auth', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('mutation registerUserAccount(input:)', () => {
    beforeEach(async () => {
      await context.prisma.user.createMany({
        data: [
          {
            id: 'user-id-1',
            no: 1,
            firstName: 'AJ',
            lastName: 'Ortiz',
            emailAddress: 'ajota.os@fullhaus.xyz',
            passwordHash:
              '$2b$10$mCmzmczxIsdmq6ZKQw3hn.Nu/gP/szz.b.3JaWffwXdWWAR4xBQ0O',
            createdAt: new Date(now),
            updatedAt: new Date(now)
          }
        ]
      });
    });

    beforeEach(() => {
      jest.spyOn(context.prisma.user, 'create');
      jest.spyOn(context.lib.nanoid, 'sync');
      jest.spyOn(context.lib.nanoid, 'async');
      jest.spyOn(context.lib.bcrypt, 'hash');
      jest.spyOn(context.lib.jwt, 'sign');
    });

    test('should result in a new user', async () => {
      mocked(context.lib.nanoid.async).mockResolvedValueOnce('user-id-2');

      await expect(
        context.graphql.RegisterUserAccount({
          input: {
            firstName: 'Takeru',
            lastName: 'Villegas',
            emailAddress: 'takeru.vik@fullhaus.xyz',
            password: 'abc123xyz'
          }
        })
      ).resolves.toStrictEqual({
        registerUserAccount: {
          done: true,
          account: {
            token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMiJ9LCJpYXQiOjE2MjUwOTc2MDAsImV4cCI6MTYyNTEwMTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.rDd2H52i3wpQHG4_jlzAy0pcGuZMHRWLgrvaSOL6CqE'
          }
        }
      });

      expect(context.lib.nanoid.async).toHaveBeenCalledTimes(1);
      expect(context.lib.nanoid.async).toHaveBeenNthCalledWith(1);

      expect(context.lib.bcrypt.hash).toHaveBeenCalledTimes(1);
      expect(context.lib.bcrypt.hash).toHaveBeenNthCalledWith(1, 'abc123xyz');

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.create).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.create).toHaveBeenNthCalledWith(1, {
        data: {
          id: 'user-id-2',
          firstName: 'Takeru',
          lastName: 'Villegas',
          emailAddress: 'takeru.vik@fullhaus.xyz',
          passwordHash: expect.bcryptHashMatching('abc123xyz')
        }
      });

      expect(context.lib.jwt.sign).toHaveBeenCalledTimes(1);
      expect(context.lib.jwt.sign).toHaveBeenNthCalledWith(1, {
        userID: 'user-id-2'
      });

      expect(context.lib.nanoid.sync).toHaveBeenCalledTimes(1);
    });

    test('should result in an error if input matched a user by email address', async () => {
      await expect(
        context.graphql.RegisterUserAccount({
          input: {
            firstName: 'AJ',
            lastName: 'Ortiz',
            emailAddress: 'ajota.os@fullhaus.xyz',
            password: 'abc123xyz'
          }
        })
      ).rejects.toMatchObject({
        message: 'graphql operation has failed',
        errors: [
          {
            message: 'graphql operation has received bad user input',
            extensions: {
              code: 'BAD_USER_INPUT',
              reason: 'email address belongs to an existing user',
              input: { emailAddress: 'ajota.os@fullhaus.xyz' }
            }
          }
        ]
      });
    });

    test('should result in an error if create user prisma request failed unexpectedly', async () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      mocked(context.prisma.user.create).mockRejectedValue(
        new Prisma.PrismaClientUnknownRequestError('', '')
      );

      await expect(
        context.graphql.RegisterUserAccount({
          input: {
            firstName: 'Takeru',
            lastName: 'Villegas',
            emailAddress: 'takeru.vik@fullhaus.xyz',
            password: 'abc123xyz'
          }
        })
      ).rejects.toMatchObject({
        message: 'graphql operation has failed',
        errors: [
          {
            message: 'graphql operation has reached unexpected state',
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
          }
        ]
      });
    });
  });

  describe('mutation authenticateUserAccount(input:)', () => {
    beforeEach(async () => {
      await context.prisma.user.createMany({
        data: [
          {
            id: 'user-id-1',
            no: 1,
            firstName: 'AJ',
            lastName: 'Ortiz',
            emailAddress: 'ajota.os@fullhaus.xyz',
            passwordHash:
              '$2b$10$mCmzmczxIsdmq6ZKQw3hn.Nu/gP/szz.b.3JaWffwXdWWAR4xBQ0O',
            createdAt: new Date(now),
            updatedAt: new Date(now)
          }
        ]
      });
    });

    beforeEach(() => {
      jest.spyOn(context.prisma.user, 'findUnique');
      jest.spyOn(context.lib.nanoid, 'sync');
      jest.spyOn(context.lib.bcrypt, 'compare');
      jest.spyOn(context.lib.jwt, 'sign');
    });

    test('should result in an existing user', async () => {
      await expect(
        context.graphql.AuthenticateUserAccount({
          input: {
            emailAddress: 'ajota.os@fullhaus.xyz',
            password: 'abc123xyz'
          }
        })
      ).resolves.toStrictEqual({
        authenticateUserAccount: {
          done: true,
          account: {
            token:
              'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMSJ9LCJpYXQiOjE2MjUwOTc2MDAsImV4cCI6MTYyNTEwMTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.3xAZZKWRXOJttkREmN3xcXr26couVh6j-99W_qabCGw'
          }
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findUnique).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findUnique).toHaveBeenNthCalledWith(1, {
        where: {
          emailAddress: 'ajota.os@fullhaus.xyz'
        }
      });

      expect(context.lib.bcrypt.compare).toHaveBeenCalledTimes(1);
      expect(context.lib.bcrypt.compare).toHaveBeenNthCalledWith(
        1,
        'abc123xyz',
        '$2b$10$mCmzmczxIsdmq6ZKQw3hn.Nu/gP/szz.b.3JaWffwXdWWAR4xBQ0O'
      );

      expect(context.lib.jwt.sign).toHaveBeenCalledTimes(1);
      expect(context.lib.jwt.sign).toHaveBeenNthCalledWith(1, {
        userID: 'user-id-1'
      });

      expect(context.lib.nanoid.sync).toHaveBeenCalledTimes(1);
    });

    test('should result in an error if input did not match any user by email address', async () => {
      await expect(
        context.graphql.AuthenticateUserAccount({
          input: {
            emailAddress: 'not.ajota.os@fullhaus.xyz',
            password: 'abc123xyz'
          }
        })
      ).rejects.toMatchObject({
        message: 'graphql operation has failed',
        errors: [
          {
            message: 'graphql operation has received bad user input',
            extensions: {
              code: 'BAD_USER_INPUT',
              reason: 'email address does not belong to any user',
              input: { emailAddress: 'not.ajota.os@fullhaus.xyz' }
            }
          }
        ]
      });
    });

    test('should result in an error if input matched user by email address and did not match user with password', async () => {
      await expect(
        context.graphql.AuthenticateUserAccount({
          input: {
            emailAddress: 'ajota.os@fullhaus.xyz',
            password: 'xyz123abc'
          }
        })
      ).rejects.toMatchObject({
        message: 'graphql operation has failed',
        errors: [
          {
            message: 'graphql operation has received bad user input',
            extensions: {
              code: 'BAD_USER_INPUT',
              reason:
                'email address belongs to an existing user but password does not match',
              input: {
                emailAddress: 'ajota.os@fullhaus.xyz',
                password: 'xyz123abc'
              }
            }
          }
        ]
      });
    });

    test('should result in an error if find unique user prisma request failed unexpectedly', async () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      mocked(context.prisma.user.findUnique).mockRejectedValue(
        new Prisma.PrismaClientUnknownRequestError('', '')
      );

      await expect(
        context.graphql.AuthenticateUserAccount({
          input: {
            emailAddress: 'ajota.os@fullhaus.xyz',
            password: 'abc123xyz'
          }
        })
      ).rejects.toMatchObject({
        errors: [
          {
            message: 'graphql operation has reached unexpected state',
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
          }
        ]
      });
    });
  });
});

export const registerUserAccount = gql`
  mutation RegisterUserAccount($input: RegisterUserAccountArgs!) {
    registerUserAccount(input: $input) {
      done
      account {
        token
      }
    }
  }
`;

export const authenticateUserAccount = gql`
  mutation AuthenticateUserAccount($input: AuthenticateUserAccountArgs!) {
    authenticateUserAccount(input: $input) {
      done
      account {
        token
      }
    }
  }
`;
