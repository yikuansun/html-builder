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