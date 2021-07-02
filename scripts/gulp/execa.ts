import execa from 'execa';
import path from 'path';

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

interface MakeExecaParams {
  cwd?: string;
}

type MakeExeca = (params?: MakeExecaParams) => Execa;

const makeExeca: MakeExeca = ({ cwd } = {}) => ({
  binary: {
    global: (binary, args, options) =>
      execa(binary, args, extendExecaOptions({ cwd, ...options })),
    local: (binary, args, options) =>
      execa(binary, args, extendLocalExecaOptions({ cwd, ...options }))
  },
  node: (scriptPath, args, options) =>
    execa.node(scriptPath, args, extendExecaOptions({ cwd, ...options }))
});

export type MakeRootExeca = () => Execa;

export const makeRootExeca: MakeRootExeca = () => makeExeca();

export type MakePackageExeca = (...packageNameComponents: string[]) => Execa;

export const makePackageExeca: MakePackageExeca = (...packageNameComponents) =>
  makeExeca({ cwd: path.join('packages', ...packageNameComponents) });
