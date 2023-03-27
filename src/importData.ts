import BaseDb from './db/BaseDb';
import { exportWorkspaceData } from './exportData';
import { Workspace, WorkspaceMeta, BaseRequest, RequestMeta, RequestGroup, RequestGroupMeta, Environment, Project } from './insomniaDbTypes';
import OldIds from './OldIds';
import { GitSavedRequest, GitSavedWorkspace, GitSavedProject } from './types';

export async function importProject(project: GitSavedProject, workspaces: GitSavedWorkspace[]) {
  // Upsert the Project
  const projectDb = new BaseDb<Project>('Project');
  projectDb.upsert({
    _id: project.id,
    name: project.name,
    remoteId: project.remoteId,
    created: Date.now(),
    isPrivate: false,
    modified: Date.now(),
    parentId: null,
    type: 'Project',
  });

  // Update all Workspaces
  // TODO: Check if workspaces have been deleted
  for (const workspace of workspaces) {
    await importWorkspaceData(workspace);
  }
}

async function upsertRequestsRecursive(
  requests: GitSavedRequest[],
  oldIds: OldIds,
  requestDb: BaseDb<BaseRequest>,
  requestMetaDb: BaseDb<RequestMeta>,
  requestGroupDb: BaseDb<RequestGroup>,
  requestGroupMetaDb: BaseDb<RequestGroupMeta>,
) {
  for (const request of requests) {
    if (request.type === 'group') {
      requestGroupDb.upsert(request.group);
      requestGroupMetaDb.upsert(request.meta);

      oldIds.removeRequestGroupId(request.id);

      upsertRequestsRecursive(request.children, oldIds, requestDb, requestMetaDb, requestGroupDb, requestGroupMetaDb);
      continue;
    }

    requestDb.upsert(request.request);
    requestMetaDb.upsert(request.meta);

    oldIds.removeRequestId(request.id);
  }
}

async function removeOldData(
  oldIds: OldIds,
  requestDb: BaseDb<BaseRequest>,
  requestMetaDb: BaseDb<RequestMeta>,
  requestGroupDb: BaseDb<RequestGroup>,
  requestGroupMetaDb: BaseDb<RequestGroupMeta>,
  environmentDb: BaseDb<Environment>,
) {
  for (const envId of oldIds.getEnvironmentIds()) {
    environmentDb.deleteBy('_id', envId);
  }

  for (const requestId of oldIds.getRequestIds()) {
    requestDb.deleteBy('_id', requestId);
    requestMetaDb.deleteBy('parentId', requestId);
  }

  for (const requestGroupId of oldIds.getRequestGroupId()) {
    requestGroupDb.deleteBy('_id', requestGroupId);
    requestGroupMetaDb.deleteBy('parentId', requestGroupId);
  }
}

export async function importWorkspaceData(data: GitSavedWorkspace): Promise<void> {
  const workspaceDb = new BaseDb<Workspace>('Workspace');

  // Collect OldIds so we can delete deleted Docs at the end
  const oldIds = await workspaceDb.findById(data.id)
    ? OldIds.fromOldData(await exportWorkspaceData(data.id))
    : OldIds.createEmpty();

  // Update Workspace metadata
  await workspaceDb.upsert(data.workspace);

  const workspaceMetaDb = new BaseDb<WorkspaceMeta>('WorkspaceMeta');
  const fullMeta: WorkspaceMeta = {
    ...data.meta,
    // These are the Default value from 'models/workspace-meta::init()'. TODO: Load the old WorkspaceMetadata here
    activeUnitTestSuiteId: null,
    cachedGitLastAuthor: null,
    cachedGitLastCommitTime: null,
    cachedGitRepositoryBranch: null,
    gitRepositoryId: null,
    hasSeen: true,
    paneHeight: 0.5,
    paneWidth: 0.5,
    parentId: null,
    sidebarFilter: '',
    sidebarHidden: false,
    sidebarWidth: 19,
    pushSnapshotOnInitialize: false,
  };
  workspaceMetaDb.upsert(fullMeta);

  const requestDb = new BaseDb<BaseRequest>('Request');
  const requestMetaDb = new BaseDb<RequestMeta>('RequestMeta');

  const requestGroupDb = new BaseDb<RequestGroup>('RequestGroup');
  const requestGroupMetaDb = new BaseDb<RequestGroupMeta>('RequestGroupMeta');

  await upsertRequestsRecursive(data.requests, oldIds, requestDb, requestMetaDb, requestGroupDb, requestGroupMetaDb);

  const environmentDb = new BaseDb<Environment>('Environment');
  for (const environment of data.environments) {
    environmentDb.upsert(environment);

    oldIds.removeEnvironmentId(environment._id);
  }

  removeOldData(oldIds, requestDb, requestMetaDb, requestGroupDb, requestGroupMetaDb, environmentDb);
}
