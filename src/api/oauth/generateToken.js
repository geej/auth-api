import { parse } from 'querystring';
import { isClientIdValid, isClientSecretValid } from '../../util/client';
import { getJWT } from '../../util/jwt';
import Account from '../../models/Account';
import Code from '../../models/Code';

const handleAuthorizationCodeGrant = async (code, providedClientId) => {
  const {
    clientId,
    accountId,
    ttl,
  } = await Code.getById(code);

  if (providedClientId === clientId && ttl > Math.floor(Date.now() / 1000)) {
    return Account.getById(accountId);
  }

  return null;
};

module.exports = async (event) => {
  const {
    username,
    password,
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: grantType,
    code,
  } = parse(event.body);

  try {
    if (!isClientIdValid(clientId) || !isClientSecretValid(clientId, clientSecret)) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Bad client credentials',
          client_id: clientId,
        }),
      };
    }

    let account;

    switch (grantType) {
      case 'password': account = await Account.getByUsernameAndPassword(username, password); break;
      case 'authorization_code': account = await handleAuthorizationCodeGrant(code, clientId); break;
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

    return {
      statusCode: 200,
      body: JSON.stringify({
        access_token: getJWT({
          id: account.id,
          iat: now,
          exp: now + 604800000, // 7 days,
        }),
      }),
    };
  } catch (err) {
    return { statusCode: 500 };
  }
};
