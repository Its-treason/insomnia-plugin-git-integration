import { join } from 'node:path';
import InternalDb from '../db/InternalDb';
import { importProject } from '../importData';
import { GitSavedProject, GitSavedWorkspace } from '../types';
import fs from 'node:fs';
import path from 'node:path';

export default function importNewProjectButton() {
  const createProjectBtn = document.querySelector('i[data-testid="CreateProjectButton"]');
  if (!createProjectBtn) {
    return;
  }

  const existing = document.getElementById('git-integration-import-project');
  if (existing) {
    return;
  }

  const wrapper = createProjectBtn.parentElement!.parentElement!;

  const importProjectBtn = document.createElement('button');
  importProjectBtn.id = 'git-integration-import-project';
  importProjectBtn.role = 'button';
  importProjectBtn.className = 'sc-kDDrLX kfNync';
  importProjectBtn.innerHTML = '<i class="fa fa-git"></i>';
  importProjectBtn.style.padding = 'var(--padding-sm)';
  importProjectBtn.style.minWidth = 'auto';
  importProjectBtn.style.width = 'unset';
  importProjectBtn.style.flex = '0 1 0%';

  importProjectBtn.addEventListener('click', async () => {
    // @ts-ignore
    const openResult = await window.dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (openResult.canceled || openResult.filePaths.lenght === 0) {
      return;
    }
    const targetDir = openResult.filePaths[0];
    const projectFile = join(targetDir, 'project.json');
    if (!fs.existsSync(projectFile)) {
      alert('Dir does not include project.json file');
      return;
    }

    // TODO: Validate this using Zod
    const project: GitSavedProject = JSON.parse(fs.readFileSync(projectFile).toString());

    const config = InternalDb.create();
    config.upsertProject(project.id, openResult.filePaths[0], '');

    // Read all the workspace data
    const workspaceData: GitSavedWorkspace[] = [];
    for (const workspaceId of project.workspaceIds) {
      const workspaceFile = join(targetDir, workspaceId + '.json');
      // TODO: Validate this using Zod
      const workspace: GitSavedWorkspace = JSON.parse(fs.readFileSync(workspaceFile).toString());
      workspaceData.push(workspace);
    }

    await importProject(project, workspaceData);

    // Force Insomnia to read all data again
    // @ts-ignore
    window.main.restart();
  })

  wrapper.appendChild(importProjectBtn);
}
