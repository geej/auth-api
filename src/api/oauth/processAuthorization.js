import { parse } from 'querystring';
import { verifiesCSRFToken } from '../../util/csrf';
import Account from '../../models/Account';
import JWT from '../../util/jwt';

const handler = async (event) => {
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

module.exports = verifiesCSRFToken(handler);