const crypto = require('crypto');
const cookie = require('cookie');
const querystring = require('querystring');

module.exports.getCSRFToken = () => crypto.randomBytes(16).toString('base64');
module.exports.verifyCSRFToken = (event) => {
  const cookies = event.headers && event.headers.Cookie && cookie.parse(event.headers.Cookie) || {};
  const postParams = event.body && querystring.parse(event.body);

  return cookies['csrf-token'] === postParams.csrfToken;
};


