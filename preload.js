// Puente seguro entre las ventanas y Electron: solo expone estas funciones (nada de acceso al sistema).
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktop', {
  // Ventana principal
  quickShortcut: () => ipcRenderer.invoke('quick:shortcut'),
  onQuickAdd: cb => ipcRenderer.on('quick:add', (_e, data) => cb(data)),
  // Ventanita de captura rápida
  onQuickOpen: cb => ipcRenderer.on('quick:open', () => cb()),
  submitQuick: data => ipcRenderer.send('quick:submit', data),
  closeQuick: () => ipcRenderer.send('quick:close')
});
