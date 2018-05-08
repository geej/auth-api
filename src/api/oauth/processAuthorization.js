import { parse } from 'querystring';
import { verifyCSRFToken } from '../../util/csrf';
import Account from '../../models/Account';
import JWT from '../../util/jwt';

module.exports = async (event) => {
  if (!verifyCSRFToken(event)) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'CSRF token is not valid.',
      }),
    };
  }

  const {
    redirectUri,
    clientId,
    username,
    password,
  } = parse(event.body);

  try {
    const account = await Account.getByUsernameAndPassword(username, password);

    const now = Date.now();
    const token = new JWT({
      id: account.id,
      client_id: clientId,
      sub: 'code',
      iat: now,
      exp: now + 300000, // 5 minutes,
    });

    return {
      statusCode: 302,
      headers: {
        Location: `${redirectUri}?code=${token.toString()}`,
      },
    };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
