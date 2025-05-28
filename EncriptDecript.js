require('dotenv').config();
const crypto = require('crypto');
const algorithm = 'aes-256-ctr';
const sec_for_crypto = process.env.SEC_FOR_CRYPTO
// const iv = crypto.randomBytes(16); //Here if i will create new iv on every time it will not match any string after restarting the server so use a single iv.
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

// console.log(encrypt("this is pass"));
// console.log(decrypt('9395afc0f3ee333ed140b4f4'));
module.exports = { encrypt, decrypt };