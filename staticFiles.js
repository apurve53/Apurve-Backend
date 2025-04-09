//Reading for all public shared folders and getting files name to allow them in requests.
// This is a simple example of how to use the `fs` module to read files in a directory
const fs = require('fs');
const path = require('path');

// Base project directory (can be adjusted if script runs from a different place)
const baseDir = __dirname;

// Folders to scan
const foldersToScan = ['SBMcss', 'SBMuploads', 'SBMjs'];

/**
 * Recursively gets all file paths from a directory
 */
function getAllFilesRecursive(dirPath, fileList = []) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);
        if (entry.isDirectory()) {
            getAllFilesRecursive(fullPath, fileList);
        } else {
            fileList.push('/' + path.basename(fullPath));
        }
    }
    return fileList;
}



urlFiles = {
    getAllFilesUrls: function () {
        const allFiles = [];
        for (const folder of foldersToScan) {
            const fullPath = path.join(baseDir, folder);
            if (fs.existsSync(fullPath)) {
                const filesInFolder = getAllFilesRecursive(fullPath);
                allFiles.push(...filesInFolder);
            } else {
                console.warn(`Folder not found: ${folder}`);
            }
        }
        return allFiles;
    }
}
module.exports = urlFiles;
