import { getActiveProjectId } from '../../db/localStorageUtils';
import InternalDb from '../../db/InternalDb';
import { importProject, readProjectData } from '../../importData';
import alertModal from '../react/alertModal';
import renderModal from '../react/renderModal';

export default function importProjectButton(projectDropdown: Element): HTMLElement {
  const importProjectButton = document.createElement('li');
  importProjectButton.className = 'ipgi-dropdown-btn-wrapper';
  importProjectButton.innerHTML = `
    <div role="button" class="ipgi-dropdown-btn">
      <div class="ipgi-dropdown-btn-text">
        <i class="ipgi-dropdown-btn-icon fa fa-download">
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
      await renderModal(alertModal('Internal error', 'No ProjectId found in LocalStorage'));
      return;
    }

    const config = InternalDb.create();
    const path = config.getProjectPath(projectId);
    if (!path || projectId === 'proj_default-project') {
      await renderModal(alertModal(
        'Cannot import Project',
        'You must first configure the project folder before exporting the project',
      ));
      return;
    }

    const [project, workspaceData] = readProjectData(path);
    await importProject(project, workspaceData);

    // Force Insomnia to read all data again.
    // Wrapped with requestIdleCallback to make sure NeDB had enough time to save everything
    // @ts-ignore
    window.requestIdleCallback(window.main.restart);
  });

  return importProjectButton;
}
