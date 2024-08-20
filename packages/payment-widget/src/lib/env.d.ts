/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_WEB3MODAL_PROJECT_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
