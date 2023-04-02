import { simpleGit, SimpleGit } from 'simple-git';
import InternalDb from '../../db/InternalDb';
import { getActiveProjectId } from '../../db/localStorageUtils';
import configureGitRepoButton from './configureGitRepoButton';
import exportProjectButton from './exportProjectButton';
import importProjectButton from './importProjectButton';
import gitCommitButton from './gitCommitButton';
import gitPushButton from './gitPushButton';
import gitPullButton from './gitPullButton';
import gitFetchButton from './gitFetchButton';

export default function projectDropdown() {
  // Check if the dropdown is opened
  const projectDropdown = document.querySelector('ul[aria-label="Create New Dropdown"]');
  if (projectDropdown === null) {
    return;
  }

  // Check if we are already added the new options
  const exising = document.getElementById('git-integration-project-dropdown')
  if (exising) {
    return;
  }

  // Create a wrapper element
  const li = document.createElement('li');
  li.id = 'git-integration-project-dropdown';
  li.role = 'presentation';
  projectDropdown.appendChild(li);

  // Create a seperator for the buttoons
  const seperatetor = document.createElement('div');
  seperatetor.innerHTML = `
    <span id="react-aria6002839293-469" aria-hidden="true" class="sc-breuTD cBnDcU">Git integration</span>
    <hr role="separator" class="sc-ksZaOG kutQZa">
  `;
  seperatetor.className = 'sc-evZas cJMyyw';
  li.appendChild(seperatetor);

  // Create a Button group
  const buttonGroup = document.createElement('ul');
  buttonGroup.role = 'group';
  buttonGroup.ariaLabel = 'Git integration import';
  buttonGroup.className = 'sc-hAZoDl gNdbbO';
  li.appendChild(buttonGroup);

  const projectId = getActiveProjectId();
  const config = InternalDb.create();
  const path = config.getProjectPath(projectId);

  // proj_default-project is the default 'Insomnia' project. We cant import / export that
  if (projectId === 'proj_default-project') {
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

  gitClient.status().then(statusResult => {
    buttonGroup.appendChild(gitCommitButton(projectDropdown, gitClient));
    buttonGroup.appendChild(gitPushButton(projectDropdown, gitClient, statusResult));
    buttonGroup.appendChild(gitFetchButton(projectDropdown, gitClient, statusResult));
    buttonGroup.appendChild(gitPullButton(projectDropdown, gitClient, statusResult));
  }).catch((reason) => {}); // Error occurres when git is not inited. No need to handle that
}
