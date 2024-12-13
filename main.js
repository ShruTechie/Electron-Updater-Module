const { app, BrowserWindow, dialog, session } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');

log.transports.file.level = 'info';
log.info('Starting Electron App...');

Object.defineProperty(app, 'isPackaged', {
  get() {
    return true;
  }
});

if (true) {
  autoUpdater.autoDownload = false;

  autoUpdater.setFeedURL({
    provider: 'generic',
    url: 'http://127.0.0.1:8080/updateFiles/', 
  });

  autoUpdater.checkForUpdatesAndNotify();
}

log.info('Current version:', app.getVersion());

let mainWindow;
app.on('ready', () => {
  log.info('App is ready');

  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  mainWindow.loadFile('./renderer/main.html');

  // mainWindow.webContents.openDevTools();

  autoUpdater.logger = log;

  autoUpdater.on('checking-for-update', () => {
    log.info('Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    log.info('Update available:', info);
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'An update is available. The download will start now.',
    });
  });

  autoUpdater.on('update-not-available', (info) => {
    log.info('No update available:', info);
  });

  autoUpdater.on('error', (err) => {
    log.error('Error during auto-update:', err);
    dialog.showMessageBox({
      type: 'error',
      title: 'Update Error',
      message: 'An error occurred while checking for updates......',
    });
  });

  autoUpdater.on('download-progress', (progressObj) => {
    log.info('Download progress:', progressObj);
  });

  autoUpdater.on('update-downloaded', (info) => {
    log.info('Update downloaded:', info);
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'Update has been downloaded and is ready to install. Do you want to install it now?',
      buttons: ['Yes', 'Later'],
    }).then(result => {
      if (result.response === 0) { 
        autoUpdater.quitAndInstall();
      }
    });
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

autoUpdater.on('update-available', () => {
  log.info('Update is available, starting the update download...');
});
