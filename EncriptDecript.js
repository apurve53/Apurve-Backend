require('dotenv').config();
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const sec_for_crypto = process.env.SEC_FOR_CRYPTO
// const iv = crypto.randomBytes(16);
const iv = process.env.IV_FOR_CRYPTO;
function encrypt(text) {
    const cipher = crypto.createCipheriv(algorithm, Buffer.from(sec_for_crypto, 'hex'), Buffer.from(iv, 'base64'));
    const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);
    return encrypted.toString('hex');
}
function decrypt(hash) {
    const decipher = crypto.createDecipheriv(algorithm, Buffer.from(sec_for_crypto, 'hex'), Buffer.from(iv, 'base64'));
    const decrypted = Buffer.concat([decipher.update(Buffer.from(hash, 'hex')), decipher.final()]);
    return decrypted.toString();
}
// console.log(decrypt("86cff7f3b4ea2177cd0fa4e8df"));
module.exports = { encrypt, decrypt };
