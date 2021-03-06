// This isn't used anywhere right now, but it's fun to have

import crypto from 'crypto';

const cipherKey = process.env.CIPHER_KEY;

module.exports.encrypt = (text) => {
  const salt = crypto.randomBytes(16);
  const hash = crypto.createHash('sha512').update(salt + cipherKey).digest();

  const key = hash.slice(0, 32);
  const iv = hash.slice(32, 48);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);

  return {
    salt: salt.toString('base64'),
    iv: iv.toString('base64'),
    value: Buffer.concat([cipher.update(Buffer.from(text)), cipher.final()]).toString('base64'),
  };
};

module.exports.decrypt = (value, salt, iv) => {
  const hash = crypto.createHash('sha512').update(Buffer.from(salt, 'base64') + cipherKey).digest();
  const key = hash.slice(0, 32);
  const decipher = crypto.createDecipheriv('aes-256-cbc', key, Buffer.from(iv, 'base64'));

  return Buffer.concat([decipher.update(Buffer.from(value, 'base64')), decipher.final()]).toString();
};

module.exports.hash = (value, salt = crypto.randomBytes(32).toString('base64')) => new Promise((res, rej) => {
  crypto.pbkdf2(value, salt, 10000, 412, 'sha512', (err, hash) => {
    if (err) {
      rej();
    } else {
      res(salt + hash.toString('base64'));
    }
  });
});
