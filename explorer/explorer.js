const path = require('path'),
    fs = require('fs');

function listFiles(directory = '') {
    let files = fs.readdirSync(directory == '' ? `C:/` : directory);

    return files;
};

async function listDrives() {
    var spawn = require("child_process").spawn;

    function listDrivesFunc() {
        const list = spawn('cmd');

        return new Promise((resolve, reject) => {
            list.stdout.on('data', function (data) {
                // console.log('stdout: ' + String(data));
                const output = String(data);
                const out = output.split("\r\n").map(e => e.trim()).filter(e => e != "");
                if (out[0] === "Name") {
                    resolve(out.slice(1));
                }
                // console.log("stdoutput:", out)
            });

            list.stderr.on('data', function (data) {
                // console.log('stderr: ' + data);
            });

            list.on('exit', function (code) {
                // console.log('child process exited with code ' + code);
                if (code !== 0) {
                    reject(code);
                }
            });

            list.stdin.write('wmic logicaldisk get name\n');
            list.stdin.end();
        });
    };
    let drives = await listDrivesFunc();
    let res = [];
    drives.forEach(d => {
        d = d + '/';
        res.push(d);
    });
    return res;
};

function displayFileContents(path) {
    let content = fs.readFileSync(path);
    content = content.toString();

    return content;
};

function editFileContents(path, data) {
    if (!fs.existsSync(path)) return console.error('File does not exist');
    let content = fs.readFileSync(path);
    content = content.toString();

    content = data;
    content = Buffer.from(content);

    fs.writeFileSync(path, content);
    return;
};

function createFile(path) {
    if (fs.existsSync(path)) return console.error('File already exists');

    return fs.writeFileSync(path, Buffer.from(''));
};

function createFolder(path) {
    if (fs.existsSync(path)) return console.error('Folder already exists');

    return fs.mkdirSync(path);
};

function renameFile(path, newPath) {
    if (!fs.existsSync(path)) return console.error('File does not exist');

    return fs.renameSync(path, newPath);
};

function removeFile(path) {
    if (!fs.existsSync(path)) return console.error('File does not exist');

    if (fs.statSync(path).isDirectory()) {
        return fs.rmdirSync(path);
    } else {
        return fs.unlinkSync(path);
    };
};

function searchFile(key, thisFolder, searchEverywhere = false) {
    if (searchEverywhere == false) {
        var files = fs.readdirSync(thisFolder);

        let response = [];

        for (i = 0; i < files.length; i++) {
            if (files[i].includes(key)) response.push(files[i]);
        };

        return response;
    } else if (searchEverywhere == true) {
        function searchForFile(directory, filename) {
            const files = fs.readdirSync(directory);

            let matches = [];

            for (const file of files) {
                const filePath = path.join(directory, file);
                const fileStat = fs.statSync(filePath);

                if (fileStat.isDirectory()) {
                    const foundFilePath = searchForFile(filePath, filename);

                    if (foundFilePath) {
                        matches.push(...foundFilePath);
                    };
                } else if (file === filename) {
                    matches.push(filePath);
                } else if (file.includes(filename)) {
                    matches.push(filePath);
                }
            };
            return matches.length == 0 ? null : matches;
        }
        return searchForFile(thisFolder, key);
    };
};

module.exports = { listFiles, listDrives, displayFileContents, editFileContents, createFile, createFolder, renameFile, removeFile, searchFile };