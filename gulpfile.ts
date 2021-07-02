import { makeRootExeca, makePackageExeca } from './scripts/gulp/execa';
import { series } from 'gulp';

import path from 'path';

import type { TaskFunction } from 'gulp';

const compileBackendAPIProject: TaskFunction = async () => {
  const backendAPI = makePackageExeca('backend-api');

  await backendAPI.binary.local('tsc', ['--build']);
};
compileBackendAPIProject.displayName = 'backend-api:tsc';

const watchBackendAPIBuild: TaskFunction = async () => {
  const backendAPI = makePackageExeca('backend-api');

  await backendAPI.binary.local('tsc', ['--build', '--watch']);
};
watchBackendAPIBuild.displayName = 'backend-api:tsc:watch';

const cleanBackendAPIProject: TaskFunction = async () => {
  const backendAPI = makePackageExeca('backend-api');

  await backendAPI.binary.local('tsc', ['--build', '--clean']);
};
cleanBackendAPIProject.displayName = 'backend-api:tsc:clean';

const runBackendAPI: TaskFunction = async () => {
  const backendAPI = makePackageExeca('backend-api');

  await backendAPI.node('dist');
};
runBackendAPI.displayName = 'backend-api:node';

const runDevBackendAPI: TaskFunction = async () => {
  const backendAPI = makePackageExeca('backend-api');

  await backendAPI.binary.local('ts-node-dev', [
    '--respawn',
    '--transpile-only',
    '--watch',
    '.env',
    '--require',
    path.join('tsconfig-paths', 'register'),
    '--require',
    path.join('dotenv', 'config'),
    'src'
  ]);
};
runDevBackendAPI.displayName = 'backend-api:ts-node-dev';

const removeBackendAPIDistFolder: TaskFunction = async () => {
  const backendAPI = makePackageExeca('backend-api');

  await backendAPI.binary.local('rimraf', ['dist']);
};
removeBackendAPIDistFolder.displayName = 'backend-api:rm:dist';

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

  await root.binary.local('rimraf', [
    'dist',
    path.join('packages', '*', 'dist')
  ]);
};
removeAllDistFolders.displayName = '*:rm:dist';

const lintAllStagedFiles: TaskFunction = async () => {
  const root = makeRootExeca();

  await root.binary.local('lint-staged');
};
lintAllStagedFiles.displayName = '*:lint-staged';

export const buildBackendAPIPipeline: TaskFunction = series(
  compileBackendAPIProject
);
buildBackendAPIPipeline.displayName = 'backend-api:build';

export const watchBuildBackendAPIPipeline: TaskFunction =
  series(watchBackendAPIBuild);
watchBuildBackendAPIPipeline.displayName = 'backend-api:build:watch';

export const startBackendAPIPipeline: TaskFunction = series(runBackendAPI);
startBackendAPIPipeline.displayName = 'backend-api:start';

export const devBackendAPIPipeline: TaskFunction = series(runDevBackendAPI);
devBackendAPIPipeline.displayName = 'backend-api:dev';

export const cleanBackendAPIPipeline: TaskFunction = series(
  cleanBackendAPIProject,
  removeBackendAPIDistFolder
);
cleanBackendAPIPipeline.displayName = 'backend-api:clean';

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
