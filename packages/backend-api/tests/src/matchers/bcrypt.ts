import { compareSync } from 'bcrypt';
import { printReceived, printExpected } from 'jest-matcher-utils';

expect.extend({
  bcryptHashMatching(received: string, expected: string) {
    const pass = compareSync(expected, received);

    const message = pass
      ? () =>
          `expected ${printReceived(
            received
          )} not to match with bcrypt hash from ${printExpected(expected)}`
      : () =>
          `expected ${printReceived(
            received
          )} to match with bcrypt hash from ${printExpected(expected)}`;

    return { pass, message };
  }
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      bcryptHashMatching: (expected: string) => R;
    }

    interface Expect {
      bcryptHashMatching: (expected: string) => unknown;
    }
  }
}
