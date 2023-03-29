import configureGitRepoButton from './configureGitRepoButton';
import exportProjectButton from './exportProjectButton';
import importProjectButton from './importProjectButton';

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
}
