export interface BaseModel {
  _id: string;
  type: string;
  // TSCONVERSION -- parentId is always required for all models, except 4:
  //   - Stats, Settings, and Project, which never have a parentId
  //   - Workspace optionally has a parentId (which will be the id of a Project)
  parentId: string; // or null
  modified: number;
  created: number;
  isPrivate: boolean;
  name: string;
}

// Environment
export type Environment = {
  name: string;
  data: Record<string, any>;
  dataPropertyOrder: Record<string, any> | null;
  color: string | null;
  metaSortKey: number;
  // For sync control
  isPrivate: boolean;
} & BaseModel;

// Project
export type Project = {
  name: string,
  remoteId?: string,
} & BaseModel;

// Workspace
export type Workspace = {
  scope: 'design' | 'collection',
} & BaseModel;

// WorkspaceMeta
export type WorkspaceMeta = {
  activeActivity: string | null;
  activeEnvironmentId: string | null;
  activeRequestId: string | null;
  activeUnitTestSuiteId: string | null;
  cachedGitLastAuthor: string | null;
  cachedGitLastCommitTime: number | null;
  cachedGitRepositoryBranch: string | null;
  gitRepositoryId: string | null;
  hasSeen: boolean;
  paneHeight: number;
  paneWidth: number;
  parentId: string | null;
  sidebarFilter: string;
  sidebarHidden: boolean;
  sidebarWidth: number;
  pushSnapshotOnInitialize: boolean;
} & BaseModel;

// Request
export type BaseRequest = {
  url: string;
  name: string;
  description: string;
  method: string;
  body: RequestBody;
  parameters: RequestParameter[];
  headers: RequestHeader[];
  authentication: Record<string, any>;
  metaSortKey: number;
  isPrivate: boolean;
  // Settings
  settingStoreCookies: boolean;
  settingSendCookies: boolean;
  settingDisableRenderRequestBody: boolean;
  settingEncodeUrl: boolean;
  settingRebuildPath: boolean;
  settingFollowRedirects: 'global' | 'on' | 'off';
} & BaseModel;

export interface RequestHeader {
  name: string;
  value: string;
  description?: string;
  disabled?: boolean;
}
export interface RequestParameter {
  name: string;
  value: string;
  disabled?: boolean;
  id?: string;
  fileName?: string;
}
export interface RequestBodyParameter {
  name: string;
  value: string;
  description?: string;
  disabled?: boolean;
  multiline?: string;
  id?: string;
  fileName?: string;
  type?: string;
}
export interface RequestBody {
  mimeType?: string | null;
  text?: string;
  fileName?: string;
  params?: RequestBodyParameter[];
}

// RequestMeta
export type RequestMeta = {
  parentId: string;
  previewMode: 'friendly' | 'source' | 'raw'; // This is PreviewMode from /common/constants
  responseFilter: string;
  responseFilterHistory: string[];
  activeResponseId: string | null;
  savedRequestBody: Record<string, any>;
  pinned: boolean;
  lastActive: number;
  downloadPath: string | null;
  expandedAccordionKeys: Partial<Record<'OAuth2AdvancedOptions', boolean>>;
} & BaseModel;

// RequestGroup
export type RequestGroup = {
  name: string;
  description: string;
  environment: Record<string, any>;
  environmentPropertyOrder: Record<string, any> | null;
  metaSortKey: number;
} & BaseModel;

// RequestGroupMeta
export type RequestGroupMeta = {
  collapsed: boolean,
} & BaseModel;

// ApiSpec
export type ApiSpec = {
  fileName: string;
  contentType: 'json' | 'yaml';
  contents: string;
} & BaseModel

// Unittest Suite
export type UnittestSuite = {
  name: string,
} & BaseModel

// Unittest
export type UnitTest = {
  name: string;
  code: string;
  requestId: string | null;
} & BaseModel;
