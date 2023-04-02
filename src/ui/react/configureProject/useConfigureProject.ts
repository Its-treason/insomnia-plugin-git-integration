import { useMemo, useState } from 'react';
import useGitRepoInfo from './useGitRepoInfo';
import { ProjectConfig } from '../../../db/InternalDb';

export default function useConfigureProject(initalState: ProjectConfig) {
  const [project, setProject] = useState(initalState);

  const [repoInfo, updateRepoInfo] = useGitRepoInfo(project.repositoryPath || '/');

  const visible = useMemo(() => {
    const visible = {
      init: false,
      remotes: false,
    };

    if (!repoInfo.inited && project.repositoryPath) {
      visible.init = true;
    }

    if (repoInfo.inited) {
      visible.remotes = true;
    }

    return visible;
  }, [repoInfo, project]);

  return {
    project,
    setProject,
    repoInfo,
    updateRepoInfo,
    visible,
  }
}
