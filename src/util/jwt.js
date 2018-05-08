import crypto from 'crypto';

const makeUrlSafe = text => text.replace(/\+/g, '-').replace(/\//g, '_');
const makeUrlUnsafe = text => text.replace(/-/g, '+').replace(/_/g, '/');
const base64UrlSafe = content => makeUrlSafe(Buffer.from(JSON.stringify(content)).toString('base64'));
const base64UrlSafeDecode = text => JSON.parse(Buffer.from(makeUrlUnsafe(text), 'base64').toString());
const signToken = (header, payload) => makeUrlSafe(crypto.createHmac('sha256', Buffer.from(process.env.JWT_SECRET))
  .update(`${header}.${payload}`)
  .digest('base64'));

const validateToken = (token) => {
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

module.exports = class JWT {
  static from(token = '') {
    const tokenParts = token.split('.');

    if (!validateToken(token)) {
      throw new Error('Unable to validate encoded token.');
    }

    const header = base64UrlSafeDecode(tokenParts[0]);
    const payload = base64UrlSafeDecode(tokenParts[1]);

    return new JWT(payload, header);
  }

  constructor(
    payload = {},
    header = {
      alg: 'HS256',
      typ: 'JWT',
    },
  ) {
    this.payload = payload;
    this.header = header;
  }

  toString() {
    const payload = base64UrlSafe({
      iss: process.env.JWT_ISSUER,
      ...this.payload,
    });

    const header = base64UrlSafe(this.header);

    return [header, payload, signToken(header, payload)].join('.');
  }
};
