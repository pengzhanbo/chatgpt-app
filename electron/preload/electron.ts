import { contextBridge, ipcRenderer } from 'electron'
import type { IpcRenderer } from 'electron'

const ipc: Partial<IpcRenderer> = {
  invoke: (channel, ...arg) => ipcRenderer.invoke(channel, ...arg),
  // postMessage: (channel, message, transfers) =>
  //   ipcRenderer.postMessage(channel, message, transfers),
  // send: (channel, ...args) => ipcRenderer.send(channel, ...args),
  // sendSync: (channel, ...args) => ipcRenderer.send(channel, ...args),
  // emit: (e, ...args) => ipcRenderer.emit(e, ...args),
  on: (channel, listener) => {
    ipcRenderer.on(channel, listener)
    return ipc as IpcRenderer
  },
  // once: (channel, listener) => {
  //   ipcRenderer.once(channel, listener)
  //   return ipc as IpcRenderer
  // },
  off: (channel, listener) => ipcRenderer.off(channel, listener),
}

declare const __APP_VERSION__: string

const electron = {
  ipcRenderer: ipc as IpcRenderer,
  process: {
    version: __APP_VERSION__,
    versions: {
      electron: process.versions.electron,
      node: process.versions.node,
      chrome: process.versions.chrome,
    },
  },
}

try {
  contextBridge.exposeInMainWorld('electron', electron)
} catch {}
