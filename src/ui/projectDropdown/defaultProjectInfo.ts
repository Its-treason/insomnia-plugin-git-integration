export default function defaultProjectInfo(): HTMLElement {
  const defaultProjectInfo = document.createElement('li');
  defaultProjectInfo.className = 'sc-crXcEl dTKZde';
  // Remove the Curser Pointer
  defaultProjectInfo.style.cursor = 'unset';
  defaultProjectInfo.innerHTML = `
    <div class="sc-hHLeRK fIvtTx">
      <div class="sc-kgflAQ ldFYrA">
        Git integration does not work<br /> with the default project
      </div>
    </div>
  `;

  return defaultProjectInfo;
}
