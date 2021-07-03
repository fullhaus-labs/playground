declare global {
  namespace NodeJS {
    export type Environments = 'development' | 'test' | 'production';
  }
}

export {};
