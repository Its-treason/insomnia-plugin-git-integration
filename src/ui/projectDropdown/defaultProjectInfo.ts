export default function defaultProjectInfo(): HTMLElement {
  const defaultProjectInfo = document.createElement('li');
  defaultProjectInfo.className = 'ipgi-dropdown-btn-wrapper';
  // Remove the Curser Pointer
  defaultProjectInfo.style.cursor = 'unset';
  defaultProjectInfo.innerHTML = `
    <div class="ipgi-dropdown-btn">
      <div class="ipgi-dropdown-btn-text">
        Git integration does not work<br /> with the default project
      </div>
    </div>
  `;

  return defaultProjectInfo;
}
