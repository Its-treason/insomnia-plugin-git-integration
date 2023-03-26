function superTrim(char: string, target: string): string {
  let pattern = new RegExp("^" + char + "+|" + char + "+$", "g");
  let newStr = target.replace(pattern, "");
  return newStr;
}

export function getActiveProjectId(): string | null {
  const projectId = window.localStorage.getItem('insomnia::meta::activeProjectId');
  if (!projectId) {
    return null;
  }

  return superTrim('"', projectId);
}

export function getActiveWorkspace(): string | null {
  const workspaceId = window.localStorage.getItem('insomnia::meta::activeWorkspaceId');
  if (!workspaceId) {
    return null;
  }

  return superTrim('"', workspaceId);
}
