const { shell } = require("electron");
const remote = require("@electron/remote");
const { dialog, app } = remote;
const admZip = require("adm-zip");
const fs = require("fs");
const { exec } = require("child_process");
const fixPath = require("fix-path");

fixPath();

var userDataPath = app.getPath("temp");

function clearTemp() {
        fs.rmdirSync(userDataPath + "/temp", { recursive: true });
}

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
            { name: "PNG Icon", extensions: ["png"] }
        ]
    });
    if (file) {
        file = file[0];
        if (!fs.existsSync(`${userDataPath}/temp/htmlbuilder-buildresources`)) fs.mkdirSync(`${userDataPath}/temp/htmlbuilder-buildresources`);
        fs.copyFileSync(file, `${userDataPath}/temp/htmlbuilder-buildresources/icon.png`);
        document.querySelector("#iconlabel").innerText = file;
    }
};

document.querySelector("#appname").onchange = function() {
    var packagedata = JSON.parse(fs.readFileSync(userDataPath + "/temp/package.json"));
    packagedata["productName"] = this.value;
    packagedata["build"]["appId"] = "com.electron.htmlapp" + Math.floor(Math.random() * 1000).toString();
    fs.writeFileSync(userDataPath + "/temp/package.json", JSON.stringify(packagedata));
};

document.querySelector("#appdesc").onchange = function() {
    var packagedata = JSON.parse(fs.readFileSync(userDataPath + "/temp/package.json"));
    packagedata["description"] = this.value;
    fs.writeFileSync(userDataPath + "/temp/package.json", JSON.stringify(packagedata));
};

document.querySelector("#version").onchange = function() {
    var packagedata = JSON.parse(fs.readFileSync(userDataPath + "/temp/package.json"));
    packagedata["version"] = this.value;
    fs.writeFileSync(userDataPath + "/temp/package.json", JSON.stringify(packagedata));
};

document.querySelector("#apptheme").onchange = function() {
    fs.writeFileSync(userDataPath + "/temp/main.js", fs.readFileSync(__dirname + "/template/main.js", "utf-8").replace("{app_theme}", this.value));
};

document.querySelector("#package").onclick = function() {
    if (document.querySelector("#dirlabel").innerHTML == "" || document.querySelector("#iconlabel").innerHTML == "" || document.querySelector("#appname").value == "" || document.querySelector("#apptheme").value == "" || document.querySelector("#platform").value == "") {
        alert("Fill out all fields");
        return false;
    }

    var platform = document.querySelector("#platform").value;
    var productName = document.querySelector("#appname").value;

    document.querySelector("#form").innerHTML = "Building in progress...";

    exec(`cd "${userDataPath + "/temp"}"&& npm install&& npm run build-${platform}`, (error, stdout, stderr) => {
        if (error) {
            dialog.showErrorBox("Error!", error.message);
            return;
        }
        /*if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }*/
        console.log(`stdout: ${stdout}`);

        var zip = new admZip();
        zip.addLocalFolder(`${userDataPath}/temp/dist`);

        var downloadLocation = dialog.showSaveDialogSync(null, {
            defaultPath: `${(app || remote.app).getPath("downloads")}/${productName}`,
        });

        document.querySelector("#form").innerHTML = "Exporting...";

        zip.extractAllTo(downloadLocation);

        clearTemp();
        document.querySelector("#form").innerHTML = `
            <h2>Thank you for using HTML Builder!</h2>
            <button onclick="shell.openExternal('https://github.com/yikuansun/html-builder/issues')" class="button">Submit feedback</button>
            <br /><br /> <button onclick="location.reload();" class="button">Make another app</button>
        `;
    });
};