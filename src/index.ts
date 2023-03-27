import { exportWorkspaceData } from './exportData';
import fs from 'node:fs';
import { importWorkspaceData } from './importData';
import InternalDb from './db/InternalDb';
import { getActiveProjectId, getActiveWorkspace } from './db/localStorageUtils';
import { join } from 'node:path';
import exportProjectButton from './ui/exportProjectButton';
import importNewProjectButton from './ui/importNewProjectButton';

// Inject UI elements.
// @ts-ignore
const currentVersion = (window.gitIntegrationInjectCounter || 0) + 1;
// @ts-ignore
window.gitIntegrationInjectCounter = currentVersion;

function doInject() {
  // @ts-ignore
  // Check if the window was reloaded. When it was reloaded the Global counter changed
  if (window.gitIntegrationInjectCounter !== currentVersion) {
    return;
  }

  exportProjectButton();
  importNewProjectButton();

  window.requestAnimationFrame(doInject);
}
window.requestAnimationFrame(doInject);

module.exports.workspaceActions = [
  {
    label: 'Export workspace to Git',
    icon: 'fa-download',
    action: async (context, models) => {
      const projectId = getActiveProjectId();
      const workspaceId = getActiveWorkspace();

      const config = InternalDb.create();
      const path = config.getProjectPath(projectId);
      if (!path || projectId === 'proj_default-project') {
        // TODO: Better error message
        alert('Project is not configured or default project')
        return;
      }

      const data = await exportWorkspaceData(workspaceId);
      const targetFile = join(path, workspaceId + '.json');
      fs.writeFileSync(targetFile, JSON.stringify(data, null, 2));
    },
  },
  {
    label: 'Import workspace from Git',
    icon: 'fa-upload',
    action: async (context, models) => {
      const projectId = getActiveProjectId();
      const workspaceId = getActiveWorkspace();

      const config = InternalDb.create();
      const path = config.getProjectPath(projectId)
      if (!path || projectId === 'proj_default-project') {
        // TODO: Better error message
        alert('Project is not configured or default project')
        return;
      }

      const targetFile = join(path, workspaceId + '.json');
      const dataRaw = JSON.parse(fs.readFileSync(targetFile).toString());
      await importWorkspaceData(dataRaw);
      // @ts-ignore
      window.main.restart();
    },
  },
  {
    label: 'Configure Repository',
    icon: 'fa-cog',
    action: async (context, models) => {
      const projectId = getActiveProjectId();

      if (projectId === 'proj_default-project') {
        // TODO: Better error message
        alert('Can not configure for default project create seperate')
        return;
      }

      // @ts-ignore
      const openResult = await window.dialog.showOpenDialog({ properties: ['openDirectory'] });
      if (openResult.canceled || openResult.filePaths.lenght === 0) {
        return;
      }

      const config = InternalDb.create();
      config.upsertProject(projectId, openResult.filePaths[0], '');
    },
  },
];
