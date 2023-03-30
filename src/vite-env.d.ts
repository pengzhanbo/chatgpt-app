/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

declare namespace globalThis {
  import type { IpcRenderer } from 'electron'
  interface SafeElectron {
    // | 'postMessage' | 'emit' | 'once' | 'send' | 'sendSync'
    ipcRenderer: Pick<IpcRenderer, 'invoke' | 'on' | 'off'>
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
