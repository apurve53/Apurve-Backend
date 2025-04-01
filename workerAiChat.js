const { parentPort, workerData, threadId } = require('worker_threads');
const { spawn } = require('child_process');
const { getTime } = require('./t');

function processRecords(records) {
    const threshold = 0.5;
    let pythonProcessPromise = new Promise((resolve, reject) => {
        let answere = [];
        let questions = [];
        let questionsAnsweresObject = {};
        records['directChat'].map((item, index) => {
            item.chat.map((obj) => {
                obj.from ? questions.push(obj.chat) : obj.to ? answere.push(obj.chat) : null
            })
        })
        records['directChat'].map((item) => {
            item.chat.map((obj, index) => {
                if (index < item.chat.length - 1) {
                    obj.from && item.chat[index + 1].to ? questionsAnsweresObject[obj.chat] = item.chat[index + 1]["chat"] : null
                }
            })
        })
        // console.log("This is object : ", JSON.stringify(questionsAnsweresObject));
        // console.log({ "answere": answere, "questions": questions });
        const pythonProcess = spawn('python', ['c:/Users/muni2/Downloads/Python/first.py']);
        pythonProcess.stdin.write(JSON.stringify({ "answere": answere, "questions": questions, "questionsAnsweresObject" : questionsAnsweresObject }));
        pythonProcess.stdin.end();
        pythonProcess.stdout.on('data', (data) => {
            const similaritiesData = JSON.parse(data.toString());
            console.log("similaritiesData After getiing single sentence : ", similaritiesData);
            // const similarities = similaritiesData["similarities"];
            // const similaritiesquestions = similaritiesData["similaritiesquestions"];
            // const similarPairsOfAnsweres = {};
            // const similarPairsOfquestions = {};
            // for (let i = 0; i < similarities.length; i++) {
            //     let pairs = [];
            //     for (let j = 0; j < similarities[i].length; j++) {
            //         if (j !== i) {
            //             if (similarities[i][j] >= threshold) {
            //                 pairs.push(answere[j]);
            //             }
            //         } else {
            //             similarPairsOfAnsweres[answere[j]] = pairs;
            //         }
            //     }
            // }

            // for (let i = 0; i < similaritiesquestions.length; i++) {
            //     let pairs = [];
            //     for (let j = 0; j < similaritiesquestions[i].length; j++) {
            //         if (j !== i) {
            //             if (similaritiesquestions[i][j] >= threshold) {
            //                 pairs.push(questions[j]);
            //             }
            //         } else {
            //             similarPairsOfquestions[questions[j]] = pairs;
            //         }
            //     }
            // }
            // resolve({ "similarPairsOfAnsweres": similarPairsOfAnsweres, "similarPairsOfquestions": similarPairsOfquestions });
            resolve({});
        });
        pythonProcess.stderr.on('data', (error) => {
            console.error('*&*&Error from Python:', error.toString());
        });
        pythonProcess.on('close', (code) => {
            console.log(`Python process exited with code ${code}`);
        });
    })
    return pythonProcessPromise;
}
processRecords(workerData).then((result) => {
    parentPort.postMessage(result);
});