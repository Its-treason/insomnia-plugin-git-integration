import fs from 'node:fs';
import { join } from 'path';
import InternalDb from './db/InternalDb';
import { getActiveProjectId } from './db/localStorageUtils';
import { exportProject } from './exportData';
import { importProject, readProjectData } from './importData';
import renderModal from './ui/react/renderModal';
import confirmModal from './ui/react/confirmModal';
import { GitSavedProject, GitSavedWorkspace } from './types';

const prevExport: Record<string, string> = {};
export default async function autoExport() {
  const projectId = getActiveProjectId();
  if (!projectId) {
    return;
  }

  const config = InternalDb.create();
  const { repositoryPath: path, autoExport } = config.getProject(projectId);
  if (!path || !autoExport || projectId === 'proj_default-project') {
    return;
  }

  const [projectData, workspaces] = await exportProject(projectId);
  const newExportJson = JSON.stringify([projectData, workspaces]);
  // First import, set the inital data
  if (prevExport[projectId] === undefined) {
    prevExport[projectId] = newExportJson;
    return;
  }

  if (prevExport[projectId] === newExportJson) {
    // Nothing to export, so lets try to Import
    await autoImportProject(path);
    return;
  }

  prevExport[projectId] = newExportJson;
  // Reset the Import data to make sure no import starts because of this export
  prevImport[projectId] = undefined;

  const targetFile = join(path, 'project.json');
  fs.writeFileSync(targetFile, JSON.stringify(projectData, null, 2));

  for (const workspace of workspaces) {
    const targetFile = join(path, workspace.id + '.json');
    fs.writeFileSync(targetFile, JSON.stringify(workspace, null, 2));
  }
}

let importModalOpen = false;
const prevImport: Record<string, string> = {};
async function autoImportProject(path: string) {
  let project: GitSavedProject, workspaceData: GitSavedWorkspace[];
  try {
    [project, workspaceData] = readProjectData(path);
  } catch (e) {
    console.error('[IPGI] Error while gathering import data during auto import. This might not be a bug', e);
    return;
  }
  const newImportJson = JSON.stringify([project, workspaceData]);

  // Do not import the first time
  if (prevImport[project.id] === undefined) {
    prevImport[project.id] = newImportJson;
    return;
  }

  if (prevImport[project.id] === newImportJson || importModalOpen) {
    // Nothing to import
    return;
  }

  importModalOpen = true;
  const doImport = await renderModal<boolean>(confirmModal(
    'Import project',
    'Import changed project data? Insomnia will restart.',
  ));
  importModalOpen = false;
  // Doesn't matter if we want to import or not, ensure we don't aks again for the same thing
  prevImport[project.id] = newImportJson;
  if (!doImport) {
    return;
  }

  try {
    await importProject(project, workspaceData);
    // Force Insomnia to read all data
    // @ts-ignore
    window.main.restart();
  } catch (e) {
    console.error('[IPGI] Failed to export data', e);
  }
}
