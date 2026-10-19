const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const { createMenu } = require('./menu');

// Matikan akselerasi hardware GPU untuk mencegah crash 'GPU process exited unexpectedly' di Windows
app.disableHardwareAcceleration();
app.commandLine.appendSwitch('disable-gpu');
app.commandLine.appendSwitch('disable-software-rasterizer');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true
    },
    show: true,
    backgroundColor: '#0F172A',
    titleBarStyle: 'default',
    title: 'Inventaris Sekolah'
  });

  const isDev = process.env.NODE_ENV === 'development';
  const devUrl = 'http://127.0.0.1:3000';
  const prodFile = path.join(__dirname, '..', 'build', 'index.html');

  if (isDev) {
    mainWindow.loadURL(devUrl).catch(() => {
      if (fs.existsSync(prodFile)) {
        mainWindow.loadFile(prodFile);
      }
    });

    mainWindow.webContents.on('did-fail-load', (event, errorCode) => {
      if (errorCode === -102 || errorCode === -105 || errorCode === -106) {
        if (fs.existsSync(prodFile)) {
          mainWindow.loadFile(prodFile);
        } else {
          setTimeout(() => {
            if (mainWindow) mainWindow.loadURL(devUrl);
          }, 1500);
        }
      }
    });
  } else {
    mainWindow.loadFile(prodFile);
  }

  mainWindow.webContents.on('did-finish-load', () => {
    mainWindow.webContents.executeJavaScript(`
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.style.opacity = '0';
        setTimeout(() => splash.remove(), 500);
      }
    `).catch(() => {});
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  createMenu(mainWindow);
}

// IPC Handlers
ipcMain.handle('get-device-id', async () => {
  try {
    const { machineIdSync } = require('node-machine-id');
    return machineIdSync(true);
  } catch (e) {
    return 'local-device-id';
  }
});

ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

ipcMain.handle('select-directory', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory']
  });
  return result.canceled ? null : result.filePaths[0];
});

ipcMain.handle('save-file', async (event, options) => {
  const result = await dialog.showSaveDialog(mainWindow, {
    defaultPath: options.defaultPath || 'backup.db',
    filters: options.filters || [{ name: 'Database', extensions: ['db'] }]
  });
  return result.canceled ? null : result.filePath;
});

app.whenReady().then(async () => {
  try {
    // Start Express server
    const startServer = require('../server/index');
    await startServer();
    console.log('[Main] Express backend server started');
    createWindow();
  } catch (err) {
    console.error('Failed to start application:', err);
    dialog.showErrorBox('Startup Error', `Gagal memulai aplikasi: ${err.message}`);
    app.quit();
  }
});

app.on('window-all-closed', () => {
  const { closeDb } = require('../server/config/db');
  closeDb();
  app.quit();
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
});
