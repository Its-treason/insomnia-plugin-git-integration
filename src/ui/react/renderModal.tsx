import React from 'react';
import { createRoot } from 'react-dom/client';
import UnmountContext from './UnmountContext';

export default async function renderModal(Fn: React.FC): Promise<void> {
  let domNode = document.getElementById('git-integration-root');
  if (!domNode) {
    domNode = document.createElement('div');
    document.body.appendChild(domNode);
  }

  return new Promise((resolve) => {
    const root = createRoot(domNode, { identifierPrefix: 'git-integration' });

    const unmount = () => {
      root.unmount();
      resolve();
    }

    root.render((
      <UnmountContext.Provider value={unmount}>
        <Fn />
      </UnmountContext.Provider>
    ));
  })
}
