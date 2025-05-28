const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');

// Keep a global reference of the window object to avoid garbage collection
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 370,
    height: 340,
    minWidth: 320,
    minHeight: 300,
    maxWidth: 420,
    maxHeight: 400,
    resizable: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // Load the index.html file
  mainWindow.loadFile('index.html');

  // Open the DevTools during development
  // mainWindow.webContents.openDevTools();

  // Emitted when the window is closed
  mainWindow.on('closed', function () {
    // Dereference the window object
    mainWindow = null;
  });
}

// 监听置顶请求
ipcMain.on('set-always-on-top', (event, flag) => {
  if (mainWindow) {
    mainWindow.setAlwaysOnTop(!!flag);
  }
});

ipcMain.handle('get-always-on-top', () => {
  if (mainWindow) {
    return mainWindow.isAlwaysOnTop();
  }
  return false;
});

// Create the window when Electron has finished initializing
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

// On macOS re-create window when dock icon is clicked
app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// Handle any uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('An uncaught error occurred:', error);
});

function setPinBtnState(pinned) {
    isPinned = pinned;
    pinBtn.classList.toggle('pinned', isPinned);
    pinBtn.textContent = isPinned ? '📌' : '🔗'; // 置顶/未置顶不同图标
}

