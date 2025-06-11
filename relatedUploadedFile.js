const { parentPort, workerData } = require('worker_threads');

function fileProcess(filePath, fileData) {
    // Do your time-consuming logic here
    console.log("Its in Worker Thread : ", filePath);
    console.log('Its in Worker Thread :', fileData.length);
    parentPort.postMessage("this is Done in worker Threade");

}

fileProcess(workerData.a, workerData.b);
