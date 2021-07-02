import type { HTTPMethods, ValidationContext } from 'fastify';

export abstract class FastifyResponseError extends Error {
  abstract code: string;
  abstract statusCode: number;
  abstract message: string;

  toResponse(): Record<string, unknown> {
    return {
      code: this.code,
      statusCode: this.statusCode,
      message: this.message
    };
  }
}

export interface FastifyRouteNotFoundErrorProps {
  method: HTTPMethods;
  url: string;
}

export class FastifyRouteNotFoundError extends FastifyResponseError {
  code = 'NOT_FOUND';
  statusCode = 404;
  message = 'server has failed to find request route';

  method: HTTPMethods;
  url: string;

  constructor(props: FastifyRouteNotFoundErrorProps) {
    super();

    this.method = props.method;
    this.url = props.url;

    Error.captureStackTrace(this, this.constructor);
  }

  toResponse(): Record<string, unknown> {
    return {
      ...super.toResponse(),
      meta: {
        request: {
          method: this.method,
          url: this.url
        }
      }
    };
  }
}

export interface FastifyBadRequestErrorProps {
  context: ValidationContext;
  path: string[];
  reason: string;
}

export class FastifyBadRequestError extends FastifyResponseError {
  code = 'BAD_REQUEST';
  statusCode = 400;
  message = 'server has failed to validate request payload';

  context: ValidationContext;
  path: string[];
  reason: string;

  constructor(props: FastifyBadRequestErrorProps) {
    super();

    this.context = props.context;
    this.path = props.path;
    this.reason = props.reason;

    Error.captureStackTrace(this, this.constructor);
  }

  toResponse(): Record<string, unknown> {
    return {
      ...super.toResponse(),
      meta: {
        request: {
          [this.context]: {
            path: this.path,
            reason: this.reason
          }
        }
      }
    };
  }
}

export class FastifyUnknownError extends FastifyResponseError {
  code = 'UNKNOWN_ERROR';
  statusCode = 500;
  message = 'server has failed to execute request';

  constructor() {
    super();

    Error.captureStackTrace(this, this.constructor);
  }

  toResponse(): Record<string, unknown> {
    return { ...super.toResponse() };
  }
}
