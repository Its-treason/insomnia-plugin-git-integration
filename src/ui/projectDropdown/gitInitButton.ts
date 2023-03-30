import { SimpleGit } from 'simple-git';

export default function gitInitButton(projectDropdown: Element, gitClient: SimpleGit): HTMLElement {
  const gitInitButton = document.createElement('li');
  gitInitButton.className = 'sc-crXcEl dTKZde';
  gitInitButton.innerHTML = `
    <div role="button" class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        <i class="sc-dIouRR GdBqH fa fa-plus">
        </i>
        Init Git repository
      </div>
    </div>
  `;
  gitInitButton.addEventListener('click', async () => {
    // "Close" the dropdown
    projectDropdown.remove();

    try {
      await gitClient.init();
    } catch (error) {
      alert(`Failed to fetch with message: ${error}`);
    }
  });

  // This makes the hover effect work
  gitInitButton.addEventListener('mouseover', () => {
    gitInitButton.className = 'sc-crXcEl UvQbr';
  });
  gitInitButton.addEventListener('mouseout', () => {
    gitInitButton.className = 'sc-crXcEl dTKZde';
  });

  return gitInitButton;
}
