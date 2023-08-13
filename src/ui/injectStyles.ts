import fs from 'node:fs';
import path from 'node:path';

export default function injectStyles() {
  const head = document.querySelector('head');
  const existing = document.querySelector('#git-integration-styles');
  if (!head || existing) {
    return;
  }

  const styleTag = document.createElement('style');
  styleTag.id = 'git-integration-styles';
  styleTag.innerHTML = fs.readFileSync(path.join(__dirname, 'style.css')).toString();
  head.appendChild(styleTag);
}
