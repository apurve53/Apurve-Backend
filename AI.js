const { error } = require('console');
const { Worker } = require('worker_threads');
const path = require('path');
const { getTime } = require('./t');
const workerPath = path.resolve(__dirname, 'workerAiChat.js');
const checkSingleChatSimilerities = path.resolve(__dirname, 'forSingleChatSimilerities_worker.js');
async function processChatData(records) {
    return new Promise((resolve, reject) => {
        try {
            const worker = new Worker(workerPath, { workerData: records });
            worker.on('message', (result) => {
                resolve(result);
            });
            worker.on('error', (err) => {
                console.error('Workersss Error in AI.js:', err);
                reject({ 'status': 'fail' });
            });

            worker.on('exit', (code) => {
                if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
                // reject(new Error(`Worker exited with code ${code}`));
            });
        } catch (err) {
            console.error('Error in AI.js:', err);
            reject(err);
        } finally {
            // await client.close();
        }
    })
}

function checkSingleChatFromUsersChatData(records) {
    try {
        const worker = new Worker(checkSingleChatSimilerities, { workerData: records });
        worker.on('message', (result) => {
            return result;
        });
        worker.on('error', (err) => {
            console.error('Worker Error:', err);
            return { 'status': 'fail' }
        });

        worker.on('exit', (code) => {
            if (code !== 0) console.error(`Worker stopped with exit code ${code}`);
        });

    } catch (err) {
        console.error('Error:', err);
    } finally {
        // await client.close();
    }
}
module.exports = { processChatData, checkSingleChatFromUsersChatData }

// const natural = require('natural');

// const preprocessText = (text) => {
//     const tokenizer = new natural.WordTokenizer();
//     return tokenizer.tokenize(text.toLowerCase().replace(/[^a-zA-Z0-9\s]/g, ""));
// };

// const query = "How can I reset my password?";
// console.log(preprocessText(query)); // ["how", "can", "i", "reset", "my", "password"]
// console.log(query.split(" "));



