import uuid from 'uuid/v4';
import { parse } from 'querystring';
import { verifyCSRFToken } from '../../util/csrf';
import { getLoggedInUser } from '../../util/account';
import dynamoDB from '../../util/dynamoDB';

module.exports = async (event) => {
  if (!verifyCSRFToken(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'CSRF token is not valid.'
      })
    };
  }

  const {
    redirectUri,
    clientId,
    username,
    password
  } = parse(event.body);

  try {
    const user = await getLoggedInUser(username, password);
    const code = uuid();

    await dynamoDB.put({
      TableName: 'Codes',
      Item: {
        id: code,
        ttl: Math.floor(Date.now() / 1000) + 60,
        clientId,
        userId: user.id
      }
    });

    return {
      statusCode: 302,
      headers: {
        Location: `${ redirectUri }?code=${ code }`
      }
    };
  } catch (e) {
    return { statusCode: 500 };
  }
};
