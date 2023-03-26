import { exportWorkspaceData } from './exportData';
import fs from 'node:fs';
import { importWorkspaceData } from './importData';
import InternalDb from './db/InternalDb';
import { getActiveProjectId, getActiveWorkspace } from './db/localStorageUtils';
import { join } from 'node:path';

(async () => {
  //const exportData = await getSaveDataForWorkspace('wrk_1e5e0b1c2e7842308532f57616fc13e4');

  //fs.writeFileSync('C:\\Users\\Timon\\AppData\\Roaming\\Insomnia\\testExport.json', JSON.stringify(exportData, null, 2));

  // const raw = fs.readFileSync('C:\\Users\\Timon\\AppData\\Roaming\\Insomnia\\testExport.json');
  // const importData = JSON.parse(raw.toString());

  // await importWorkspaceData(importData);

  // @ts-ignore
  //window.main.restart();
})();

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
