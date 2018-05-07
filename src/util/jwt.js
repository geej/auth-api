import crypto from 'crypto';

const makeUrlSafe = text => text.replace(/\+/g, '-').replace(/\//g, '_');
const makeUrlUnsafe = text => text.replace(/-/g, '+').replace(/_/g, '/');
const base64UrlSafe = content => makeUrlSafe(Buffer.from(JSON.stringify(content)).toString('base64'));
const base64UrlSafeDecode = text => JSON.parse(Buffer.from(makeUrlUnsafe(text), 'base64').toString());
const signToken = (header, payload) => makeUrlSafe(crypto.createHmac('sha256', Buffer.from(process.env.JWT_SECRET))
  .update(`${header}.${payload}`)
  .digest('base64'));

module.exports.getJWT = (content) => {
  const header = base64UrlSafe({
    alg: 'HS256',
    typ: 'JWT',
  });

  const payload = base64UrlSafe(Object.assign({ iss: 'x0r.net' }, content));

  return [header, payload, signToken(header, payload)].join('.');
};

module.exports.validateJWT = (token) => {
  const tokenParts = token.split('.');

  if (tokenParts.length !== 3) {
    return false;
  }

  const { exp } = base64UrlSafeDecode(tokenParts[1]);
  if (exp < Date.now()) {
    return false;
  }

  return signToken(tokenParts[0], tokenParts[1]) === tokenParts[2];
};

module.exports.readJWT = (token) => {
  const tokenParts = token.split('.');

  if (tokenParts.length !== 3) {
    return false;
  }

  return base64UrlSafeDecode(tokenParts[1]);
};
