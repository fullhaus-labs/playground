import { createTestContext } from '../../../context';

import gql from 'graphql-tag';

const context = createTestContext();
const now = Date.parse('2021-07-01T00:00:00.000Z');

describe('GraphQL base module', () => {
  beforeEach(() => {
    jest.spyOn(Date, 'now').mockReturnValue(now);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('query queryRoot()', () => {
    beforeEach(() => {
      jest.spyOn(context.lib.nanoid, 'sync');
    });

    test('should result in null', async () => {
      await expect(context.graphql.QueryRoot()).resolves.toStrictEqual({
        _: null
      });

      expect(context.lib.nanoid.sync).toHaveBeenCalledTimes(1);
    });
  });

  describe('mutation mutateRoot()', () => {
    beforeEach(() => {
      jest.spyOn(context.lib.nanoid, 'sync');
    });

    test('should result in null', async () => {
      await expect(context.graphql.MutateRoot()).resolves.toStrictEqual({
        _: null
      });

      expect(context.lib.nanoid.sync).toHaveBeenCalledTimes(1);
    });
  });
});

export const queryRoot = gql`
  query QueryRoot {
    _
  }
`;

export const mutateRoot = gql`
  mutation MutateRoot {
    _
  }
`;
