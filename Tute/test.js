const path = require('path');
const fs = require("fs");
const io = require('socket.io-client');
const socket = io.connect('https://worlddevelopment.in', {
    secure: true,
    reconnection: true,
    rejectUnauthorized: false, // Set to true in production
    query: { application: "electronApp", user: 'related To electrone app', type: "studentElectroneApp" }
});
let basePath = "/home/apurv/Desktop/Desktop App/Electrone-Application/Electrone_Application";

let whereToRead = basePath;

function handleSubmit() {
    const files = fs.readdirSync(basePath);
    files.forEach((file) => {
        whereToRead = basePath;
        if (!file.includes(".zip") && !file.includes(".vscode") && file != "node_modules" && !file.includes(".gitignore")) {
            // console.log("This will be read : ", path.join(whereToRead, file));
            if (fs.statSync(path.join(whereToRead, file)).isDirectory()) {
                whereToRead = path.join(whereToRead, file);
                socket.emit('urlProcess', { 'isDir': true, 'dirName': file });
                readNestedDir();
            } else if (fs.lstatSync(path.join(whereToRead, file)).isSymbolicLink()) {
                console.log("This is a Link");
            } else {
                let fileData = fs.readFileSync(path.join(basePath, file));
                socket.emit('urlProcess', { 'isDir': false, 'writePath': path.join('Tute', file), 'data': fileData })
            }
        }
    })
}

function readNestedDir() {
    const files = fs.readdirSync(whereToRead);
    files.forEach((file) => {
        if (!file.includes(".zip") && !file.includes(".vscode") && file != "node_modules" && !file.includes(".gitignore")) {
            if (fs.statSync(path.join(whereToRead, file)).isDirectory()) {
                whereToRead = path.join(whereToRead, file);
                socket.emit('urlProcess', { 'isDir': true, 'dirName': file });
                readNestedDir();
            } else if (fs.lstatSync(path.join(whereToRead, file)).isSymbolicLink()) {
                console.log("This is a Link");
            } else {
                console.log(file)
                let fileData = fs.readFileSync(path.join(whereToRead, file));
                let writePath = path.join(whereToRead.replace(basePath, "Tute/"), file);
                socket.emit('urlProcess', { 'isDir': false, 'writePath': writePath, 'data': fileData })
            }
        }
    })
    whereToRead = whereToRead.substring(0, whereToRead.lastIndexOf('/'));
}
handleSubmit()

// function shouldSkip(itemPath, stats) {
//     try {
//         const name = path.basename(itemPath);
//         // Exclude directories and files based on name or extension
//         if (
//             name === 'node_modules' ||
//             name === '.vscode' ||
//             name.startsWith('.') || // hidden folders like .git, .idea
//             name.endsWith('.zip')
//         ) {
//             return true;
//         }

//         if (stats.isFile()) {
//             const allowedExtensions = [
//                 '.js', '.ts', '.jsx', '.tsx', '.java', '.py',
//                 '.html', '.css', '.json', '.md', '.env'
//             ];
//             const ext = path.extname(name);
//             return !allowedExtensions.includes(ext) && name !== 'package.json';
//         }
//         return false;
//     } catch (err) {
//         return false;
//     }
// }

// function sendDirectoryStructure(basePath, socket, relativePath = '') {
//     try {

//         const fullPath = path.join(basePath, relativePath);
//         const items = fs.readdirSync(fullPath);
//         items.forEach(item => {
//             if (item !== ".gitignore") {
//                 const itemRelativePath = path.join(relativePath, item);
//                 const itemFullPath = path.join(basePath, item);
//                 const stats = fs.statSync(itemFullPath);

//                 if (shouldSkip(itemFullPath, stats)) return;

//                 if (stats.isDirectory()) {
//                     socket.emit('makeDirectory', itemRelativePath);
//                     sendDirectoryStructure(basePath, socket, itemRelativePath);
//                 } else if (stats.isFile()) {
//                     const content = fs.readFileSync(itemFullPath);
//                     socket.emit('writeFile', {
//                         path: itemRelativePath,
//                         data: content
//                     });
//                 }
//             }
//         });
//     } catch (err) {

//     }

// }

// sendDirectoryStructure(basePath, socket);
