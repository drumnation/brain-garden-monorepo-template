import { contextBridge, ipcRenderer } from 'electron';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electron', {
  ping: () => ipcRenderer.invoke('ping'),
  // Add more API methods here as needed
  onMainMessage: (callback: (message: string) => void) => {
    ipcRenderer.on('main-process-message', (_event, message) => callback(message));
  },
});

export type ElectronAPI = {
  ping: () => Promise<string>;
  onMainMessage: (callback: (message: string) => void) => void;
};

declare global {
  interface Window {
    electron: ElectronAPI;
  }
}
