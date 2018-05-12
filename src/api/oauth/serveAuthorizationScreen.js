import qs from 'querystring';
import Client from '../../models/Client';
import csrf from '../../util/csrf';
import template from './authorizationScreen.hbs';

module.exports = async (event) => {
  const {
    response_type: responseType,
    client_id: clientId,
    redirect_uri: redirectUri,
  } = event.queryStringParameters || {};

  const client = Client.getById(clientId);
  if (responseType !== 'code' || !client || client.redirectUri !== redirectUri) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Invalid query params',
      }),
    };
  }

  const token = csrf.getCSRFToken();
  return {
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
  };
};
