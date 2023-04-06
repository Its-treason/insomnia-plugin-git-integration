import React from 'react';
import { createRoot } from 'react-dom/client';
import UnmountContext from './UnmountContext';

export default async function renderModal<T>(Fn: React.FC): Promise<T | undefined> {
  let domNode = document.getElementById('git-integration-root');
  if (!domNode) {
    domNode = document.createElement('div');
    document.body.appendChild(domNode);
  }

  return new Promise((resolve) => {
    const root = createRoot(domNode, { identifierPrefix: 'git-integration' });

    const unmount = (value: T | undefined) => {
      root.unmount();
      resolve(value);
    };

    root.render((
      <UnmountContext.Provider value={unmount}>
        <Fn />
      </UnmountContext.Provider>
    ));
  });
}
