const { parentPort, workerData } = require('worker_threads');
const { spawn } = require('child_process');
const path = require('path');
function checkSingleChatSimilerities(records) {
    let singleChat = records["singleChat"];
    let chatData = records["chatData"];
    let listToCheckWithQuery = [singleChat];
    Object.keys(chatData).map((item) => {
        listToCheckWithQuery.push(item);
    })
    console.log("listToCheckWithQuery ", listToCheckWithQuery);
    const pythonProcess = spawn('python', ['c:/Users/muni2/Downloads/Python/singleChatSimilerities.py']);
    pythonProcess.stdin.write(JSON.stringify(listToCheckWithQuery));
    pythonProcess.stdin.end();
    pythonProcess.stdout.on('data', (data) => {
        const similarities = JSON.parse(data.toString());
        console.log("Python Process Data :", similarities);
        // return similarities;
    });
    pythonProcess.stderr.on('data', (error) => {
        console.error('Error from Python:', error.toString());
    });
    pythonProcess.on('close', (code) => {
        // console.log(`Python process exited with code ${code}`);
    });
    return "Returning text";
}
const processedData = checkSingleChatSimilerities(workerData);
parentPort.postMessage(processedData);