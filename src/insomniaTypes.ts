/* eslint @typescript-eslint/no-unused-vars: 0 */
import { Readable } from 'node:stream';

/** context.request: https://docs.insomnia.rest/insomnia/context-object-reference#contextrequest */
interface RequestContext {
  getId(): string;
  getName(): string;
  getUrl(): string;
  setUrl(url: string): void;
  getMethod(): string;
  setMethod(method: string): void;
  getHeaders(): Array<{ name: string, value: string }>;
  getHeader(name: string): string | null;
  hasHeader(name: string): boolean;
  removeHeader(name: string): void;
  setHeader(name: string, value: string): void;
  addHeader(name: string, value: string): void;
  getParameter(name: string): string | null;
  getParameters(): Array<{ name: string, value: string }>;
  setParameter(name: string, value: string): void;
  hasParameter(name: string): boolean;
  addParameter(name: string, value: string): void;
  removeParameter(name: string): void;
  getBody(): RequestBody;
  setBody(body: RequestBody): void;
  getEnvironmentVariable(name: string): unknown;
  getEnvironment(): object;
  setAuthenticationParameter(name: string, value: string): void;
  getAuthentication(): object;
  setCookie(name: string, value: string): void;
  settingSendCookies(enabled: boolean): void;
  settingStoreCookies(enabled: boolean): void;
  settingEncodeUrl(enabled: boolean): void;
  settingDisableRenderRequestBody(enabled: boolean): void;
  settingFollowRedirects(enabled: boolean): void;
}

interface RequestBody {
  mimeType?: string;
  text?: string;
  fileName?: string;
  params?: RequestBodyParameter[];
}

interface RequestBodyParameter {
  name: string;
  value: string;
  description?: string;
  disabled?: boolean;
  multiline?: string;
  id?: string;
  fileName?: string;
  type?: string;
}

/** context.response: https://docs.insomnia.rest/insomnia/context-object-reference#contextresponse */
interface ResponseContext {
  getRequestId(): string;
  getStatusCode(): number;
  getStatusMessage(): string;
  getBytesRead(): number;
  getTime(): number;
  getBody(): Buffer | null;
  getBodyStream(): Readable;
  setBody(body: Buffer);
  getHeader(name: string): string | Array<string> | null;
  getHeaders(): Array<{ name: string, value: string }> | undefined;
  hasHeader(name: string): boolean,
}

/** context.store: https://docs.insomnia.rest/insomnia/context-object-reference#contextstore */
interface StoreContext {
  hasItem(key: string): Promise<boolean>;
  setItem(key: string, value: string): Promise<void>;
  getItem(key: string): Promise<string | null>;
  removeItem(key: string): Promise<void>;
  clear(): Promise<void>;
  all(): Promise<Array<{ key: string, value: string }>>;
}

/** context.app: https://docs.insomnia.rest/insomnia/context-object-reference#contextapp */
interface AppContext {
  getInfo(): { version: string, platform: string };
  alert(title: string, message?: string): Promise<void>;

  dialog(title: string, body: HTMLElement, options?: {
    onHide?: () => void;
    tall?: boolean;
    skinny?: boolean;
    wide?: boolean;
  }): void;

  prompt(title: string, options?: {
    label?: string;
    defaultValue?: string;
    submitName?: string;
    cancelable?: boolean;
  }): Promise<string>;

  getPath(name: string): string;

  showSaveDialog(options?: {
    defaultPath?: string;
  }): Promise<string | null>;

  clipboard: {
    readText(): string;
    writeText(text: string): void;
    clear(): void;
  };
}

/** context.data https://docs.insomnia.rest/insomnia/context-object-reference#contextdata */
interface ImportOptions {
    workspaceId?: string;
    workspaceScope?: 'design' | 'collection';
}

interface DataContext {
    import: {
        uri(uri: string, options?: ImportOptions): Promise<void>;
        raw(text: string, options?: ImportOptions): Promise<void>;
    },
    export: {
        insomnia(options?: { 
            includePrivate?: boolean,
            format?: 'json' | 'yaml',
        }): Promise<string>;
        har(options?: { includePrivate?: boolean }): Promise<string>;
    }
}

/** context.network https://docs.insomnia.rest/insomnia/context-object-reference#contextnetwork */
interface NetworkContext {
    sendRequest(request: Request): Promise<Response>;
}
