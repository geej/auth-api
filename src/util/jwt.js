const crypto = require('crypto');

const makeUrlSafe = (text) => text.replace(/\+/g, '-').replace(/\//g, '_');
const base64UrlSafe = (content) => makeUrlSafe(new Buffer(JSON.stringify(content)).toString('base64'));
const signToken = (header, payload) => {
  return makeUrlSafe(crypto.createHmac('sha256', new Buffer(process.env.JWT_SECRET))
    .update(`${ header }.${ payload }`)
    .digest('base64'));
}

module.exports.getJWT = (content) => {
  const header = base64UrlSafe({
    alg: 'HS256',
    typ: 'JWT',
  });

  const payload = base64UrlSafe(Object.assign({ iss: 'x0r.net' }, content));

  return [ header, payload, signToken(header, payload) ].join('.');
};

module.exports.validateJWT = (token) => {
  const tokenParts = token.split('.');

  return tokenParts.length === 3 && signToken(tokenParts[0], tokenParts[1]) === tokenParts[2];
}