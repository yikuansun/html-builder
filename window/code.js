const { shell } = require("electron");
const remote = require("@electron/remote");
const { dialog, app } = remote;
const admZip = require("adm-zip");
const fs = require("fs");
const { exec } = require("child_process");
const fixPath = require("fix-path");
const buildApp = require("html-builder-cli");

fixPath();

var userDataPath = app.getPath("temp");

var userOptions = {
    name: "", platforms: [], desc: "", version: "", icon: "", colorScheme: ""
};
var appPath = "";

document.querySelector("#dirselect").onclick = function() {
    var directory_to_add = dialog.showOpenDialogSync({
        properties: ["openDirectory"]
    });
    if (directory_to_add) {
        directory_to_add = directory_to_add[0];

        document.querySelector("#dirlabel").innerText = directory_to_add;
        appPath = directory_to_add;
    }
};

document.querySelector("#iconselect").onclick = function() {
    var file = dialog.showOpenDialogSync({
        properties: ["openFile"],
        filters: [
            { name: "PNG Icon", extensions: ["png"] }
        ]
    });
    if (file) {
        file = file[0];
        userOptions.icon = file;
        document.querySelector("#iconlabel").innerText = file;
    }
};

document.querySelector("#appname").onchange = function() {
    userOptions.name = this.value;
};

document.querySelector("#appdesc").onchange = function() {
    userOptions.desc = this.value;
};

document.querySelector("#version").onchange = function() {
    userOptions.version = this.value;
};

document.querySelector("#apptheme").onchange = function() {
    userOptions.colorScheme = this.value;
};

document.querySelector("#platform").addEventListener("change", function() {
    userOptions.platforms = [ this.value ];
});

document.querySelector("#package").onclick = function() {
    if (document.querySelector("#dirlabel").innerHTML == "" || document.querySelector("#iconlabel").innerHTML == "" || document.querySelector("#appname").value == "" || document.querySelector("#apptheme").value == "" || document.querySelector("#platform").value == "") {
        alert("Fill out all fields");
        return false;
    }

    document.querySelector("#form").innerHTML = "Building in progress...";

    buildApp(appPath, userOptions);

        var downloadLocation = dialog.showSaveDialogSync(null, {
            defaultPath: `${(app || remote.app).getPath("downloads")}/${userOptions.name}`,
        });

        document.querySelector("#form").innerHTML = "Exporting...";

        fs.renameSync(`${appPath}/html-builder_output`, downloadLocation);

        document.querySelector("#form").innerHTML = `
            <h2>Thank you for using HTML Builder!</h2>
            <button onclick="shell.openExternal('https://github.com/yikuansun/html-builder/issues')" class="button">Submit feedback</button>
            <br /> <button onclick="location.reload();" class="button">Make another app</button>
        `;
};