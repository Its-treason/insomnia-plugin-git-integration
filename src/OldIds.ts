import { GitSavedRequest, GitSavedWorkspace } from './types';

export default class OldIds {
  private constructor(
    private environmentIds: string[],
    private requestIds: string[],
    private requestGroupIds: string[],
    private testSuites: string[],
    private tests: string[],
  ) {}

  public static createEmpty(): OldIds {
    return new OldIds([], [], [], [], []);
  }

  public static fromOldData(data: GitSavedWorkspace): OldIds {
    const environmentIds = data.environments.map((env) => env._id);

    const requestIds = [];
    const requestGroupIds = [];

    OldIds.getIdsRecursive(data.requests, requestIds, requestGroupIds);

    const tests = [];
    const testSuites = data.unitTestSuites.map((testSuite) => {
      for (const test of testSuite.tests) {
        tests.push(test._id);
      }

      return testSuite.testSuite._id;
    })

    return new OldIds(environmentIds, requestIds, requestGroupIds, testSuites, tests);
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

  public getTestSuites(): string[] {
    return this.testSuites;
  }
  public removeTestSuites(id: string): void {
    const index = this.testSuites.indexOf(id);
    if (index !== -1) {
      this.testSuites.splice(index, 1);
    }
  }

  public getTests(): string[] {
    return this.tests;
  }
  public removeTest(id: string): void {
    const index = this.tests.indexOf(id);
    if (index !== -1) {
      this.tests.splice(index, 1);
    }
  }
}
