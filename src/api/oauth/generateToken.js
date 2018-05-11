import { parse } from 'querystring';
import JWT from '../../util/jwt';
import Account from '../../models/Account';
import { verifiesClientCredentials } from '../../util/client';

const handleAuthorizationCodeGrant = async (code, rawClientId) => {
  const {
    client_id: clientId,
    exp,
    id,
  } = JWT.from(code);

  if (clientId === rawClientId && exp < Date.now()) {
    return Account.getById(id);
  }

  return null;
};

const handler = async (event) => {
  const {
    username,
    password,
    grant_type: grantType,
    code,
  } = parse(event.body);

  try {
    let account;

    switch (grantType) {
      // TODO: Password is broken
      case 'password': account = await Account.getByUsernameAndPassword(username, password); break;
      case 'authorization_code': account = await handleAuthorizationCodeGrant(code, event.clientId); break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'grant_type must be one of [ password, authorization_code ].',
          }),
        };
    }

    if (!account) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Account not found.',
        }),
      };
    }

    const now = Date.now();
    const token = new JWT({
      id: account.id,
      client_id: event.clientId,
      sub: 'access_token',
      iat: now,
      exp: now + 604800000, // 7 days,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: token.toString(),
      }),
    };
  } catch (err) {
    return { statusCode: 500 };
  }
};

module.exports = verifiesClientCredentials(handler);