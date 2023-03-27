import { join } from 'node:path';
import InternalDb from '../db/InternalDb';
import { getActiveProjectId } from '../db/localStorageUtils';
import { exportProject } from '../exportData';
import fs from 'node:fs';
import { GitSavedProject, GitSavedWorkspace } from '../types';
import { importProject } from '../importData';

export default function addExportProjectButton() {
  // Check if the dropdown is opened
  const projectDropdown = document.querySelector('ul[aria-label="Create New Dropdown"]');
  if (projectDropdown === null) {
    return;
  }

  // Check if we are already added the new options
  const exising = document.getElementById('git-integration-project-dropdown')
  if (exising) {
    return;
  }

  // Create a wrapper element
  const li = document.createElement('li');
  li.id = 'git-integration-project-dropdown';
  li.role = 'presentation';
  projectDropdown.appendChild(li);

  // Create a seperator for the buttoons
  const seperatetor = document.createElement('div');
  seperatetor.innerHTML = `
    <span id="react-aria6002839293-469" aria-hidden="true" class="sc-breuTD cBnDcU">Git integration</span>
    <hr role="separator" class="sc-ksZaOG kutQZa">
  `;
  seperatetor.className = 'sc-evZas cJMyyw';
  li.appendChild(seperatetor);

  // Create a Button group
  const buttonGroup = document.createElement('ul');
  buttonGroup.role = 'group';
  buttonGroup.ariaLabel = 'Git integration import';
  buttonGroup.className = 'sc-hAZoDl gNdbbO';
  li.appendChild(buttonGroup);

  // Export Button
  const exportProjectButton = document.createElement('li');
  exportProjectButton.className = 'sc-crXcEl dTKZde';
  exportProjectButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-upload">
        </i>
        Export Project
      </div>
    </div>
  `;
  exportProjectButton.addEventListener('click', async () => {
    // "Close" the dropdown
    projectDropdown.remove();

    const projectId = getActiveProjectId();

    const config = InternalDb.create();
    const path = config.getProjectPath(projectId);
    if (!path || projectId === 'proj_default-project') {
      // TODO: Better error message
      alert('Project is not configured or default project')
      return;
    }

    const [projectData, workspaces] = await exportProject(projectId);

    const targetFile = join(path, 'project.json');
    fs.writeFileSync(targetFile, JSON.stringify(projectData, null, 2));

    for (const workspace of workspaces) {
      const targetFile = join(path, workspace.id + '.json');
      fs.writeFileSync(targetFile, JSON.stringify(workspace, null, 2));
    }
  });
  exportProjectButton.addEventListener('mouseover', () => {
    exportProjectButton.className = 'sc-crXcEl UvQbr';
  });
  exportProjectButton.addEventListener('mouseout', () => {
    exportProjectButton.className = 'sc-crXcEl dTKZde';
  });
  buttonGroup.appendChild(exportProjectButton);

  // Import button
  const importProjectButton = document.createElement('li');
  importProjectButton.className = 'sc-crXcEl dTKZde';
  importProjectButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-download">
        </i>
        Import Project
      </div>
    </div>
  `;
  importProjectButton.addEventListener('click', async () => {
    const projectId = getActiveProjectId();

    const config = InternalDb.create();
    const path = config.getProjectPath(projectId)
    if (!path || projectId === 'proj_default-project') {
      // TODO: Better error message
      alert('Project is not configured or default project')
      return;
    }

    // Read the Project file
    const projectFile = join(path, 'project.json');
    // TODO: Validate this using Zod
    const project: GitSavedProject = JSON.parse(fs.readFileSync(projectFile).toString());

    // Read all the workspace data
    const workspaceData: GitSavedWorkspace[] = [];
    for (const workspaceId of project.workspaceIds) {
      const workspaceFile = join(path, workspaceId + '.json');
      // TODO: Validate this using Zod
      const workspace: GitSavedWorkspace = JSON.parse(fs.readFileSync(workspaceFile).toString());
      workspaceData.push(workspace);
    }

    await importProject(project, workspaceData);

    // Force Insomnia to read all data again
    // @ts-ignore
    window.main.restart();
  });
  importProjectButton.addEventListener('mouseover', () => {
    importProjectButton.className = 'sc-crXcEl UvQbr';
  });
  importProjectButton.addEventListener('mouseout', () => {
    importProjectButton.className = 'sc-crXcEl dTKZde';
  });
  buttonGroup.appendChild(importProjectButton);

  // Configure Project button
  const configureProjectButton = document.createElement('li');
  configureProjectButton.className = 'sc-crXcEl dTKZde';
  configureProjectButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-cog">
        </i>
        Configure Git Repo
      </div>
    </div>
  `;
  configureProjectButton.addEventListener('click', async () => {
    // "Close" the dropdown
    projectDropdown.remove();

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
  });
  configureProjectButton.addEventListener('mouseover', () => {
    configureProjectButton.className = 'sc-crXcEl UvQbr';
  });
  configureProjectButton.addEventListener('mouseout', () => {
    configureProjectButton.className = 'sc-crXcEl dTKZde';
  });
  buttonGroup.appendChild(configureProjectButton);
}
