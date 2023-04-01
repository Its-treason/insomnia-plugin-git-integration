import { getActiveProjectId } from '../../db/localStorageUtils';
import InternalDb from '../../db/InternalDb';
import alertModal from '../react/alertModal';
import renderModal from '../react/renderModal';

export default function configureGitRepoButton(projectDropdown: Element): HTMLElement {
  // TODO: Create dialog for better configuring the git repo

  const configureProjectButton = document.createElement('li');
  configureProjectButton.className = 'sc-crXcEl dTKZde';
  configureProjectButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-cog">
        </i>
        Configure project folder
      </div>
    </div>
  `;
  configureProjectButton.addEventListener('click', async () => {
    // "Close" the dropdown
    projectDropdown.remove();

    const projectId = getActiveProjectId();
    if (projectId === 'proj_default-project' || !projectId) {
      await renderModal(alertModal(
        'Cannnot configure Folder',
        'Cannot configure folder for default repository. Please create a now Project',
      ));
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

  // Hover effect
  configureProjectButton.addEventListener('mouseover', () => {
    configureProjectButton.className = 'sc-crXcEl UvQbr';
  });
  configureProjectButton.addEventListener('mouseout', () => {
    configureProjectButton.className = 'sc-crXcEl dTKZde';
  });

  return configureProjectButton;
}
