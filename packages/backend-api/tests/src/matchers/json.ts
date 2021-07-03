import equals from 'deep-equal';
import { printReceived, printExpected } from 'jest-matcher-utils';

expect.extend({
  jsonRepresenting(received: string, expected: unknown) {
    const pass = equals(JSON.parse(received), expected);

    const message = pass
      ? () =>
          `expected parsed JSON string ${printReceived(
            received
          )} not to be equal to ${printExpected(expected)}`
      : () =>
          `expected parsed JSON string ${printReceived(
            received
          )} to be equal to ${printExpected(expected)}`;

    return { pass, message };
  }
});

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      jsonRepresenting: (expected: unknown) => R;
    }

    interface Expect {
      jsonRepresenting: (expected: unknown) => unknown;
    }
  }
}
