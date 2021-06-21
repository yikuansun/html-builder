const { remote, app } = require("electron");
const { dialog } = remote;
const admZip = require("adm-zip");
const fs = require("fs");
const child_process = require("child_process");

var userDataPath = (app || remote.app).getPath("userData");

if (fs.existsSync(userDataPath + "/temp")) fs.rmdirSync(userDataPath + "/temp", { recursive: true });

var zip = new admZip();
zip.addLocalFolder(__dirname + "/template");
zip.extractAllTo(userDataPath + "/temp", true);

document.querySelector("#dirselect").onclick = function() {
    var directory_to_add = dialog.showOpenDialogSync({
        properties: ["openDirectory"]
    });
    if (directory_to_add) {
        directory_to_add = directory_to_add[0];

        document.querySelector("#dirlabel").innerText = directory_to_add;

        var zip = new admZip();
        zip.addLocalFolder(directory_to_add);
        zip.extractAllTo(userDataPath + "/temp/app", true);
    }
};

document.querySelector("#iconselect").onclick = function() {
    var file = dialog.showOpenDialogSync({
        properties: ["openFile"],
        filters: [
            { name: "Icon", extensions: ["png", "ico", "icns"] }
        ]
    });
    if (file) {
        file = file[0];
        fs.writeFileSync(userDataPath + "/temp/icon.png", fs.readFileSync(file));
        document.querySelector("#iconlabel").innerText = file;
    }
};

document.querySelector("#appname").onchange = function() {
    fs.writeFileSync(userDataPath + "/temp/package.json", fs.readFileSync(__dirname + "/template/package.json", "utf-8").replace("{app_name}", this.value));
}

document.querySelector("#apptheme").onchange = function() {
    fs.writeFileSync(userDataPath + "/temp/main.js", fs.readFileSync(__dirname + "/template/main.js", "utf-8").replace("{app_theme}", this.value));
}