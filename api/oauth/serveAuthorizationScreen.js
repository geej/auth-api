const fs = require('fs');
const Path = require('path');
const Handlebars = require('handlebars');
const client = require('../../util/client');
const csrf = require('../../util/csrf');
const qs = require('querystring');

module.exports = (event, context, callback) => {
  event.queryStringParameters = event.queryStringParameters || {};

  const responseType = event.queryStringParameters.response_type;
  const clientId = event.queryStringParameters.client_id;
  const redirectUri = event.queryStringParameters.redirect_uri;

  if(responseType !== 'code' || !client.isClientIdValid(clientId) || !client.isRedirectUriValid(clientId, redirectUri)) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid query params'
      })
    });
    return;
  }

  fs.readFile(Path.join(__dirname, 'authorizationScreen.hbs'), (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    const template = Handlebars.compile(data.toString('utf8'));
    const token = csrf.getCSRFToken();
    callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': `${ qs.stringify({ 'csrf-token': token }) }; Max-Age=300; Secure`
      },
      body: template({
        csrfToken: token,
        clientId: clientId,
        redirectUri: redirectUri
      })
    });
  });
};