import { join } from 'node:path';
import InternalDb from '../db/InternalDb';
import { importProject } from '../importData';
import { GitSavedProject, GitSavedWorkspace } from '../types';
import fs from 'node:fs';
import alertModal from './react/alertModal';
import renderModal from './react/renderModal';

export default function importNewProjectButton() {
  const createProjectBtn = document.querySelector('i[data-testid="CreateProjectButton"]');
  if (!createProjectBtn) {
    return;
  }

  const existing = document.getElementById('git-integration-import-project');
  if (existing) {
    return;
  }

  const wrapper = createProjectBtn.parentElement?.parentElement;
  if (!wrapper) {
    return;
  }

  const importProjectBtn = document.createElement('button');
  importProjectBtn.id = 'git-integration-import-project';
  importProjectBtn.role = 'button';
  importProjectBtn.className = 'ipgi-import-btn';
  importProjectBtn.innerHTML = '<i class="fa fa-git"></i>';

  importProjectBtn.addEventListener('click', async () => {
    // @ts-ignore
    const openResult = await window.dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (openResult.canceled || openResult.filePaths.lenght === 0) {
      return;
    }
    const targetDir = openResult.filePaths[0];
    const projectFile = join(targetDir, 'project.json');
    if (!fs.existsSync(projectFile)) {
      await renderModal(alertModal(
        'Invalid folder',
        'This folder does not contain files to import (e.g. "project.json", "wrk_*.json")',
      ));
      return;
    }

    // TODO: Validate this using Zod
    const project: GitSavedProject = JSON.parse(fs.readFileSync(projectFile).toString());

    const configDb = InternalDb.create();
    const projectConfig = configDb.getProject(project.id);

    projectConfig.repositoryPath = openResult.filePaths[0];

    configDb.upsertProject(projectConfig);

    // Read all the workspace data
    const workspaceData: GitSavedWorkspace[] = [];
    for (const workspaceId of project.workspaceIds) {
      const workspaceFile = join(targetDir, workspaceId + '.json');
      // TODO: Validate this using Zod
      const workspace: GitSavedWorkspace = JSON.parse(fs.readFileSync(workspaceFile).toString());
      workspaceData.push(workspace);
    }

    await importProject(project, workspaceData);

    // Force Insomnia to read all data again.
    // Wrapped with requestIdleCallback to make sure NeDB had enough time to save everything
    // @ts-ignore
    window.requestIdleCallback(window.main.restart);
  });

  wrapper.appendChild(importProjectBtn);
}
