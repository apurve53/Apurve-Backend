
const { parentPort, workerData } = require('worker_threads');
const path = require('path');

function fileProcess(filePath, fileData) {

    // Do your time-consuming logic here
    console.log("Its in Worker Thread : ", filePath);
    console.log('Its in Worker Thread :', fileData.length);
    // Normalize to handle both \ and / properly
    const normalizedPath = path.normalize(filePath);
    // Break it into parts
    const pathParts = normalizedPath.split(path.sep);
    // Extract based on known structure
    const userId = pathParts[1];
    const projectName = pathParts[2];
    const fileName = path.basename(filePath);
    checkFileTypeForOpration(fileName);
    console.log("User ID:", userId);
    console.log("Project Name:", projectName);
    console.log("File Name:", fileName);
}

fileProcess(workerData.a, workerData.b);

// filePath = "Tute\\6846d642b13791034f67e352\\Block-Animation\\block.css";
// fileProcess(filePath, "");
function checkFileTypeForOpration(fileName, fileData) {
    switch (fileName) {
        case fileName.includes('.css'): itsCssFile(fileData);
        case fileName.includes('.js'): itsJsFile(fileData);
        case fileName.includes('.py'): itsJavaFile(fileData);
        default:
            break;
    }
}

function itsCssFile(data) {
    console.log(data);
}
function itsJavaFile(data) {
    console.log(data);
}
function itsPythonFile(data) {
    console.log(data);
}
function itsJsFile(data) {
    console.log(data);
}