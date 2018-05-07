import { parse } from 'querystring';
import { verifyCSRFToken } from '../../util/csrf';
import { isClientIdValid, isClientSecretValid } from '../../util/client';
import Account from '../../models/Account';

module.exports = async (event) => {
  const {
    client_id: clientId,
    client_secret: clientSecret,
    username,
    password,
    email,
  } = parse(event.body);

  if (clientId && (!isClientIdValid(clientId) || !isClientSecretValid(clientId, clientSecret))) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Bad client credentials',
        client_id: clientId,
      }),
    };
  }

  if (!clientId && !verifyCSRFToken(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'CSRF token is not valid.',
      }),
    };
  }

  if (!password || !username || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Not all registration parameters were provided.',
      }),
    };
  }

  try {
    const { id } = await Account.create({
      username,
      password,
      email,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ id }),
    };
  } catch (err) {
    return { statusCode: 500 };
  }
};
