import { getActiveProjectId } from '../../db/localStorageUtils';
import InternalDb from '../../db/InternalDb';
import fs from 'node:fs';
import { exportProject } from '../../exportData';
import { join } from 'node:path';
import { SimpleGit } from 'simple-git';
import renderModal from '../react/renderModal';
import alertModal from '../react/alertModal';
import gitCommitMessage from '../react/gitCommitMessage';

export default function gitCommitButton(projectDropdown: Element, gitClient: SimpleGit): HTMLElement {
  const gitCommitButton = document.createElement('li');
  gitCommitButton.className = 'ipgi-dropdown-btn-wrapper';
  gitCommitButton.innerHTML = `
    <div role="button" class="ipgi-dropdown-btn">
      <div class="ipgi-dropdown-btn-text">
        <i class="ipgi-dropdown-btn-icon fa fa-check">
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

    const commitMessage = await renderModal<string>(gitCommitMessage(path));
    if (!commitMessage) {
      return;
    }

    try {
      await gitClient.commit(commitMessage);
    } catch (error) {
      await renderModal(alertModal('commit failed', 'An error occurred while fetching', error));
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
