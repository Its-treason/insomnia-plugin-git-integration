import fs from 'node:fs';
import { join } from 'path';
import InternalDb from './db/InternalDb';
import { getActiveProjectId } from './db/localStorageUtils';
import { exportProject } from './exportData';
import { importProject, readProjectData } from './importData';
import renderModal from './ui/react/renderModal';
import confirmModal from './ui/react/confirmModal';

let prevExport = '';
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
  if (newExportJson === prevExport) {
    // Nothing to export, so lets try to Import
    await autoImportProject(path);
    return;
  }

  prevExport = newExportJson;
  const targetFile = join(path, 'project.json');
  fs.writeFileSync(targetFile, JSON.stringify(projectData, null, 2));

  for (const workspace of workspaces) {
    const targetFile = join(path, workspace.id + '.json');
    fs.writeFileSync(targetFile, JSON.stringify(workspace, null, 2));
  }
}

let prevImport = '';
async function autoImportProject(path: string) {
  let project, workspaceData;
  try {
    [project, workspaceData] = readProjectData(path);
  } catch (e) {
    console.error('[IPGI] Error while gathering import data during auto import. This might not be a bug', e);
    return;
  }
  const newImportJson = JSON.stringify([project, workspaceData]);

  // Do not import the first time
  if (prevImport === '') {
    prevImport = newImportJson;
    return;
  }

  if (prevImport === newImportJson) {
    // Nothing to import
    return;
  }

  const doImport = await renderModal<boolean>(confirmModal(
    'Import project',
    'Import chhanged project data? Insomnia will restart.',
  ));
  if (!doImport) {
    return;
  }

  await importProject(project, workspaceData);
  // Force Insomnia to read all data
  // @ts-ignore
  window.main.restart();
}
