import { parse } from 'querystring';
import { verifyCSRFToken } from '../../util/csrf';
import { getAccountByNameAndPassword } from '../../models/Account';
import Code from '../../models/Code';

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
    const account = await getAccountByNameAndPassword(username, password);

    const {
      id,
    } = await Code.create({
      clientId,
      accountId: account.id,
    });

    return {
      statusCode: 302,
      headers: {
        Location: `${redirectUri}?code=${id}`,
      },
    };
  } catch (e) {
    return { statusCode: 500, body: e.message };
  }
};
