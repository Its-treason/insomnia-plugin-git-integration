import { useCallback, useEffect, useState } from 'react';
import simpleGit from 'simple-git';

type GitRepoInfo = {
  commitsAhead: number,
  commitsBehind: number,
  currentBranch: string | null,
  stagedFiles: string[],
  unstagedFiles: string[],
  remotes: string[],
  inited: boolean,
}

const defaultInfo: GitRepoInfo = {
  commitsAhead: 0,
  commitsBehind: 0,
  currentBranch: null,
  inited: false,
  remotes: [],
  unstagedFiles: [],
  stagedFiles: [],
};

export default function useGitRepoInfo(path: string): [ GitRepoInfo, () => void ] {
  const [gitRepoInfo, setGitRepoInfo] = useState(defaultInfo);

  const updateInfo = useCallback(() => {
    (async () => {
      // Spread here to create a new Object. React will not see changes if the object reference is the same
      const info: GitRepoInfo = {...defaultInfo};

      const gitClient = simpleGit(path);
      try {
        const status = await gitClient.status();

        info.inited = true;
        info.stagedFiles = status.staged;
        info.unstagedFiles = status.not_added;
        info.currentBranch = status.current;
        info.commitsAhead = status.ahead;
        info.commitsBehind = status.behind;
      } catch (error) {
        setGitRepoInfo(info);
        return;
      }

      const remotes = await gitClient.getRemotes();
      info.remotes = remotes.map((remote) => remote.name);

      setGitRepoInfo(info);
    })().catch((error) => {
      console.error('Error while fetching git repo info', error);
    });
  }, [path]);

  useEffect(() => {
    updateInfo();
  }, [path]);

  return [gitRepoInfo, updateInfo];
}
