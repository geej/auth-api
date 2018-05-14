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
};

module.exports.verifiesCSRFToken2 = function(target, key, descriptor) {
  const original = descriptor.value;

  descriptor.value = function (context, event) {
    try {
      const cookies = event.headers && event.headers.Cookie ? cookie.parse(event.headers.Cookie) : {};
      const postParams = event.body && qs.parse(event.body);

      if (cookies['csrf-token'] === postParams.csrfToken) {
        return original.apply(context, [ event ]);
      } else {
        return badCSRFResponse;
      }
    } catch (e) {
      return badCSRFResponse;
    }
  };

  return descriptor;
};