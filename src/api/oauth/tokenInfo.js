import { parse } from 'querystring';
import { isClientIdValid, isClientSecretValid } from '../../util/client';
import JWT from '../../util/jwt';

module.exports = async (event) => {
  const {
    client_id: clientId,
    client_secret: clientSecret,
    access_token: accessToken,
  } = parse(event.body);

  if (!isClientIdValid(clientId) || !isClientSecretValid(clientId, clientSecret)) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Bad client credentials',
        client_id: clientId,
      }),
    };
  }

  try {
    const token = JWT.from(accessToken);
    return {
      statusCode: 200,
      body: JSON.stringify(token.payload),
    };

  } catch (e) {
    return {
      statusCode: 403,
    };
  }
};
