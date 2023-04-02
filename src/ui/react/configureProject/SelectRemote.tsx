import produce from 'immer';
import React, { useCallback } from 'react';
import { ProjectConfig } from '../../../db/InternalDb';
import ErrorBox from '../ErrorBox';

type SelectRemoteProps = {
  remotes: string[],
  currentRemote: string | null,
  setProject: React.Dispatch<React.SetStateAction<ProjectConfig>>,
}

export default function SelectRemote({ setProject, remotes, currentRemote }: SelectRemoteProps) {
  const handleChange = useCallback((evt) => {
    setProject(produce((draft) => {
      const newRemote = evt.target.value;
      if (newRemote === '__AUTO__') {
        draft.remote = null;
        return;
      }
      draft.remote = newRemote;
    }));
  }, []);

  if (remotes.length === 0) {
    return (
      <ErrorBox>
        No remotes defined. Use "git remote add REMOTE" to add a remote repository.
        See <a href='https://git-scm.com/book/en/v2/Git-Basics-Working-with-Remotes'>Working with Remotes</a> for help about remotes
      </ErrorBox>
    );
  }

  return (
    <div className={'form-control form-control--outlined'}>
      <label>
        Select remote
        <select
          value={currentRemote || '__AUTO__'}
          onChange={handleChange}
        >
          <option value={'__AUTO__'}>Auto</option>
          {remotes.map((remote) => {
            return <option key={remote} value={remote}>{remote}</option>;
          })}
        </select>
      </label>
    </div>
  );
}
