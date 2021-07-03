import { makeRootExeca, makePackageExeca } from './scripts/gulp/execa';
import { parallel, series } from 'gulp';

import path from 'path';

import type { TaskFunction } from 'gulp';

const generateBackendAPIPrismaClient: TaskFunction = async () => {
  const backendAPI = makePackageExeca('backend-api');

  await backendAPI.binary.local('prisma', ['generate']);
};
generateBackendAPIPrismaClient.displayName = 'backend-api:prisma';

const generateBackendAPIGraphQLTypes: TaskFunction = async () => {
  const backendAPI = makePackageExeca('backend-api');

  await backendAPI.binary.local('graphql', ['codegen']);
};
generateBackendAPIGraphQLTypes.displayName = 'backend-api:graphql';

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

const removeBackendAPIGraphQLTypes: TaskFunction = async () => {
  const backendAPI = makePackageExeca('backend-api');

  await backendAPI.binary.local('rimraf', [
    path.join('src', 'apollo', 'schema', 'modules', 'resolvers.gen.ts')
  ]);
};
removeBackendAPIGraphQLTypes.displayName = 'backend-api:rm:graphql';

const removeBackendAPIPrismaClient: TaskFunction = async () => {
  const backendAPI = makePackageExeca('backend-api');

  await backendAPI.binary.local('rimraf', [
    path.join('node_modules', '.prisma')
  ]);
};
removeBackendAPIPrismaClient.displayName = 'backend-api:rm:prisma';

const generateBackendAPITestsGraphQLTypes: TaskFunction = async () => {
  const backendAPITests = makePackageExeca('backend-api', 'tests');

  await backendAPITests.binary.local('graphql', ['codegen']);
};
generateBackendAPITestsGraphQLTypes.displayName = 'backend-api-tests:graphql';

const removeBackendAPITestsGraphQLTypes: TaskFunction = async () => {
  const backendAPITests = makePackageExeca('backend-api', 'tests');

  await backendAPITests.binary.local('rimraf', [
    path.join('src', 'context', 'graphql', 'sdk', 'generic-sdk.gen.ts')
  ]);
};
removeBackendAPITestsGraphQLTypes.displayName = 'backend-api-tests:rm:graphql';

const runBackendAPITests: TaskFunction = async () => {
  const backendAPITests = makePackageExeca('backend-api', 'tests');

  await backendAPITests.binary.local('jest');
};
runBackendAPITests.displayName = 'backend-api-tests:jest';

const watchBackendAPITests: TaskFunction = async () => {
  const backendAPITests = makePackageExeca('backend-api', 'tests');

  await backendAPITests.binary.local('jest', ['--watch']);
};
watchBackendAPITests.displayName = 'backend-api-tests:jest:watch';

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
    path.join('packages', '*', 'dist'),
    path.join('packages', '*', 'tests', 'dist')
  ]);
};
removeAllDistFolders.displayName = '*:rm:dist';

const runAllTests: TaskFunction = async () => {
  const root = makeRootExeca();

  await root.binary.local('jest');
};
runAllTests.displayName = '*-tests:jest';

const watchAllTests: TaskFunction = async () => {
  const root = makeRootExeca();

  await root.binary.local('jest', ['--watch']);
};
watchAllTests.displayName = '*-tests:jest:watch';

const lintAllStagedFiles: TaskFunction = async () => {
  const root = makeRootExeca();

  await root.binary.local('lint-staged');
};
lintAllStagedFiles.displayName = '*:lint-staged';

export const buildBackendAPIPipeline: TaskFunction = series(
  generateBackendAPIPrismaClient,
  generateBackendAPIGraphQLTypes,
  compileBackendAPIProject
);
buildBackendAPIPipeline.displayName = 'backend-api:build';

export const watchBuildBackendAPIPipeline: TaskFunction = series(
  generateBackendAPIPrismaClient,
  generateBackendAPIGraphQLTypes,
  watchBackendAPIBuild
);
watchBuildBackendAPIPipeline.displayName = 'backend-api:build:watch';

export const startBackendAPIPipeline: TaskFunction = series(runBackendAPI);
startBackendAPIPipeline.displayName = 'backend-api:start';

export const devBackendAPIPipeline: TaskFunction = series(
  generateBackendAPIPrismaClient,
  generateBackendAPIGraphQLTypes,
  runDevBackendAPI
);
devBackendAPIPipeline.displayName = 'backend-api:dev';

export const cleanBackendAPIPipeline: TaskFunction = series(
  cleanBackendAPIProject,
  removeBackendAPIDistFolder,
  removeBackendAPIGraphQLTypes,
  removeBackendAPIPrismaClient
);
cleanBackendAPIPipeline.displayName = 'backend-api:clean';

export const testBackendAPIPipeline: TaskFunction = series(
  generateBackendAPIPrismaClient,
  generateBackendAPIGraphQLTypes,
  generateBackendAPITestsGraphQLTypes,
  runBackendAPITests
);
testBackendAPIPipeline.displayName = 'backend-api-tests:test';

export const watchTestBackendAPIPipeline: TaskFunction = series(
  generateBackendAPIPrismaClient,
  generateBackendAPIGraphQLTypes,
  generateBackendAPITestsGraphQLTypes,
  watchBackendAPITests
);
watchTestBackendAPIPipeline.displayName = 'backend-api-tests:test:watch';

export const buildPipeline: TaskFunction = series(
  parallel(
    series(
      generateBackendAPIPrismaClient,
      generateBackendAPIGraphQLTypes,
      generateBackendAPITestsGraphQLTypes
    )
  ),
  compileAllProjects
);
buildPipeline.displayName = '*:build';

export const watchBuildPipeline: TaskFunction = series(
  parallel(
    series(
      generateBackendAPIPrismaClient,
      generateBackendAPIGraphQLTypes,
      generateBackendAPITestsGraphQLTypes
    )
  ),
  watchAllProjects
);
watchBuildPipeline.displayName = '*:build:watch';

export const cleanPipeline: TaskFunction = series(
  cleanAllProjects,
  removeAllDistFolders,
  parallel(
    series(
      removeBackendAPITestsGraphQLTypes,
      removeBackendAPIGraphQLTypes,
      removeBackendAPIPrismaClient
    )
  )
);
cleanPipeline.displayName = '*:clean';

export const testPipeline: TaskFunction = series(
  parallel(
    series(
      generateBackendAPIPrismaClient,
      generateBackendAPIGraphQLTypes,
      generateBackendAPITestsGraphQLTypes
    )
  ),
  runAllTests
);
testPipeline.displayName = '*-tests:test';

export const watchTestPipeline: TaskFunction = series(
  parallel(
    series(
      generateBackendAPIPrismaClient,
      generateBackendAPIGraphQLTypes,
      generateBackendAPITestsGraphQLTypes
    )
  ),
  watchAllTests
);
watchTestPipeline.displayName = '*-tests:test:watch';

export const preCommit: TaskFunction = series(
  cleanAllProjects,
  removeAllDistFolders,
  parallel(
    series(
      removeBackendAPITestsGraphQLTypes,
      removeBackendAPIGraphQLTypes,
      removeBackendAPIPrismaClient
    )
  ),
  parallel(
    series(
      generateBackendAPIPrismaClient,
      generateBackendAPIGraphQLTypes,
      generateBackendAPITestsGraphQLTypes
    )
  ),
  compileAllProjects,
  runAllTests,
  lintAllStagedFiles
);
preCommit.displayName = '*:pre-commit';
