const { app, BrowserWindow, nativeTheme } = require("electron");

function createWindow () {

    const mainWindow = new BrowserWindow({
        width: 900,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true
        }
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile("window/index.html");
    nativeTheme.themeSource = "dark";

}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", function () { app.quit(); });