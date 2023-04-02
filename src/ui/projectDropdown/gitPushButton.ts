import { SimpleGit, StatusResult } from 'simple-git';
import alertModal from '../react/alertModal';
import renderModal from '../react/renderModal';
import { getActiveProjectId } from '../../db/localStorageUtils';
import InternalDb from '../../db/InternalDb';

export default function gitPushButton(projectDropdown: Element, gitClient: SimpleGit, statusResult: StatusResult): HTMLElement {
  const gitPushButton = document.createElement('li');
  gitPushButton.className = 'sc-crXcEl dTKZde';
  gitPushButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-code-pull-request">
        </i>
        Push
      </div>
    </div>
  `;
  gitPushButton.addEventListener('click', async () => {
    // "Close" the dropdown
    projectDropdown.remove();

    try {
      const branch = await gitClient.branchLocal();
      const remotes = await gitClient.getRemotes();
      if (!remotes[0]) {
        await renderModal(alertModal('Unable to push', 'No remotes defined for git repository'));
        return;
      }

      const projectId = getActiveProjectId();
      if (!projectId) {
        await renderModal(alertModal('Internal error', 'No ProjectId found in LocalStorage'));
        return;
      }

      const projectConfigDb = InternalDb.create();
      const projectConfig = projectConfigDb.getProject(projectId)

      const remote = projectConfig.remote ?? remotes[0].name;

      const pushResult = await gitClient.push(remote, branch.current);

      await renderModal(alertModal('Pushed commits', `Pushed ${pushResult.pushed.length} commits to ${remotes[0].name}/${branch.current}`));
    } catch (error) {
      await renderModal(alertModal('Push failed', 'An error occurred while pushing commits', error));
    }
  });

  // This makes the hover effect work
  gitPushButton.addEventListener('mouseover', () => {
    gitPushButton.className = 'sc-crXcEl UvQbr';
  });
  gitPushButton.addEventListener('mouseout', () => {
    gitPushButton.className = 'sc-crXcEl dTKZde';
  });

  return gitPushButton;
}
