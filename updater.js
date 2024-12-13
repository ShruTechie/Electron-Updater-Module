const { dialog } = require('electron');
const {autoUpdater}  = require('electron-updater');

autoUpdater.logger = require("electron-log")
autoUpdater.logger.transports.file.level = "info"


autoUpdater.autoDownload = false;
const updateURL = 'http://localhost:8080';  // Local URL for updates



module.exports = () => {

    autoUpdater.setFeedURL(updateURL);

    setTimeout(() => {
        console.log("Manually checking for updates...");
        if (process.env.NODE_ENV === 'development') {
            autoUpdater.checkForUpdates();

        } else {
            // In production, let autoUpdater handle updates normally
            autoUpdater.checkForUpdatesAndNotify();
        }
    }, 5000);  // Check every 5 seconds
    
    // autoUpdater.checkForUpdatesAndNotify();

    // autoUpdater.checkForUpdates()

      autoUpdater.on('error', (err) => {
        // console.error('Error during update check:', err);
    });
    
    autoUpdater.on('update-not-available', () => {
        console.log('No update available');
    });
    


    // autoUpdater.on('update-downloaded', (info) => {
    //     console.log('Update downloaded:', info);
    
    //     dialog.showMessageBox({
    //         type: 'info',
    //         title: 'Update Ready',
    //         message: 'The update has been downloaded. Do you want to restart the app and install it now?',
    //         buttons: ['Restart', 'Later']
    //     }).then((result) => {
    //         if (result.response === 0) { // User clicked "Restart"
    //             autoUpdater.quitAndInstall(false, true);
    //         }
    //     });
    // });

    autoUpdater.on('update-available', (info) => {
        console.log('Update available:', info);
    
        // Automatically start the download process
        // autoUpdater.downloadUpdate();
    });
    
    
}