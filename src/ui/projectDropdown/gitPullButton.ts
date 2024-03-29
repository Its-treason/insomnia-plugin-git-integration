import { SimpleGit } from 'simple-git';
import renderModal from '../react/renderModal';
import alertModal from '../react/alertModal';
import InternalDb from '../../db/InternalDb';
import { getActiveProjectId } from '../../db/localStorageUtils';

export default function gitPullButton(projectDropdown: Element, gitClient: SimpleGit): HTMLElement {
  const gitPullButton = document.createElement('li');
  gitPullButton.className = 'ipgi-dropdown-btn-wrapper';
  gitPullButton.innerHTML = `
    <div role="button" class="ipgi-dropdown-btn">
      <div class="ipgi-dropdown-btn-text">
        <i class="ipgi-dropdown-btn-icon fa fa-code-merge">
        </i>
        Pull
      </div>
    </div>
  `;
  gitPullButton.addEventListener('click', async () => {
    // "Close" the dropdown
    projectDropdown.remove();

    try {
      const branch = await gitClient.branchLocal();
      const remotes = await gitClient.getRemotes();
      if (!remotes[0]) {
        await renderModal(alertModal('Unable to pull', 'No remotes defined for git repository'));
        return;
      }

      const projectId = getActiveProjectId();
      if (!projectId) {
        await renderModal(alertModal('Internal error', 'No ProjectId found in LocalStorage'));
        return;
      }

      const projectConfigDb = InternalDb.create();
      const projectConfig = projectConfigDb.getProject(projectId);

      const remote = projectConfig.remote ?? remotes[0].name;
      const pullResult = await gitClient.pull(remote, branch.current);

      await renderModal(alertModal(
        'Pull succeded',
        `Pulled ${pullResult.files.length} changed files from ${remotes[0].name}/${branch.current}. Use "Import Project" to update the insomnia project`,
      ));
    } catch (error) {
      await renderModal(alertModal('Pull failed', 'An error occurred while pulling new commits', error));
    }
  });

  // This makes the hover effect work
  gitPullButton.addEventListener('mouseover', () => {
    gitPullButton.className = 'sc-crXcEl UvQbr';
  });
  gitPullButton.addEventListener('mouseout', () => {
    gitPullButton.className = 'sc-crXcEl dTKZde';
  });

  return gitPullButton;
}
