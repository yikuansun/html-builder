const { app, BrowserWindow, nativeTheme } = require("electron");

require('@electron/remote/main').initialize();

function createWindow () {

    const mainWindow = new BrowserWindow({
        width: 900,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        },
        icon: __dirname + "/icons/icon.png"
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile("window/index.html");
    mainWindow.setIcon(__dirname + "/icons/icon.png");
    nativeTheme.themeSource = "light";

    require('@electron/remote/main').enable(mainWindow.webContents)

}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", function () { app.quit(); });