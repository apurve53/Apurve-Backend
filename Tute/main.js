const { app, BrowserWindow, ipcMain, BrowserView } = require('electron')
app.disableHardwareAcceleration();
// const io = require('socket.io-client');
const path = require('path');
// const { Socket } = require('dgram');
let filePath;
// const socket = io('http://192.168.1.2:4500');
const preloadPath = path.join(__dirname, 'preload.js');
function createWindow() {
  try {
    const win = new BrowserWindow({
      webPreferences: {
        preload: preloadPath, // Load this script *before* the renderer
        contextIsolation: true,  // Required for security
        nodeIntegration: false,   // Prevents direct Node.js access in renderer
        sandbox: false,
      },
      width: 800,
      height: 600,
      backgroundColor: '#2e2c29',
      // show: false,
      // frame : false,
      // transparent : true,
      hasShadow: true,
      // titleBarStyle : 'hidden',
      // titleBarOverlay: false,
      // opacity : 1.0,
    })
    // const win = new BrowserWindow({
    //   webPreferences: {
    //     preload: path.join(__dirname, 'preload.js'), // Load this script *before* the renderer
    //     contextIsolation: true,  // Required for security
    //     nodeIntegration: false   // Prevents direct Node.js access in renderer
    //   }
    // });
    win.webContents.openDevTools()
    win.loadFile('index.html')
    // win.loadURL('localhost')
    win.once('ready-to-show', () => {
      win.show();
    })

  } catch (ertt) {
    console.log(ertt);
  }
}
app.whenReady().then(() => {
  createWindow()
  // ipcMain.handle('urlProcess', function(event, url) {
  // })
})

app.on('activate', function () {
  console.log("app is Active");
})

app.on('window-all-closed', function () {
  console.log("window is closed");
  if (process.platform !== 'darwin') app.quit()
})

// socket.on('updateFiles', (updatedFiles) => {
//   fs.unlinkSync(`${filePath}\\${updatedFiles.filename}`);
//   fs.writeFileSync(`${filePath}\\${updatedFiles.filename}`, updatedFiles.data)
// })