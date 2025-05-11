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

function shouldSkip(itemPath, stats) {
    try {
        const name = path.basename(itemPath);
        // Exclude directories and files based on name or extension
        if (
            name === 'node_modules' ||
            name === '.vscode' ||
            name.startsWith('.') || // hidden folders like .git, .idea
            name.endsWith('.zip')
        ) {
            return true;
        }

        if (stats.isFile()) {
            const allowedExtensions = [
                '.js', '.ts', '.jsx', '.tsx', '.java', '.py',
                '.html', '.css', '.json', '.md', '.env'
            ];
            const ext = path.extname(name);
            return !allowedExtensions.includes(ext) && name !== 'package.json';
        }
        return false;
    } catch (err) {
        return false;
    }
}

function sendDirectoryStructure(basePath, socket, relativePath = '') {
    try {

        const fullPath = path.join(basePath, relativePath);
        const items = fs.readdirSync(fullPath);
        items.forEach(item => {
            if (item !== ".gitignore") {
                const itemRelativePath = path.join(relativePath, item);
                const itemFullPath = path.join(basePath, item);
                const stats = fs.statSync(itemFullPath);

                if (shouldSkip(itemFullPath, stats)) return;

                if (stats.isDirectory()) {
                    socket.emit('makeDirectory', itemRelativePath);
                    sendDirectoryStructure(basePath, socket, itemRelativePath);
                } else if (stats.isFile()) {
                    const content = fs.readFileSync(itemFullPath);
                    socket.emit('writeFile', {
                        path: itemRelativePath,
                        data: content
                    });
                }
            }
        });
    } catch (err) {

    }

}

sendDirectoryStructure(basePath, socket);
