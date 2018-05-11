import fs from 'fs';
import path from 'path';
import qs from 'querystring';
import Handlebars from 'handlebars';
import Client from '../../models/Client';
import csrf from '../../util/csrf';

module.exports = (event, context, callback) => {
  const {
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
  } = event.queryStringParameters || {};

  const client = Client.getById(clientId);
  if (responseType !== 'code' || !client || client.redirectUri !== redirectUri) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid query params',
      }),
    });
    return;
  }

  fs.readFile(path.join(__dirname, 'authorizationScreen.hbs'), (err, data) => {
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
        'Set-Cookie': `${qs.stringify({ 'csrf-token': token })}; Max-Age=300; Secure`,
      },
      body: template({
        csrfToken: token,
        clientId,
        redirectUri,
      }),
    });
  });
};
