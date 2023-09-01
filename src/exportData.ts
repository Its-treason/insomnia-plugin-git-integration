import BaseDb from './db/BaseDb';
import { BaseRequest, RequestMeta, RequestGroup, RequestGroupMeta, Workspace, WorkspaceMeta, Environment, Project, ApiSpec, UnittestSuite, UnitTest } from './insomniaDbTypes';
import { GitSavedProject, GitSavedRequest, GitSavedUnitTestSuite, GitSavedWorkspace, GitSavedWorkspaceMeta } from './types';
import { randomBytes } from 'crypto';

function createDefaultFolderMeta(parentId: string): RequestGroupMeta {
  return {
    collapsed: true,
    parentId,
    created: Date.now(),
    isPrivate: false,
    modified: Date.now(),
    type: 'RequestGroupMeta',
    _id: 'fldm_' + randomBytes(16).toString('hex'),
    name: '', // This is not used by insomnia.
  };
}

function createDefaultRequestMeta(parentId: string): RequestMeta {
  return {
    parentId,
    previewMode: 'friendly', // PREVIEW_MODE_FRIENDLY
    responseFilter: '',
    responseFilterHistory: [],
    activeResponseId: null,
    savedRequestBody: {},
    pinned: false,
    lastActive: 0,
    downloadPath: null,
    expandedAccordionKeys: {},
    created: Date.now(),
    isPrivate: false,
    modified: Date.now(),
    type: 'RequestMeta',
    _id: 'reqm_' + randomBytes(16).toString('hex'),
    name: '', // This is not used by insomnia.
  };
}

export async function exportProject(projectId: string): Promise<[GitSavedProject, GitSavedWorkspace[]]> {
  // Load the Project
  const projectDb = new BaseDb<Project>('Project');
  const fullProject = await projectDb.findById(projectId);
  if (!fullProject) {
    throw new Error('Project not found with id ' + projectId);
  }

  const project: GitSavedProject = {
    id: fullProject._id,
    name: fullProject.name,
    remoteId: fullProject.remoteId,
    workspaceIds: [],
  };

  // Load all workspaces
  const workspaceDb = new BaseDb<Workspace>('Workspace');
  const workspaces = await workspaceDb.findBy('parentId', fullProject._id);

  const savedWorkspaces: GitSavedWorkspace[] = [];
  for (const workspace of workspaces) {
    savedWorkspaces.push(await exportWorkspaceData(workspace._id));
    project.workspaceIds.push(workspace._id);
  }

  return [project, savedWorkspaces];
}

// ParentId is either the WorkspaceId for TopLevel requests or an FolderId for nested requests
async function getRequestsForParentId(
  parentId: string,
  requestDb: BaseDb<BaseRequest>,
  requestMetaDb: BaseDb<RequestMeta>,
  requestGroupDb: BaseDb<RequestGroup>,
  requestGroupMetaDb: BaseDb<RequestGroupMeta>,
): Promise<GitSavedRequest[]> {
  const gitSavedRequests: GitSavedRequest[] = [];

  const requests = await requestDb.findBy('parentId', parentId);
  for (const request of requests) {
    const metas = await requestMetaDb.findBy('parentId', request._id);
    // When duplicating a Workspace the Request meta is not automaticly created
    // As a workaround we use the default object.
    // See: https://github.com/Kong/insomnia/blob/develop/packages/insomnia/src/models/request-meta.ts#L32
    const meta = metas[0] || createDefaultRequestMeta(request._id);

    gitSavedRequests.push({
      type: 'request',
      id: request._id,
      meta,
      request,
    });
  }

  const groups = await requestGroupDb.findBy('parentId', parentId);
  for (const group of groups) {
    const metas = await requestGroupMetaDb.findBy('parentId', group._id);
    // Create default GroupMetadata when nothing was found. Not sure when this happens but should fix #3
    const meta = metas[0] || createDefaultFolderMeta(group._id);

    gitSavedRequests.push({
      type: 'group',
      id: group._id,
      group,
      children: await getRequestsForParentId(group._id, requestDb, requestMetaDb, requestGroupDb, requestGroupMetaDb),
      meta,
    });
  }

  return gitSavedRequests;
}

async function getTestSuites(workspaceId: string): Promise<GitSavedUnitTestSuite[]> {
  const savedUnittestSuites: GitSavedUnitTestSuite[] = [];

  const unitTestSuitesDb = new BaseDb<UnittestSuite>('UnitTestSuite');
  const unittestDb = new BaseDb<UnitTest>('UnitTest');

  const unitTestSuites = await unitTestSuitesDb.findBy('parentId', workspaceId);

  for (const testSuite of unitTestSuites) {
    const tests = await unittestDb.findBy('parentId', testSuite._id);

    savedUnittestSuites.push({
      tests,
      testSuite,
    });
  }

  return savedUnittestSuites;
}

async function getApiSpec(workspaceId: string): Promise<ApiSpec | null> {
  const apiSpecDb = new BaseDb<ApiSpec>('ApiSpec');

  const apiSpecs = await apiSpecDb.findBy('parentId', workspaceId);

  return apiSpecs[0] ?? null;
}

export async function exportWorkspaceData(workspaceId: string): Promise<GitSavedWorkspace> {
  // Find workspace
  const workspaceDb = new BaseDb<Workspace>('Workspace');
  const workspace = await workspaceDb.findById(workspaceId);
  if (!workspace) {
    throw new Error('No Workspace found for id: ' + workspaceId);
  }
  const name = workspace.name;

  // Find WorkspaceMeta
  const workspaceMetaDb = new BaseDb<WorkspaceMeta>('WorkspaceMeta');

  const fullMetas = await workspaceMetaDb.findBy('parentId', workspaceId);
  const fullMeta = fullMetas[0];

  const meta: GitSavedWorkspaceMeta = {
    _id: fullMeta._id,
    created: fullMeta.created,
    isPrivate: fullMeta.isPrivate,
    modified: fullMeta.modified,
    name: fullMeta.name,
    parentId: fullMeta.parentId,
    type: fullMeta.type,

    activeActivity: fullMeta.activeActivity,
    activeEnvironmentId: fullMeta.activeEnvironmentId,
    activeRequestId: fullMeta.activeRequestId,
  };

  const requestDb = new BaseDb<BaseRequest>('Request');
  const requestMetaDb = new BaseDb<RequestMeta>('RequestMeta');

  const requestGroupDb = new BaseDb<RequestGroup>('RequestGroup');
  const requestGroupMetaDb = new BaseDb<RequestGroupMeta>('RequestGroupMeta');

  const requests = await getRequestsForParentId(workspaceId, requestDb, requestMetaDb, requestGroupDb, requestGroupMetaDb);

  // Find environments
  const environmentDb = new BaseDb<Environment>('Environment');
  const baseEnvironments = await environmentDb.findBy('parentId', workspaceId);
  if (baseEnvironments.length === 0) {
    throw new Error('No BaseEnvironment found for parentId: ' + workspaceId);
  }
  const baseEnvironment = baseEnvironments[0];

  // Get all SubEnv -> Filter out private ones -> Add the BaseEnv to the Top
  const environments = (await environmentDb.findBy('parentId', baseEnvironment._id))
    .filter((env) => env.isPrivate === false);
  environments.unshift(baseEnvironment);

  const apiSpec = await getApiSpec(workspaceId);
  const unitTestSuites = await getTestSuites(workspaceId);

  return {
    id: workspaceId,
    name,
    workspace,
    meta,
    requests,
    environments,
    apiSpec,
    unitTestSuites,
  };
}
