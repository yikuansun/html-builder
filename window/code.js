const { remote, app, shell } = require("electron");
const { dialog } = remote;
const admZip = require("adm-zip");
const fs = require("fs");
const { exec } = require("child_process");
const png2icons = require("png2icons");
const fixPath = require("fix-path");

fixPath();

var userDataPath = (app || remote.app).getPath("temp");

function clearTemp() {
    switch (process.platform) {
        case "win32":
            exec(`cd ${userDataPath}&&RMDIR /S /Q temp`);
            break;
        default:
            exec(`cd ${userDataPath}&&rm -R temp`);
            break;
    }
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
        var file_read = fs.readFileSync(file);

        png2icons.setLogger(console.log);
        var output = png2icons.createICNS(file_read, png2icons.BILINEAR, 0);
        if (output) fs.writeFileSync(`${userDataPath}/temp/icon.icns`, output);

        output = png2icons.createICO(file_read, png2icons.BILINEAR, 0);
        if (output) fs.writeFileSync(`${userDataPath}/temp/icon.ico`, output);

        fs.writeFileSync(`${userDataPath}/temp/icon.png`, file_read);

        document.querySelector("#iconlabel").innerText = file;
    }
};

document.querySelector("#appname").onchange = function() {
    fs.writeFileSync(userDataPath + "/temp/package.json", fs.readFileSync(__dirname + "/template/package.json", "utf-8").replace("{app_name}", this.value));
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
            console.log(`error: ${error.message}`);
            return;
        }
        /*if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }*/
        console.log(`stdout: ${stdout}`);

        var zip = new admZip();
        zip.addLocalFolder(`${userDataPath}/temp/${productName}-${platform}-x64`);

        var downloadLocation = dialog.showSaveDialogSync(null, {
            defaultPath: `${(app || remote.app).getPath("downloads")}/${productName}.zip`,
            filters: [
                { name: "ZIP", extensions: ["zip"] }
            ]
        });

        document.querySelector("#form").innerHTML = "Exporting...";

        zip.writeZip(downloadLocation);

        clearTemp();
        document.querySelector("#form").innerHTML = `
            <h2>Thank you for using HTML Builder!</h2>
            <button onclick="shell.openExternal('https://github.com/yikuansun/html-builder/issues')" class="button">Submit feedback</button>
            <br /> <button onclick="location.reload();" class="button">Make another app</button>
        `;
    });
};