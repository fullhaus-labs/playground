import { createTestContext } from '../../../context';

import gql from 'graphql-tag';

import { Prisma } from '@prisma/client';
import { mocked } from 'ts-jest/utils';

const context = createTestContext();
const now = Date.parse('2021-07-01T00:00:00.000Z');

describe('GraphQL user module', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('query findAllUsers()', () => {
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
          },
          {
            id: 'user-id-2',
            no: 2,
            firstName: 'Takeru',
            lastName: 'Villegas',
            emailAddress: 'takeru.vik@fullhaus.xyz',
            passwordHash:
              '$2b$10$mCmzmczxIsdmq6ZKQw3hn.Nu/gP/szz.b.3JaWffwXdWWAR4xBQ0O',
            createdAt: new Date(now),
            updatedAt: new Date(now)
          }
        ]
      });
    });

    beforeEach(() => {
      jest.spyOn(context.prisma.user, 'findMany');
      jest.spyOn(context.lib.nanoid, 'sync');
    });

    test('should result in all users', async () => {
      await expect(context.graphql.FindAllUsers()).resolves.toStrictEqual({
        findAllUsers: {
          done: true,
          users: [
            {
              id: 'user-id-1',
              firstName: 'AJ',
              lastName: 'Ortiz',
              emailAddress: 'ajota.os@fullhaus.xyz'
            },
            {
              id: 'user-id-2',
              firstName: 'Takeru',
              lastName: 'Villegas',
              emailAddress: 'takeru.vik@fullhaus.xyz'
            }
          ]
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findMany).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findMany).toHaveBeenNthCalledWith(1, {
        orderBy: [{ no: 'asc' }]
      });

      expect(context.lib.nanoid.sync).toHaveBeenCalledTimes(1);
    });

    test('should result in an error if find many users prisma request failed unexpectedly', async () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      mocked(context.prisma.user.findMany).mockRejectedValueOnce(
        new Prisma.PrismaClientUnknownRequestError('', '')
      );

      await expect(context.graphql.FindAllUsers()).rejects.toMatchObject({
        errors: [
          {
            message: 'graphql operation has reached unexpected state',
            extensions: { code: 'INTERNAL_SERVER_ERROR' }
          }
        ]
      });
    });
  });

  describe('query findOneUserByID(input:)', () => {
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
    });

    test('should result in a user if input matched a user by id', async () => {
      await expect(
        context.graphql.FindOneUserByID({
          input: {
            id: 'user-id-1'
          }
        })
      ).resolves.toStrictEqual({
        findOneUserByID: {
          done: true,
          user: {
            id: 'user-id-1',
            firstName: 'AJ',
            lastName: 'Ortiz',
            emailAddress: 'ajota.os@fullhaus.xyz'
          }
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findUnique).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findUnique).toHaveBeenNthCalledWith(1, {
        where: {
          id: 'user-id-1'
        }
      });

      expect(context.lib.nanoid.sync).toHaveBeenCalledTimes(1);
    });

    test('should result in null if input did not match any user by id', async () => {
      await expect(
        context.graphql.FindOneUserByID({
          input: {
            id: 'user-id-x'
          }
        })
      ).resolves.toStrictEqual({
        findOneUserByID: {
          done: true,
          user: null
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findUnique).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findUnique).toHaveBeenNthCalledWith(1, {
        where: {
          id: 'user-id-x'
        }
      });
    });

    test('should result in an error if find unique user prisma request failed unexpectedly', async () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      mocked(context.prisma.user.findUnique).mockRejectedValueOnce(
        new Prisma.PrismaClientUnknownRequestError('', '')
      );

      await expect(
        context.graphql.FindOneUserByID({
          input: {
            id: 'user-id-1'
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

  describe('query findOneUserByEmailAddress(input:)', () => {
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
    });

    test('should result in a user if input matched a user by email address', async () => {
      await expect(
        context.graphql.FindOneUserByEmailAddress({
          input: {
            emailAddress: 'ajota.os@fullhaus.xyz'
          }
        })
      ).resolves.toStrictEqual({
        findOneUserByEmailAddress: {
          done: true,
          user: {
            id: 'user-id-1',
            firstName: 'AJ',
            lastName: 'Ortiz',
            emailAddress: 'ajota.os@fullhaus.xyz'
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

      expect(context.lib.nanoid.sync).toHaveBeenCalledTimes(1);
    });

    test('should result in a user if input insensitively-case matched a user by email address', async () => {
      await expect(
        context.graphql.FindOneUserByEmailAddress({
          input: {
            emailAddress: 'AJOTA.OS@FULLHAUS.XYZ'
          }
        })
      ).resolves.toStrictEqual({
        findOneUserByEmailAddress: {
          done: true,
          user: {
            id: 'user-id-1',
            firstName: 'AJ',
            lastName: 'Ortiz',
            emailAddress: 'ajota.os@fullhaus.xyz'
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
    });

    test('should result in null if input did not match any user by email address', async () => {
      await expect(
        context.graphql.FindOneUserByEmailAddress({
          input: {
            emailAddress: 'not.ajota.os@fullhaus.xyz'
          }
        })
      ).resolves.toStrictEqual({
        findOneUserByEmailAddress: {
          done: true,
          user: null
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findUnique).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findUnique).toHaveBeenNthCalledWith(1, {
        where: {
          emailAddress: 'not.ajota.os@fullhaus.xyz'
        }
      });
    });

    test('should result in an error if find unique user prisma request failed unexpectedly', async () => {
      // eslint-disable-next-line @typescript-eslint/unbound-method
      mocked(context.prisma.user.findUnique).mockRejectedValueOnce(
        new Prisma.PrismaClientUnknownRequestError('', '')
      );

      await expect(
        context.graphql.FindOneUserByEmailAddress({
          input: {
            emailAddress: 'ajota.os@icloud.com'
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

  describe('query findMyUser()', () => {
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
            createdAt: '2021-01-01T00:00:00.000Z',
            updatedAt: '2021-01-01T00:00:00.000Z'
          }
        ]
      });
    });

    beforeEach(() => {
      jest.spyOn(context.prisma.user, 'findUnique');
      jest.spyOn(context.lib.nanoid, 'sync');
    });

    test('should result in a user if authentication matched a user by id', async () => {
      mocked(Date.now).mockReturnValue(Date.parse('2021-01-01T00:30:00.000Z'));

      await expect(
        context.graphql.FindMyUser(undefined, {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMSJ9LCJpYXQiOjE2MDk1NDU2MDAsImV4cCI6MTYwOTU0OTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.671bHCbjR7rLNrY3ZC8CEXskiJbPjBScceQ4nQkQEcc'
          }
        })
      ).resolves.toStrictEqual({
        findMyUser: {
          user: {
            id: 'user-id-1',
            firstName: 'AJ',
            lastName: 'Ortiz',
            emailAddress: 'ajota.os@fullhaus.xyz'
          }
        }
      });

      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findUnique).toHaveBeenCalledTimes(1);
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(context.prisma.user.findUnique).toHaveBeenNthCalledWith(1, {
        where: {
          id: 'user-id-1'
        }
      });

      expect(context.lib.nanoid.sync).toHaveBeenCalledTimes(1);
    });

    test('should result in an error if request was not authenticated', async () => {
      await expect(context.graphql.FindMyUser()).rejects.toMatchObject({
        message: 'graphql operation has failed',
        errors: [
          {
            message: 'graphql operation has received unauthenticated request',
            extensions: { code: 'UNAUTHENTICATED' }
          }
        ]
      });
    });

    test('should result in an error if find unique user prisma request failed unexpectedly', async () => {
      mocked(Date.now).mockReturnValue(Date.parse('2021-01-01T00:30:00.000Z'));

      // eslint-disable-next-line @typescript-eslint/unbound-method
      mocked(context.prisma.user.findUnique).mockRejectedValueOnce(
        new Prisma.PrismaClientUnknownRequestError('', '')
      );

      await expect(
        context.graphql.FindMyUser(undefined, {
          headers: {
            Authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMSJ9LCJpYXQiOjE2MDk1NDU2MDAsImV4cCI6MTYwOTU0OTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.671bHCbjR7rLNrY3ZC8CEXskiJbPjBScceQ4nQkQEcc'
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
});

export const findAllUsers = gql`
  query FindAllUsers {
    findAllUsers {
      done
      users {
        id
        firstName
        lastName
        emailAddress
      }
    }
  }
`;

export const findOneUserByID = gql`
  query FindOneUserByID($input: FindOneUserByIDArgs!) {
    findOneUserByID(input: $input) {
      done
      user {
        id
        firstName
        lastName
        emailAddress
      }
    }
  }
`;

export const findOneUserByEmailAddress = gql`
  query FindOneUserByEmailAddress($input: FindOneUserByEmailAddressArgs!) {
    findOneUserByEmailAddress(input: $input) {
      done
      user {
        id
        firstName
        lastName
        emailAddress
      }
    }
  }
`;

export const findMyUser = gql`
  query FindMyUser {
    findMyUser {
      user {
        id
        firstName
        lastName
        emailAddress
      }
    }
  }
`;
