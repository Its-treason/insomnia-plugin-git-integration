import React, { CSSProperties, useCallback, useState } from 'react';
import simpleGit from 'simple-git';
import ErrorBox from '../ErrorBox';

const buttonStyles: CSSProperties = {
  margin: '1rem auto 0 auto',
  background: 'var(--color-surprise)',
  color: 'var(--color-font-surprise)',
  borderRadius: 'var(--radius-sm)',
};

type InitGitRepositoryButtonProps = {
  updateRepoInfo: () => void,
  repositoryPath: string,
}

export default function InitGitRepositoryButton({ updateRepoInfo, repositoryPath }: InitGitRepositoryButtonProps) {
  const [error, setError] = useState<string | null>(null);

  const handleInit = useCallback(async () => {
    const gitClient = simpleGit(repositoryPath);

    try {
      await gitClient.init();
    } catch (error) {
      setError(String(error));
    }

    updateRepoInfo();
  }, []);

  return (
    <>
      <div className={'form-control'}>
        <button className={'btn'} onClick={handleInit} style={buttonStyles}>
          Init Git repository in selected directory
        </button>
      </div>
      {error ? (
        <ErrorBox>{error}</ErrorBox>
      ) : null}
    </>
  );
}
