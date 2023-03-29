import { SimpleGit, StatusResult } from 'simple-git';

export default function gitPullButton(projectDropdown: Element, gitClient: SimpleGit, statusResult: StatusResult): HTMLElement {
  const gitPullButton = document.createElement('li');
  gitPullButton.className = 'sc-crXcEl dTKZde';
  gitPullButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-code-merge">
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
      if (!remotes) {
        alert('Not origin defined!')
        return;
      }

      const pullResult = await gitClient.pull(remotes[0].name, branch.current);

      alert(`Pulled ${pullResult.files.length} changed files from ${remotes[0].name}/${branch.current}. Use import project to update the insomnia project`);
    } catch (error) {
      alert(`Failed to pull with message: ${error}`);
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
