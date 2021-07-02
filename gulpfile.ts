import { makeRootExeca } from './scripts/gulp/execa';
import { series } from 'gulp';

import type { TaskFunction } from 'gulp';

const compileAllProjects: TaskFunction = async () => {
  const root = makeRootExeca();

  await root.binary.local('tsc', ['--build']);
};
compileAllProjects.displayName = '*:tsc';

const watchAllProjects: TaskFunction = async () => {
  const root = makeRootExeca();

  await root.binary.local('tsc', ['--build', '--watch']);
};
watchAllProjects.displayName = '*:tsc:watch';

const cleanAllProjects: TaskFunction = async () => {
  const root = makeRootExeca();

  await root.binary.local('tsc', ['--build', '--clean']);
};
cleanAllProjects.displayName = '*:tsc:clean';

const removeAllDistFolders: TaskFunction = async () => {
  const root = makeRootExeca();

  await root.binary.local('rimraf', ['dist']);
};
removeAllDistFolders.displayName = '*:rm:dist';

const lintAllStagedFiles: TaskFunction = async () => {
  const root = makeRootExeca();

  await root.binary.local('lint-staged');
};
lintAllStagedFiles.displayName = '*:lint-staged';

export const buildPipeline: TaskFunction = series(compileAllProjects);
buildPipeline.displayName = '*:build';

export const watchBuildPipeline: TaskFunction = series(watchAllProjects);
watchBuildPipeline.displayName = '*:build:watch';

export const cleanPipeline: TaskFunction = series(
  cleanAllProjects,
  removeAllDistFolders
);
cleanPipeline.displayName = '*:clean';

export const preCommit: TaskFunction = series(
  cleanAllProjects,
  removeAllDistFolders,
  compileAllProjects,
  lintAllStagedFiles
);
preCommit.displayName = '*:pre-commit';
