import { simpleGit } from 'simple-git';
import InternalDb from '../../db/InternalDb';
import { getActiveProjectId } from '../../db/localStorageUtils';
import configureGitRepoButton from './configureGitRepoButton';
import exportProjectButton from './exportProjectButton';
import importProjectButton from './importProjectButton';
import gitCommitButton from './gitCommitButton';
import gitPushButton from './gitPushButton';
import gitPullButton from './gitPullButton';
import gitFetchButton from './gitFetchButton';
import defaultProjectInfo from './defaultProjectInfo';

export default function projectDropdown() {
  // Check if the dropdown is opened
  const projectDropdown = document.querySelector('div[role="menu"][aria-label="Create in project actions"]');
  if (projectDropdown === null) {
    return;
  }

  // Check if we are already added the new options
  const exising = document.getElementById('git-integration-project-dropdown');
  if (exising) {
    return;
  }

  // Create a wrapper element
  const wrapper = document.createElement('div');
  wrapper.id = 'git-integration-project-dropdown';
  wrapper.role = 'presentation';
  projectDropdown.appendChild(wrapper);

  // Create a seperator for the buttoons
  const separator = document.createElement('div');
  separator.innerHTML = `
    <span id="react-aria6002839293-469" aria-hidden="true" class="ipgi-dropdown-heading-text">Git integration</span>
    <hr role="separator" class="ipgi-dropdown-heading-divider">
  `;
  separator.className = 'ipgi-dropdown-heading';
  wrapper.appendChild(separator);

  // Create a Button group
  const buttonGroup = document.createElement('ul');
  buttonGroup.role = 'group';
  buttonGroup.ariaLabel = 'Git integration import';
  buttonGroup.className = 'ipgi-dropdown-btn-group';
  wrapper.appendChild(buttonGroup);

  const projectId = getActiveProjectId();
  const config = InternalDb.create();
  const path = config.getProjectPath(projectId);

  // proj_default-project is the default 'Insomnia' project. We cant import / export that
  if (projectId === 'proj_default-project') {
    buttonGroup.appendChild(defaultProjectInfo());
    return;
  }
  buttonGroup.appendChild(configureGitRepoButton(projectDropdown));

  // Don't show export / import btns when path is not configured
  if (!path) {
    return;
  }
  buttonGroup.appendChild(exportProjectButton(projectDropdown));
  buttonGroup.appendChild(importProjectButton(projectDropdown));

  // Git buttons. Will only be added when "git status" succeeds
  const gitClient = simpleGit(path);

  gitClient.status().then(() => {
    buttonGroup.appendChild(gitCommitButton(projectDropdown, gitClient));
    buttonGroup.appendChild(gitPushButton(projectDropdown, gitClient));
    buttonGroup.appendChild(gitFetchButton(projectDropdown, gitClient));
    buttonGroup.appendChild(gitPullButton(projectDropdown, gitClient));
  }).catch(() => {
    // Error occurres when git is not inited. No need to handle that
    return;
  });
}
