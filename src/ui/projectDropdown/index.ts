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

  buttonGroup.appendChild(exportProjectButton(projectDropdown));
  buttonGroup.appendChild(importProjectButton(projectDropdown));
  buttonGroup.appendChild(configureGitRepoButton(projectDropdown));

  // Git Buttons
  const projectId = getActiveProjectId();
  if (!projectId) {
    // TODO: Check this at the beginning and show disabled buttons
    console.error('Not showing git: No projectId');
    return;
  }

  const config = InternalDb.create();
  const path = config.getProjectPath(projectId);
  if (!path || projectId === 'proj_default-project') {
    // TODO: Show these buttons as disabled
    console.error('Not showing git: Invalid path');
    return;
  }

  let gitClient: SimpleGit;

  try {
    gitClient = simpleGit(path);

    gitClient.status().then(statusResult => {
      buttonGroup.appendChild(gitCommitButton(projectDropdown, gitClient));
      buttonGroup.appendChild(gitPushButton(projectDropdown, gitClient, statusResult));
      buttonGroup.appendChild(gitFetchButton(projectDropdown, gitClient, statusResult));
      buttonGroup.appendChild(gitPullButton(projectDropdown, gitClient, statusResult));
    }).catch()
  } catch {
    // TODO: Show these buttons as disabled & Add Option to init git dir
    return;
  }
}
