import { BaseRequest, WorkspaceMeta, RequestGroup, RequestGroupMeta, RequestMeta, Workspace, Environment, BaseModel, UnittestSuite, UnitTest, ApiSpec } from './insomniaDbTypes';

export type GitSavedProject = {
  name: string,
  id: string,
  remoteId: string | null,
  workspaceIds: string[],
}

export type GitSavedWorkspace = {
  name: string,
  id: string,
  workspace: Workspace,
  meta: GitSavedWorkspaceMeta,
  requests: GitSavedRequest[],
  environments: Environment[],
  apiSpec?: ApiSpec,
  unitTestSuites: GitSavedUnitTestSuite[],
}

export type GitSavedUnitTestSuite = {
  testSuite: UnittestSuite,
  tests: UnitTest[],
}

export type GitSavedRequest = {
  type: 'request',
  id: string,
  request: BaseRequest,
  meta: RequestMeta,
} | {
  type: 'group',
  id: string,
  group: RequestGroup,
  meta: RequestGroupMeta,
  children: GitSavedRequest[],
}

export type GitSavedWorkspaceMeta = Pick<WorkspaceMeta, 'activeActivity' | 'activeEnvironmentId' | 'activeRequestId' | keyof BaseModel>
