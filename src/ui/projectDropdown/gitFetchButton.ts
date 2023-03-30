import { SimpleGit, StatusResult } from 'simple-git';

export default function gitFetchButton(projectDropdown: Element, gitClient: SimpleGit, statusResult: StatusResult): HTMLElement {
  const gitFetchButton = document.createElement('li');
  gitFetchButton.className = 'sc-crXcEl dTKZde';
  gitFetchButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-cloud-arrow-down">
        </i>
        Fetch
      </div>
    </div>
  `;
  gitFetchButton.addEventListener('click', async () => {
    // "Close" the dropdown
    projectDropdown.remove();

    try {
      await gitClient.fetch();
    } catch (error) {
      alert(`Failed to fetch with message: ${error}`);
    }
  });

  // This makes the hover effect work
  gitFetchButton.addEventListener('mouseover', () => {
    gitFetchButton.className = 'sc-crXcEl UvQbr';
  });
  gitFetchButton.addEventListener('mouseout', () => {
    gitFetchButton.className = 'sc-crXcEl dTKZde';
  });

  return gitFetchButton;
}
