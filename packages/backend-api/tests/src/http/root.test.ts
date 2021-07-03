import { createTestContext } from '../context';

const context = createTestContext();
const now = Date.parse('2021-07-01T00:00:00');

describe('HTTP root', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('GET "/" route', () => {
    beforeEach(() => {
      jest.spyOn(context.lib.nanoid, 'sync');
    });

    test('should result in a root value', async () => {
      await expect(
        context.fastify.inject({
          method: 'GET',
          url: '/'
        })
      ).resolves.toMatchObject({
        statusCode: 200,
        body: expect.jsonRepresenting({ root: true })
      });

      expect(context.lib.nanoid.sync).toHaveBeenCalledTimes(1);
    });
  });
});
