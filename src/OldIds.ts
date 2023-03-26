import { GitSavedRequest, GitSavedWorkspace } from './types';

export default class OldIds {
  private constructor(
    private environmentIds: string[],
    private requestIds: string[],
    private requestGroupIds: string[],
  ) {}

  public static createEmpty(): OldIds {
    return new OldIds([], [], []);
  }

  public static fromOldData(data: GitSavedWorkspace): OldIds {
    const environmentIds = data.environments.map((env) => env._id);

    const requestIds = [];
    const requestGroupIds = [];

    OldIds.getIdsRecursive(data.requests, requestIds, requestGroupIds);

    return new OldIds(environmentIds, requestIds, requestGroupIds);
  }

  private static getIdsRecursive(requests: GitSavedRequest[], requestIds: string[], requestGroupIds: string[]) {
    for (const request of requests) {
      if (request.type === 'group') {
        requestGroupIds.push(request.id);
        OldIds.getIdsRecursive(request.children, requestIds, requestGroupIds);
        continue;
      }

      requestIds.push(request.id);
    }
  }

  public getEnvironmentIds(): string[] {
    return this.environmentIds;
  }
  public removeEnvironmentId(id: string): void {
    const index = this.environmentIds.indexOf(id);
    if (index !== -1) {
      this.environmentIds.splice(index, 1);
    }
  }

  public getRequestIds(): string[] {
    return this.requestIds;
  }
  public removeRequestId(id: string): void {
    const index = this.requestIds.indexOf(id);
    if (index !== -1) {
      this.requestIds.splice(index, 1);
    }
  }

  public getRequestGroupId(): string[] {
    return this.requestGroupIds;
  }
  public removeRequestGroupId(id: string): void {
    const index = this.requestGroupIds.indexOf(id);
    if (index !== -1) {
      this.requestGroupIds.splice(index, 1);
    }
  }
}
