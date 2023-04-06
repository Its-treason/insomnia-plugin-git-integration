function superTrim(char: string, target: string): string {
  const pattern = new RegExp('^' + char + '+|' + char + '+$', 'g');
  const newStr = target.replace(pattern, '');
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
