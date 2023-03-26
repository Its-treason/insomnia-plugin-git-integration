import { exportWorkspaceData } from './exportData';
import fs from 'node:fs';
import { importWorkspaceData } from './importData';

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
    label: 'Repo Sync - Export Workspace',
    icon: 'fa-download',
    action: async (context, models) => {
      console.log(context, models);

      // const repo = new WorkspaceRepo(context);
      // if (!(await verifyRepoConfig(repo, context))) return;

      // const path = await repo.getPath();
      // const rawJsonString = await context.data.export.insomnia({
      //   includePrivate: false,
      //   format: 'json',
      //   workspace: models.workspace,
      // });

      // const exported = JSON.parse(rawJsonString);

      // exported.resources.forEach((resource) => {
      //   // Insomnia update the `modified` of a resource even when the resource
      //   // has only been open in the app. This is very noisy when reviewing
      //   // changes in requests so `modified` is overwrite with `created` in
      //   // the exports
      //   if (resource.modified && resource.created) {
      //     resource.modified = resource.created;
      //   }

      //   // Secure cookie should not be sync because they could leak
      //   // authentication credentials
      //   if (resource._type === 'cookie_jar') {
      //     resource.cookies = resource.cookies.filter(
      //       (cookie) => !cookie.secure
      //     );
      //   }
      // });

      // fs.writeFileSync(
      //   `${path}/${models.workspace.name}.json`,
      //   JSON.stringify(exported, null, 2)
      // );
    },
  },
  {
    label: 'Repo Sync - Import Workspace',
    icon: 'fa-upload',
    action: async (context, models) => {
      // const repo = new WorkspaceRepo(context);
      // if (!(await verifyRepoConfig(repo, context))) return;

      // const path = await repo.getPath();
      // const imported = fs.readFileSync(
      //   `${path}/${models.workspace.name}.json`,
      //   'utf8'
      // );

      // await context.data.import.raw(imported);
    },
  },
  {
    label: 'Repo Sync - Configure',
    icon: 'fa-cog',
    action: async (context, models) => {
      // const repo = new WorkspaceRepo(context);

      // const repoPath = await ScreenHelper.askRepoPath(context, {
      //   currentPath: await repo.getPath(),
      //   workspaceName: models.workspace.name,
      // });
      // if (repoPath == null) return;

      // await repo.setPath(repoPath);
    },
  },
];
