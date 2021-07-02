import execa from 'execa';

import type { ExecaChildProcess, Options as _ExecaOptions } from 'execa';

type _ExtendExecaOptions = (options?: _ExecaOptions) => _ExecaOptions;

const extendExecaOptions: _ExtendExecaOptions = (options) => ({
  ...options,
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr
});

const extendLocalExecaOptions: _ExtendExecaOptions = (options) =>
  extendExecaOptions({ preferLocal: true, ...options });

export interface ExecaOptions {
  env?: NodeJS.ProcessEnv;
}

export type BinaryExeca = (
  binary: string,
  args?: string[],
  options?: ExecaOptions
) => ExecaChildProcess;

export type NodeExeca = (
  scriptPath: string,
  args?: string[],
  options?: ExecaOptions
) => ExecaChildProcess;

export interface Execa {
  binary: {
    global: BinaryExeca;
    local: BinaryExeca;
  };
  node: NodeExeca;
}

export type MakeRootExeca = () => Execa;

export const makeRootExeca: MakeRootExeca = () => ({
  binary: {
    global: (binary, args, options) =>
      execa(binary, args, extendExecaOptions({ ...options })),
    local: (binary, args, options) =>
      execa(binary, args, extendLocalExecaOptions({ ...options }))
  },
  node: (scriptPath, args, options) =>
    execa.node(scriptPath, args, extendExecaOptions({ ...options }))
});
