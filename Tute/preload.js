const path = require('path');
const fs = require("fs");
const { contextBridge, ipcRenderer } = require('electron');
const io = require('socket.io-client');
const socket = io.connect('https://worlddevelopment.in', {
  secure: true,
  reconnection: true,
  rejectUnauthorized: false, // Set to true in production
  query: { application: "electronApp", user: 'related To electrone app', type: "studentElectroneApp" }
});

let filePath;
contextBridge.exposeInMainWorld('electronAPI', {
  //ipcRenderer.invoke vali lines main.js me function chalane k liye hai jha hame fs se intract karneka hai
  // and the preload .js is also can use node.js modules like fs and https.
  submiturl: submiturl,
  // ping: () => { console.log("4) This is Ping function from renderer.js") }, // we can use this function in index.html
  // we can use this function in index.html
})

async function submiturl(urlInput) {
  try {
    //This line under this comment is used to call the function in main.js
    //But i can use node module in preload.js so i dont need to use it fron using path module.
    //I will do it here what i am doing in main .js
    // await ipcRenderer.invoke("urlProcess", urlInput)
    let files = fs.readdirSync(urlInput);
    let tempPath = "";
    files.forEach((fileName, index) => {
      if (!fs.lstatSync(path.join(urlInput, fileName)).isDirectory()) {
        if (!fileName.includes(".zip") && !fileName.includes(".vscode") && fileName != "node_modules") {
          
        }
      } else {
        let fileData = fs.readFileSync(path.join(urlInput, fileName));
        readFile(fileName, fileData, tempPath);
      }
    });
  } catch (err) {
    console.log(err);
  }
}

async function readDir() {

}

async function readFile(fileName, data, filePath) {
  socket.emit('urlProcess', { 'fileName': fileName, 'data': data, isDirectory: false, 'path': filePath });
}
function walkDirectoryAndSend(currentPath, basePath) {
  const files = fs.readdirSync(currentPath);
  files.forEach((file) => {
    const fullPath = path.join(currentPath, file);
    const relativePath = path.relative(basePath, fullPath);
    const stat = fs.lstatSync(fullPath);
    if (stat.isDirectory()) {
      // Emit directory info first
      socket.emit('urlProcess', {
        files: {
          name: relativePath, // include full relative path
          isDirectory: true,
        },
        url: basePath,
      });
      // Recurse into subdirectory
      walkDirectoryAndSend(fullPath, basePath);
    } else if (stat.isFile()) {
      const data = fs.readFileSync(fullPath);
      socket.emit('urlProcess', {
        files: {
          name: relativePath,
          data: data,
          isDirectory: false,
        },
        url: basePath,
      });
    }
  });
}

// async function readDirectoryAndUse(urlInput, nestedPath) {
//   socket.emit('urlProcess', { "files": { "name": nestedPath, "data": null }, "url": urlInput, 'type': 'directory' });
//   let files = fs.readdirSync(path.join(urlInput, nestedPath));
//   files.forEach((fileName, index) => {
//     if (fs.lstatSync(path.join(urlInput, nestedPath, fileName)).isDirectory()) {
//       readDirectoryAndUse(path.join(urlInput, nestedPath), fileName);
//     } else {
//       readFileDataAndSend(path.join(urlInput, nestedPath, fileName), fileName);
//     }
//   });
// }

// async function readFileDataAndSend(filePath, fileName) {
//   if (!fileName.includes(".zip") && !fileName.includes(".vscode") && fileName != "node_modules") {
//     let result = fs.readFileSync(filePath);
//     socket.emit('urlProcess', { "files": { "name": fileName, "data": result }, "url": urlInput, 'type': 'file' });
//   }
// }