// let data = {
//     "Pronoun": [
//         {
//             "Personal Pronouns": [
//                 "I",
//                 "you",
//                 "he",
//                 "she",
//                 "it",
//                 "we",
//                 "they"
//             ]
//         },
//         {
//             "Object Pronouns": [
//                 "me",
//                 "you",
//                 "him",
//                 "her",
//                 "it",
//                 "us",
//                 "them"
//             ]
//         },
//         {
//             "Possessive Pronouns": [
//                 "mine",
//                 "yours",
//                 "his",
//                 "hers",
//                 "its",
//                 "ours",
//                 "theirs"
//             ]
//         },
//         {
//             "Possessive Adjectives": [
//                 "my",
//                 "your",
//                 "his",
//                 "her",
//                 "its",
//                 "our",
//                 "their"
//             ]
//         },
//         {
//             "Reflexive Pronouns": [
//                 "myself",
//                 "yourself",
//                 "himself",
//                 "herself",
//                 "itself",
//                 "ourselves",
//                 "yourselves",
//                 "themselves"
//             ]
//         },
//         {
//             "Demonstrative Pronouns": [
//                 "this",
//                 "that",
//                 "these",
//                 "those"
//             ]
//         },
//         {
//             "Interrogative Pronouns": [
//                 "who",
//                 "whom",
//                 "whose",
//                 "which",
//                 "what"
//             ]
//         },
//         {
//             "Relative Pronouns": [
//                 "who",
//                 "whom",
//                 "whose",
//                 "which",
//                 "that"
//             ]
//         },
//         {
//             "Indefinite Pronouns": [
//                 "anyone",
//                 "everyone",
//                 "someone",
//                 "no one",
//                 "nobody",
//                 "anybody",
//                 "somebody",
//                 "everybody",
//                 "each",
//                 "either",
//                 "neither",
//                 "few",
//                 "many",
//                 "several",
//                 "all",
//                 "some",
//                 "none",
//                 "one",
//                 "both",
//                 "any",
//                 "most"
//             ]
//         },
//         {
//             "Reciprocal Pronouns": [
//                 "each other",
//                 "one another"
//             ]
//         }
//     ],
//     "Verb": [
//         {
//             "Action Verbs": [
//                 "run",
//                 "jump",
//                 "eat",
//                 "write",
//                 "speak",
//                 "play",
//                 "read"
//             ]
//         },
//         {
//             "Linking Verbs": [
//                 "be",
//                 "am",
//                 "is",
//                 "are",
//                 "was",
//                 "were",
//                 "seem",
//                 "become"
//             ]
//         },
//         {
//             "Modal Verbs": [
//                 "can",
//                 "could",
//                 "shall",
//                 "should",
//                 "will",
//                 "would",
//                 "may",
//                 "might",
//                 "must"
//             ]
//         },
//         {
//             "Helping Verbs (Auxiliary Verbs)": [
//                 "is",
//                 "are",
//                 "was",
//                 "were",
//                 "has",
//                 "have",
//                 "had",
//                 "do",
//                 "does",
//                 "did",
//                 "will",
//                 "shall"
//             ]
//         }
//     ],
//     "Noun": [
//         {
//             "Common Nouns": [
//                 "dog",
//                 "city",
//                 "car",
//                 "book",
//                 "tree"
//             ]
//         },
//         {
//             "Proper Nouns": [
//                 "John",
//                 "London",
//                 "Toyota",
//                 "Microsoft",
//                 "Amazon"
//             ]
//         },
//         {
//             "Abstract Nouns": [
//                 "love",
//                 "happiness",
//                 "freedom",
//                 "knowledge",
//                 "courage"
//             ]
//         },
//         {
//             "Concrete Nouns": [
//                 "apple",
//                 "chair",
//                 "building",
//                 "computer",
//                 "flower"
//             ]
//         },
//         {
//             "Collective Nouns": [
//                 "team",
//                 "flock",
//                 "audience",
//                 "committee",
//                 "group"
//             ]
//         }
//     ],
//     "Particle": [
//         {
//             "Grammatical Particles": [
//                 "to",
//                 "up",
//                 "off",
//                 "out",
//                 "in"
//             ]
//         }
//     ],
//     "Preposition": [
//         {
//             "Simple Prepositions": [
//                 "at",
//                 "in",
//                 "on",
//                 "by",
//                 "for",
//                 "with",
//                 "about",
//                 "over",
//                 "under"
//             ]
//         },
//         {
//             "Compound Prepositions": [
//                 "according to",
//                 "because of",
//                 "instead of",
//                 "apart from",
//                 "in front of"
//             ]
//         }
//     ],
//     "Conjunction": [
//         {
//             "Coordinating Conjunctions": [
//                 "and",
//                 "but",
//                 "or",
//                 "nor",
//                 "for",
//                 "so",
//                 "yet"
//             ]
//         },
//         {
//             "Subordinating Conjunctions": [
//                 "because",
//                 "although",
//                 "if",
//                 "when",
//                 "while",
//                 "since",
//                 "after",
//                 "before"
//             ]
//         },
//         {
//             "Correlative Conjunctions": [
//                 "either...or",
//                 "neither...nor",
//                 "not only...but also",
//                 "both...and"
//             ]
//         }
//     ],
//     "Adjective": [
//         {
//             "Descriptive Adjectives": [
//                 "beautiful",
//                 "quick",
//                 "happy",
//                 "blue",
//                 "large"
//             ]
//         },
//         {
//             "Quantitative Adjectives": [
//                 "some",
//                 "many",
//                 "few",
//                 "several",
//                 "all"
//             ]
//         },
//         {
//             "Demonstrative Adjectives": [
//                 "this",
//                 "that",
//                 "these",
//                 "those"
//             ]
//         },
//         {
//             "Possessive Adjectives": [
//                 "my",
//                 "your",
//                 "his",
//                 "her",
//                 "its",
//                 "our",
//                 "their"
//             ]
//         },
//         {
//             "Interrogative Adjectives": [
//                 "which",
//                 "what",
//                 "whose"
//             ]
//         }
//     ],
//     "Adverb": [
//         {
//             "Manner Adverbs": [
//                 "quickly",
//                 "softly",
//                 "happily",
//                 "loudly",
//                 "neatly"
//             ]
//         },
//         {
//             "Place Adverbs": [
//                 "here",
//                 "there",
//                 "everywhere",
//                 "nowhere",
//                 "outside"
//             ]
//         },
//         {
//             "Time Adverbs": [
//                 "now",
//                 "then",
//                 "yesterday",
//                 "today",
//                 "tomorrow"
//             ]
//         },
//         {
//             "Frequency Adverbs": [
//                 "always",
//                 "never",
//                 "often",
//                 "sometimes",
//                 "rarely"
//             ]
//         }
//     ]
// }