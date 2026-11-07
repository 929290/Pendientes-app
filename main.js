const { app, BrowserWindow, globalShortcut, ipcMain, screen } = require('electron');
const path = require('path');

// Atajos para la captura rápida: se usa el primero que Windows deje registrar
const SHORTCUTS = [
  ['Control+Alt+Space', 'Ctrl + Alt + Espacio'],
  ['Control+Shift+Space', 'Ctrl + Mayús + Espacio'],
  ['Control+Alt+N', 'Ctrl + Alt + N']
];

const webPreferences = {
  preload: path.join(__dirname, 'preload.js'),
  contextIsolation: true,
  nodeIntegration: false,
  sandbox: true
};

let win = null;         // ventana principal
let quick = null;       // ventanita de captura rápida
let shortcutLabel = null;

// Una sola instancia: si abres la app otra vez, enfoca la que ya está abierta
if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.on('second-instance', () => {
    if (win) { if (win.isMinimized()) win.restore(); win.show(); win.focus(); }
  });

  app.whenReady().then(() => {
    createWindow();
    registerShortcut();
    app.on('activate', () => { if (!win) createWindow(); });
  });

  app.on('will-quit', () => globalShortcut.unregisterAll());
}

function createWindow() {
  win = new BrowserWindow({
    width: 1180,
    height: 780,
    minWidth: 900,
    minHeight: 600,
    backgroundColor: '#0e1014',
    autoHideMenuBar: true,
    title: 'Pendientes',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences
  });
  win.loadFile('index.html');
  // Al cerrar la ventana principal se cierra la app (la ventanita oculta no debe mantenerla viva)
  win.on('closed', () => {
    win = null;
    if (process.platform !== 'darwin') app.quit();
  });
}

function registerShortcut() {
  for (const [accel, label] of SHORTCUTS) {
    try {
      if (globalShortcut.register(accel, toggleQuick)) { shortcutLabel = label; return; }
    } catch {}
  }
}

function createQuick() {
  quick = new BrowserWindow({
    width: 600,
    height: 140,
    show: false,
    frame: false,
    transparent: true,
    backgroundColor: '#00000000',
    resizable: false,
    minimizable: false,
    maximizable: false,
    fullscreenable: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    title: 'Captura rápida',
    webPreferences
  });
  quick.loadFile('quick.html');
  quick.on('blur', () => { if (quick && !quick.isDestroyed()) quick.hide(); });
  quick.on('closed', () => { quick = null; });
}

function toggleQuick() {
  if (!win) return;
  if (!quick) createQuick();
  if (quick.isVisible()) { quick.hide(); return; }
  // Aparece centrada, arriba, en la pantalla donde está el ratón
  const { workArea } = screen.getDisplayNearestPoint(screen.getCursorScreenPoint());
  const [w] = quick.getSize();
  quick.setPosition(Math.round(workArea.x + (workArea.width - w) / 2), Math.round(workArea.y + workArea.height * 0.22));
  quick.show();
  quick.focus();
  quick.webContents.send('quick:open');
}

ipcMain.handle('quick:shortcut', () => shortcutLabel);

ipcMain.on('quick:submit', (e, data) => {
  if (!quick || e.sender.id !== quick.webContents.id) return;
  const title = data && typeof data.title === 'string' ? data.title.trim().slice(0, 120) : '';
  const category = data && typeof data.category === 'string' ? data.category.slice(0, 60) : '';
  if (title && win) win.webContents.send('quick:add', { title, category });
  quick.hide();
});

ipcMain.on('quick:close', e => {
  if (quick && e.sender.id === quick.webContents.id) quick.hide();
});
