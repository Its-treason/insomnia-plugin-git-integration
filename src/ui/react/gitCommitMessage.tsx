import React, { FC, useContext, useState } from 'react';
import BaseModal from './BaseModal';
import UnmountContext from './UnmountContext';
import useGitRepoInfo from './configureProject/useGitRepoInfo';

export default function gitCommitMessage(projectPath: string): FC {
  function GitCommitMessage() {
    const unmount = useContext(UnmountContext);
    const [message, setMessage] = useState('');

    const [repoInfo] = useGitRepoInfo(projectPath);

    let error: string | null = null;
    if (message.length === 0) {
      error = 'Commit message cannot be empty';
    }

    return (
      <BaseModal
        footer={(
          <button
            disabled={error !== null}
            className={'btn'}
            onClick={() => {
              unmount(message);
            }}
          >
            Commit
          </button>
        )}
        title={'Commit changes'}
      >
        <div className={'form-group'}>
          <div className={'form-control form-control--outlined'}>
            <label>
              Commit message
              <input
                type={'text'}
                value={message}
                onChange={(evt) => setMessage(evt.currentTarget.value)}
              />
            </label>
          </div>
        </div>
        <div style={{ margin: '16px 0 8px 0'}}>Staged files that will be commited:</div>
        <pre>
          {repoInfo.stagedFiles.join('\n')}
        </pre>
      </BaseModal>
    );
  }
  return GitCommitMessage;
}
