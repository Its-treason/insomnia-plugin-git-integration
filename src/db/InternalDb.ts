import fsPath from 'node:path';
import fs from 'node:fs';

type InternalConfig = {
  projects: {
    id: string,
    repositoryPath: string,
    subFolder: string,
  }[],
};

export default class InternalDb {
  private config: InternalConfig;

  private constructor() {
    // @ts-ignore
    const filename = fsPath.join(window.app.getPath('userData'), `insomnia.plugin.git-integration.json`);

    if (!fs.existsSync(filename)) {
      fs.writeFileSync(filename, '');
    }

    const rawConfig = fs.readFileSync(filename).toString();
    if (!rawConfig || rawConfig.trim().length === 0) {
      this.config = { projects: [] };
      return;
    }
    this.config = JSON.parse(rawConfig.toString());
  }

  private save() {
    // @ts-ignore
    const filename = fsPath.join(window.app.getPath('userData'), `insomnia.plugin.git-integration.json`);

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
    const index = this.config.projects.findIndex((p) => p.id === projectId);
    if (index === -1) {
      return null;
    }

    const { repositoryPath, subFolder } = this.config.projects[index];

    return fsPath.join(repositoryPath, subFolder);
  }

  public upsertProject(projectId: string, repositoryPath: string, subFolder: string) {
    const existing = this.config.projects.findIndex((p) => p.id === projectId);
    if (existing !== -1) {
      this.config.projects[existing] = { id: projectId, repositoryPath, subFolder };
      return;
    }

    this.config.projects.push({
      id: projectId,
      repositoryPath,
      subFolder,
    });
    this.save();
  }
}
