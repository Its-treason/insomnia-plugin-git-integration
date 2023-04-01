import { exportWorkspaceData } from './exportData';
import fs from 'node:fs';
import { importWorkspaceData } from './importData';
import InternalDb from './db/InternalDb';
import { getActiveProjectId, getActiveWorkspace } from './db/localStorageUtils';
import { join } from 'node:path';
import importNewProjectButton from './ui/importNewProjectButton';
import projectDropdown from './ui/projectDropdown';
import alertModal from './ui/react/alertModal';
import renderModal from './ui/react/renderModal';

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

  projectDropdown();
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
        await renderModal(alertModal(
          'Cannot export workspace',
          'You must first configure the project folder before exporting',
        ));
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
        await renderModal(alertModal(
          'Cannot import workspace',
          'You must first configure the project folder before importing',
        ));
        return;
      }

      const targetFile = join(path, workspaceId + '.json');
      const dataRaw = JSON.parse(fs.readFileSync(targetFile).toString());
      await importWorkspaceData(dataRaw);
      // Force Insomnia to read all data
      // @ts-ignore
      window.main.restart();
    },
  },
];
