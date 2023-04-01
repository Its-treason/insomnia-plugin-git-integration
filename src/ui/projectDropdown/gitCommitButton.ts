import { getActiveProjectId } from '../../db/localStorageUtils';
import InternalDb from '../../db/InternalDb';
import fs from 'node:fs';
import { exportProject } from '../../exportData';
import { join } from 'node:path';
import { SimpleGit } from 'simple-git';
import renderModal from '../react/renderModal';
import alertModal from '../react/alertModal';

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
      await renderModal(alertModal('Internal error', 'No ProjectId found in LocalStorage'));
      return;
    }

    const config = InternalDb.create();
    const path = config.getProjectPath(projectId);
    if (!path || projectId === 'proj_default-project') {
      await renderModal(alertModal(
        'Cannot export Project',
        'You must first configure the project folder before exporting the project',
      ));
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
      await renderModal(alertModal('No changes', 'There are no changes to commited'));
      return;
    }

    try {
       await gitClient.commit(`Update Insomnia project "${projectData.name}"`);
    } catch (error) {
      await renderModal(alertModal('Fetch failed', 'An error occurred while fetching', error));
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
