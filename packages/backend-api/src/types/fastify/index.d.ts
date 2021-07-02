declare module 'fastify' {
  export interface FastifyError {
    validationContext?: ValidationContext;
  }

  export type ValidationContext = 'headers' | 'params' | 'querystring' | 'body';
}

export {};
