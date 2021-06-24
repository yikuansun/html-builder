const { app, BrowserWindow, nativeTheme } = require("electron");

function createWindow () {

    const mainWindow = new BrowserWindow({
        width: 900,
        height: 500,
        webPreferences: {
            nodeIntegration: true,
            enableRemoteModule: true,
            contextIsolation: false
        }
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile("window/index.html");
    mainWindow.setIcon(__dirname + "/icons/icon.png");
    nativeTheme.themeSource = "light";

}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", function () { app.quit(); });