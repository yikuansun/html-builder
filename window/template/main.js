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
    mainWindow.loadFile("app/index.html");
    mainWindow.maximize();
    nativeTheme.themeSource = "{app_theme}";

}

app.whenReady().then(() => {
    createWindow();
});

app.on("window-all-closed", function () { app.quit(); });