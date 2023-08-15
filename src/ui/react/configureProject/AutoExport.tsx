import React, { useCallback } from 'react'
import { ProjectConfig } from '../../../db/InternalDb';
import { produce } from 'immer';

type AutoExportProps = {
  setProject: React.Dispatch<React.SetStateAction<ProjectConfig>>,
  project: ProjectConfig,
}

export default function AutoExport({ setProject, project }: AutoExportProps) {
  const handleChange = useCallback(() => {
    setProject(produce(draft => {
      draft.autoExport = !project.autoExport;
    }));
  }, [project, setProject]);

  if (project.repositoryPath === null) {
    return null;
  }

  return (
    <div className={'form-control'}>
      <label className="inline-block">
        Auto export and import when data is changed
        <input
          name="editorIndentWithTabs"
          type="checkbox"
          id={'ipgi-auto-export-checkbox'}
          checked={project.autoExport || false}
          onChange={handleChange}
        />
      </label>
    </div>
  );
}