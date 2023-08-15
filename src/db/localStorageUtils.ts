export function getActiveProjectId(): string | null {
  const projectId = localStorage.getItem('locationHistoryEntry').split('/')[4];
  return projectId || null;
}

export function getActiveWorkspace(): string | null {
  const projectId = localStorage.getItem('locationHistoryEntry').split('/')[6];
  return projectId || null;
}
