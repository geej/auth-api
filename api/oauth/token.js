const querystring = require('querystring');
const account = require('../../util/account');

module.exports = (event, context, callback) => {
  const body = querystring.parse(event.body);

  if (!body || !body.grant_type) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        error: 'grant_type is a required parameter.'
      })
    });
    return;
  }

  let tokenPromise;

  switch (body.grant_type) {
    case 'password': tokenPromise = account.handlePasswordGrant(body.username, body.password, body.clientId, body.clientSecret); break;
    case 'authorization_code':
    default:
      callback(null, {
        statusCode: 400,
        body: JSON.stringify({
          error: 'grant_type must be one of [ password, authorization_code ].'
        })
      });
      return;
  }

  tokenPromise.then((hash) => {
    callback(null, {
      statusCode: 200,
      body: JSON.stringify(hash)
    });
  }).catch(() => {
    callback(null, {
      statusCode: 500
    })
  });
};
