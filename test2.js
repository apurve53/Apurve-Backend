const bcrypt = require('bcrypt');
const password = 'myPassword123';
const saltRounds = 10;
const hash = await bcrypt.hash(password, saltRounds);
console.log(hash); // e.g., $2b$10$E4wMyV...
const hashedPassword = await bcrypt.hash(password, 10);

console.log(hashedPassword); // e.g., $2b$10$E4wMyV...
