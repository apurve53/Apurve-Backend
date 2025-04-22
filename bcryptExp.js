// const bcrypt = require('bcrypt');
import bcrypt from 'bcrypt';
let password = "asdf";
// const hashedPassword = await bcrypt.hash(password, 10);
// console.log("Hashed Password:", hashedPassword);
const hasPass = "$2b$10$vBdpsBwELYAOeJD215aareYakvRY/TXOdGBTZs7gtcMER4VREvZMy"
const isMatch = await bcrypt.compare(password, hasPass);
console.log("Password Match:", isMatch);