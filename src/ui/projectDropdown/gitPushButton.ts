import { SimpleGit, StatusResult } from 'simple-git';

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
      const origin = await gitClient.getRemotes();
      if (!origin) {
        alert('Not origin defined!')
        return;
      }

      const pushResult = await gitClient.push(origin[0].name, branch.current);

      alert(`Pushed ${pushResult.pushed.length} commits to ${origin[0].name}/${branch.current}`);
    } catch (error) {
      alert(`Failed to push with message: ${error}`);
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
