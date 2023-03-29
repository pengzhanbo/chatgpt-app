/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare namespace globalThis {
  import type { IpcRenderer } from 'electron'
  interface SafeElectron {
    ipcRenderer: Pick<IpcRenderer, 'invoke' | 'postMessage' | 'emit' | 'on' | 'once' | 'send' | 'sendSync' | 'off'>
    process: {
      version: string
      versions: {
        electron: string
        node: string
        chrome: string
      }
    }
  }

  const electron: SafeElectron

  export { electron }
}
