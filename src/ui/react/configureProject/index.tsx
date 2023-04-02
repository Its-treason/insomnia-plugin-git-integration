import React, { FC, useCallback, useContext } from 'react';
import BaseModal from '../BaseModal';
import useConfigureProject from './useConfigureProject';
import InternalDb from '../../../db/InternalDb';
import ProjectPathInput from './ProjectPathInput';
import InitGitRepositoryButton from './InitGItRepositoryButton';
import SelectRemote from './SelectRemote';
import UnmountContext from '../UnmountContext';

export default function configureProject(projectId: string): FC {
  const internalDb = InternalDb.create();
  const initialProject = internalDb.getProject(projectId);
  function ConfigureProjectModal() {
    const { project, repoInfo, setProject, updateRepoInfo, visible } = useConfigureProject(initialProject);
    const unmount = useContext(UnmountContext);

    const handleSave = useCallback(() => {
      internalDb.upsertProject(project);

      unmount();
    }, [project]);

    return (
      <BaseModal
        title={'Configure project'}
        footer={(
          <>
            <div className={'margin-left faint italic txt-sm'}></div>
            <button className={'btn'} onClick={handleSave}>Save project</button>
          </>
        )}
      >
        <div className={'form-group'}>
          <ProjectPathInput setProject={setProject} current={project.repositoryPath} />
          {visible.init ? (
            <InitGitRepositoryButton repositoryPath={project.repositoryPath} updateRepoInfo={updateRepoInfo} />
          ) : null}
          {visible.remotes ? (
            <SelectRemote currentRemote={project.remote} remotes={repoInfo.remotes} setProject={setProject} />
          ) : null}
        </div>
      </BaseModal>
    )
  }
  return ConfigureProjectModal;
}
