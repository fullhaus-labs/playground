import { createTestContext } from '../context';

import { contextFactory } from 'backend-api/apollo/context';

import { mocked } from 'ts-jest/utils';

const context = createTestContext();
const now = Date.parse('2021-07-01T00:00:00.000Z');

describe('GraphQL context', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('default', () => {
    test('should create GraphQL context', async () => {
      const request: any = {
        headers: {}
      };

      await expect(
        contextFactory({
          request,
          prisma: context.prisma,
          winston: context.winston,
          lib: context.lib
        })
      ).resolves.toStrictEqual({
        request,
        prisma: context.prisma,
        winston: context.winston,
        lib: context.lib,
        me: null
      });
    });
  });

  describe('me', () => {
    test('should create GraphQL context with me value if request was authenticated', async () => {
      mocked(Date.now).mockReturnValue(Date.parse('2021-07-01T00:30:00.000Z'));

      const request: any = {
        headers: {
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMSJ9LCJpYXQiOjE2MjUwOTc2MDAsImV4cCI6MTYyNTEwMTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.3xAZZKWRXOJttkREmN3xcXr26couVh6j-99W_qabCGw'
        }
      };

      await expect(
        contextFactory({
          request,
          prisma: context.prisma,
          winston: context.winston,
          lib: context.lib
        })
      ).resolves.toStrictEqual({
        request,
        prisma: context.prisma,
        winston: context.winston,
        lib: context.lib,
        me: { userID: 'user-id-1' }
      });
    });

    test('should result in an error if authorization header did not follow bearer authentication scheme', async () => {
      const request: any = {
        headers: {
          authorization:
            'Not-Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMSJ9LCJpYXQiOjE2MjUwOTc2MDAsImV4cCI6MTYyNTEwMTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.3xAZZKWRXOJttkREmN3xcXr26couVh6j-99W_qabCGw'
        }
      };

      await expect(
        contextFactory({
          request,
          prisma: context.prisma,
          winston: context.winston,
          lib: context.lib
        })
      ).rejects.toMatchObject({
        message: 'graphql operation has received bad user input',
        extensions: {
          code: 'BAD_USER_INPUT',
          reason:
            'authorization header does not follow bearer authentication scheme',
          headers: {
            authorization:
              'Not-Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMSJ9LCJpYXQiOjE2MjUwOTc2MDAsImV4cCI6MTYyNTEwMTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.3xAZZKWRXOJttkREmN3xcXr26couVh6j-99W_qabCGw'
          }
        }
      });
    });

    test('should result in an error if bearer authorization header token did not follow JWT scheme', async () => {
      const request: any = {
        headers: {
          authorization:
            'Bearer not-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMSJ9LCJpYXQiOjE2MjUwOTc2MDAsImV4cCI6MTYyNTEwMTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.3xAZZKWRXOJttkREmN3xcXr26couVh6j-99W_qabCGw'
        }
      };

      await expect(
        contextFactory({
          request,
          prisma: context.prisma,
          winston: context.winston,
          lib: context.lib
        })
      ).rejects.toMatchObject({
        message: 'graphql operation has received bad user input',
        extensions: {
          code: 'BAD_USER_INPUT',
          reason:
            'bearer authorization header token does not follow JWT scheme',
          headers: {
            authorization:
              'Bearer not-eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMSJ9LCJpYXQiOjE2MjUwOTc2MDAsImV4cCI6MTYyNTEwMTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.3xAZZKWRXOJttkREmN3xcXr26couVh6j-99W_qabCGw'
          }
        }
      });
    });

    test('should result in an error if bearer authorization header token did not follow Fullhaus JWT scheme', async () => {
      const request: any = {
        headers: {
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMSJ9LCJpYXQiOjE2MjUwOTc2MDAsImV4cCI6MTYyNTEwMTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.2rQ5_2rnmStc2IMQpeoBgPJ6POqfI3C3SW6VLU6bB4I'
        }
      };

      await expect(
        contextFactory({
          request,
          prisma: context.prisma,
          winston: context.winston,
          lib: context.lib
        })
      ).rejects.toMatchObject({
        message: 'graphql operation has received bad user input',
        extensions: {
          code: 'BAD_USER_INPUT',
          reason:
            'bearer authorization header token does not follow Fullhaus JWT scheme',
          headers: {
            authorization:
              'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMSJ9LCJpYXQiOjE2MjUwOTc2MDAsImV4cCI6MTYyNTEwMTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.2rQ5_2rnmStc2IMQpeoBgPJ6POqfI3C3SW6VLU6bB4I'
          }
        }
      });
    });

    test('should result in an error if bearer authentication header token was expired', async () => {
      mocked(Date.now).mockReturnValue(Date.parse('2021-07-01T01:30:00.000Z'));

      const request: any = {
        headers: {
          authorization:
            'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXJJRCI6InVzZXItaWQtMSJ9LCJpYXQiOjE2MjUwOTc2MDAsImV4cCI6MTYyNTEwMTIwMCwiYXVkIjoiYXVkLmZ1bGxoYXVzLnh5eiIsImlzcyI6Imlzcy5mdWxsaGF1cy54eXoifQ.3xAZZKWRXOJttkREmN3xcXr26couVh6j-99W_qabCGw'
        }
      };

      await expect(
        contextFactory({
          request,
          prisma: context.prisma,
          winston: context.winston,
          lib: context.lib
        })
      ).rejects.toMatchObject({
        message:
          'graphql operation has received expired bearer authentication header token',
        extensions: {
          code: 'FORBIDDEN'
        }
      });
    });
  });
});
