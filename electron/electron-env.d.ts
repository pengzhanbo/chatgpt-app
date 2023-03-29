/// <reference types="vite-plugin-electron/electron-env" />

declare namespace NodeJS {
  interface ProcessEnv {
    VSCODE_DEBUG?: 'true'
    DIST_ELECTRON: string
    DIST: string
    NODE_MODULES_PATH: string
    /** /dist/ or /public/ */
    PUBLIC: string
  }
}

declare module 'isomorphic-fetch' {
  const result: any
  export default result
}
