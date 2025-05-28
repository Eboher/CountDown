const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
    setAlwaysOnTop: (flag) => ipcRenderer.send('set-always-on-top', flag),
    getAlwaysOnTop: () => ipcRenderer.invoke('get-always-on-top')
}); 