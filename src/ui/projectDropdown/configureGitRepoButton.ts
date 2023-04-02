import { getActiveProjectId } from '../../db/localStorageUtils';
import alertModal from '../react/alertModal';
import renderModal from '../react/renderModal';
import configureProject from '../react/configureProject';

export default function configureGitRepoButton(projectDropdown: Element): HTMLElement {
  const configureProjectButton = document.createElement('li');
  configureProjectButton.className = 'sc-crXcEl dTKZde';
  configureProjectButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-cog">
        </i>
        Configure project
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

    await renderModal(configureProject(projectId));
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
