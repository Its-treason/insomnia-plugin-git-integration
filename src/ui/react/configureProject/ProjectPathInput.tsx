import React, { CSSProperties, useCallback, useMemo, useState } from 'react'
import { ProjectConfig } from '../../../db/InternalDb'
import fs from 'node:fs';
import ErrorBox from '../ErrorBox';
import produce from 'immer';

const buttonStyles: CSSProperties = {
  marginTop: '2rem',
  background: 'var(--color-surprise)',
  color: 'var(--color-font-surprise)',
  borderRadius: 'var(--radius-sm)',
}

type ProjectPathInputProps = {
  current: string | null,
  setProject: React.Dispatch<React.SetStateAction<ProjectConfig>>,
}

export default function ProjectPathInput({ current, setProject }: ProjectPathInputProps) {
  const [newPath, setNewPath] = useState(current);

  // This is basiclly a effect thats checks for path errors & updates the parent state
  const error = useMemo(() => {
    if (!newPath) {
      setProject(produce((draft) => {
        draft.repositoryPath = newPath;
      }));
      return null;
    }

    if (!fs.existsSync(newPath)) {
      return 'Path does not exists';
    }

    if (!fs.lstatSync(newPath).isDirectory()) {
      return 'Path does not refence a folder';
    }

    setProject(produce((draft) => {
      draft.repositoryPath = newPath;
    }));
    return null;
  }, [newPath]);

  const handleOpenDir = useCallback(async () => {
    // @ts-ignore
    const openResult = await window.dialog.showOpenDialog({ properties: ['openDirectory'] });
    if (openResult.canceled || openResult.filePaths.lenght === 0) {
      return;
    }

    setNewPath(openResult.filePaths[0]);
  }, []);

  return (
    <>
      <div className={'form-row'}>
        <div className={'form-control form-control--outlined'}>
          <label>
            Project path
            <input
              placeholder={'/home/user/insomnia-sync'}
              value={newPath || ''}
              onChange={(evt) => setNewPath(evt.currentTarget.value.trim())}
            />
          </label>
        </div>
        <div className={'form-control width-auto'}>
          <button style={buttonStyles} className={'btn btn--compact'} onClick={handleOpenDir}>Open directory</button>
        </div>
      </div>
      {error ? <ErrorBox>{error}</ErrorBox> : null}
    </>
  );
}
