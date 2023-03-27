import BaseDb from './db/BaseDb';
import { BaseRequest, RequestMeta, RequestGroup, RequestGroupMeta, Workspace, WorkspaceMeta, Environment, Project } from './insomniaDbTypes';
import { GitSavedProject, GitSavedRequest, GitSavedWorkspace, GitSavedWorkspaceMeta } from './types';

async function exportProject(projectId: string): Promise<[GitSavedProject, GitSavedWorkspace[]]> {
  // Load the Project
  const projectDb = new BaseDb<Project>('Project');
  const fullProject = await projectDb.findById(projectId);
  if (!fullProject) {
    throw new Error('Project not found with id ' + projectId);
  }

  const project: GitSavedProject = { id: fullProject._id, name: fullProject.name, remoteId: fullProject.remoteId };

  // Load all workspaces
  const workspaceDb = new BaseDb<Workspace>('Workspace');
  const workspaces = await workspaceDb.findBy('parentId', fullProject._id);

  const savedWorkspaces: GitSavedWorkspace[] = [];
  for (const workspace of workspaces) {
    savedWorkspaces.push(await exportWorkspaceData(workspace._id));
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
    if (metas.length === 0) {
      throw new Error('No RequestMeta found for parentId: ' + request._id);
    }
    const meta = metas[0];

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
    if (metas.length === 0) {
      throw new Error('No RequestMeta found for parentId: ' + group._id);
    }
    const meta = metas[0];

    gitSavedRequests.push({
      type: 'group',
      id: group._id,
      group,
      children: await getRequestsForParentId(group._id, requestDb, requestMetaDb, requestGroupDb, requestGroupMetaDb),
      meta,
    })
  }

  return gitSavedRequests;
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
  if (fullMetas.length === 0) {
    throw new Error('No WorkspaceMeta found for parentId: ' + workspaceId);
  }
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
  }

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

  return {
    id: workspaceId,
    name,
    workspace,
    meta,
    requests,
    environments,
  };
}
