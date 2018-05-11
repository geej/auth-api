import crypto from 'crypto';
import cookie from 'cookie';
import qs from 'querystring';

const badCSRFResponse = {
  statusCode: 401,
  body: JSON.stringify({
    error: 'CSRF token is not valid.',
  }),
};

module.exports.getCSRFToken = () => crypto.randomBytes(16).toString('base64');
module.exports.verifiesCSRFToken = handler => async (event) => {
  try {
    const cookies = event.headers && event.headers.Cookie ? cookie.parse(event.headers.Cookie) : {};
    const postParams = event.body && qs.parse(event.body);

    if (cookies['csrf-token'] === postParams.csrfToken) {
      return handler(event);
    } else {
      return badCSRFResponse;
    }
  } catch (e) {
    return badCSRFResponse;
  }
}