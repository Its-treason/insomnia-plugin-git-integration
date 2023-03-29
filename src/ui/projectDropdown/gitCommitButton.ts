import { getActiveProjectId } from '../../db/localStorageUtils';
import InternalDb from '../../db/InternalDb';
import fs from 'node:fs';
import { exportProject } from '../../exportData';
import { join } from 'node:path';
import { SimpleGit } from 'simple-git';

export default function gitCommitButton(projectDropdown: Element, gitClient: SimpleGit): HTMLElement {
  const gitCommitButton = document.createElement('li');
  gitCommitButton.className = 'sc-crXcEl dTKZde';
  gitCommitButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-check">
        </i>
        Commit changes
      </div>
    </div>
  `;
  gitCommitButton.addEventListener('click', async () => {
    // "Close" the dropdown
    projectDropdown.remove();

    const projectId = getActiveProjectId();
    if (!projectId) {
      alert('INTERNAL ERROR: Not ProjectId in LocalStorage')
      return;
    }

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
    await gitClient.add(targetFile);

    for (const workspace of workspaces) {
      const targetFile = join(path, workspace.id + '.json');
      fs.writeFileSync(targetFile, JSON.stringify(workspace, null, 2));

      await gitClient.add(targetFile);
    }

    const status = await gitClient.status();
    if (status.staged.length === 0) {
      alert('Nothing to commit!');
      return;
    }

    try {
       await gitClient.commit(`Update Insomnia project "${projectData.name}"`);
    } catch (error) {
      alert(`Failed to commit with message: ${error}`);
    }
  });

  // This makes the hover effect work
  gitCommitButton.addEventListener('mouseover', () => {
    gitCommitButton.className = 'sc-crXcEl UvQbr';
  });
  gitCommitButton.addEventListener('mouseout', () => {
    gitCommitButton.className = 'sc-crXcEl dTKZde';
  });

  return gitCommitButton;
}
