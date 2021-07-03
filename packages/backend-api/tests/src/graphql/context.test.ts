import { createTestContext } from '../context';

import { contextFactory } from 'backend-api/apollo/context';

const context = createTestContext();
const now = Date.parse('2021-07-01T00:00:00');

describe('GraphQL context', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('default', () => {
    test('should create GraphQL context', async () => {
      const request: any = {};

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
        lib: context.lib
      });
    });
  });
});
