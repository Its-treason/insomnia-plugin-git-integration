import { getActiveProjectId } from '../../db/localStorageUtils';
import InternalDb from '../../db/InternalDb';
import fs from 'node:fs';
import { join } from 'node:path';
import { GitSavedProject, GitSavedWorkspace } from '../../types';
import { importProject } from '../../importData';

export default function importProjectButton(projectDropdown: Element): HTMLElement {
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
    // "Close" the dropdown
    projectDropdown.remove();

    const projectId = getActiveProjectId();
    if (!projectId) {
      alert('INTERNAL ERROR: Not ProjectId in LocalStorage')
      return;
    }

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

  // Hover effect
  importProjectButton.addEventListener('mouseover', () => {
    importProjectButton.className = 'sc-crXcEl UvQbr';
  });
  importProjectButton.addEventListener('mouseout', () => {
    importProjectButton.className = 'sc-crXcEl dTKZde';
  });

  return importProjectButton;
}
