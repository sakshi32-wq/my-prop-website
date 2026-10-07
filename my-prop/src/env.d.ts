/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** API origin + prefix. Defaults to "/api". */
  readonly VITE_API_BASE_URL?: string
  /** Set to "false" to skip the MSW worker and hit a real backend. */
  readonly VITE_API_MOCKING?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
