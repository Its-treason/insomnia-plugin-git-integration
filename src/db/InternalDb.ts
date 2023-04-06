import fsPath from 'node:path';
import fs from 'node:fs';

export type ProjectConfig = {
  id: string,
  repositoryPath: string | null,
  remote: string | null,
  // TODO: For later, enable Sync using GitHub / GitLab OAuth-Apis (#1)
}

type InternalConfig = {
  projects: ProjectConfig[],
};

export default class InternalDb {
  private config: InternalConfig;

  private constructor() {
    // @ts-ignore
    const filename = fsPath.join(window.app.getPath('userData'), 'insomnia.plugin.git-integration.json');

    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, '');
    }

    // TODO: Validate this with ZOD
    const rawConfig = fs.readFileSync(filename).toString();
    if (!rawConfig || rawConfig.trim().length === 0) {
      this.config = { projects: [] };
      return;
    }
    this.config = JSON.parse(rawConfig.toString());
  }

  private save() {
    // @ts-ignore
    const filename = fsPath.join(window.app.getPath('userData'), 'insomnia.plugin.git-integration.json');

    fs.writeFileSync(filename, JSON.stringify(this.config, null, 2));
  }

  private static db: InternalDb;

  // This class is a singleton
  public static create(): InternalDb {
    if (!InternalDb.db) {
      InternalDb.db = new InternalDb();
    }

    return InternalDb.db;
  }

  public isProjectConfigured(projectId: string): boolean {
    return this.config.projects.find((project) => project.id === projectId) !== undefined;
  }

  public getProjectPath(projectId: string): string | null {
    return this.getProject(projectId).repositoryPath;
  }

  public getProject(projectId: string): ProjectConfig {
    const index = this.config.projects.findIndex((p) => p.id === projectId);
    if (index === -1) {
      return {
        id: projectId,
        remote: null,
        repositoryPath: null,
      };
    }

    return this.config.projects[index];
  }

  public upsertProject(project: ProjectConfig) {
    const existingIndex = this.config.projects.findIndex((p) => p.id === project.id);
    if (existingIndex !== -1) {
      this.config.projects[existingIndex] = project;
      return;
    }

    this.config.projects.push(project);
    this.save();
  }
}
