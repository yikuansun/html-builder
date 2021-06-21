const { app, BrowserWindow, nativeTheme } = require("electron");

function createWindow () {

    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 900,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    mainWindow.setMenuBarVisibility(false);
    mainWindow.loadFile("window/index.html");
    mainWindow.maximize();
    nativeTheme.themeSource = "dark";

}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", function () { app.quit(); });