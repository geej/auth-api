import { parse } from 'querystring';
import { getAccountByNameAndPassword, getAccountById } from '../../util/account';
import { isClientIdValid, isClientSecretValid } from '../../util/client';
import dynamoDB from '../../util/dynamoDB';
import jwt from "../../util/jwt";

const handleAuthorizationCodeGrant = async (code, providedClientId) => {
  const {
    Item: {
      clientId,
      accountId,
      ttl
    }
  } = await dynamoDB.get({
    TableName: 'Codes',
    Key: {
      id: code
    }
  });

  if (providedClientId === clientId && ttl > Math.floor(Date.now() / 1000)) {
    return getAccountById(accountId);
  }
};

module.exports = async (event) => {
  const {
    username,
    password,
    client_id,
    client_secret,
    grant_type,
    code,
  } = parse(event.body);

  try {
    if (!isClientIdValid(client_id) || !isClientSecretValid(client_id, client_secret)) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Bad client credentials',
          client_id,
          client_secret
        })
      };
    }

    let account;

    switch (grant_type) {
      case 'password': account = await getAccountByNameAndPassword(username, password); break;
      case 'authorization_code': account = await handleAuthorizationCodeGrant(code, client_id); break;
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({
            error: 'grant_type must be one of [ password, authorization_code ].'
          })
        };
    }

    if (!account) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          error: 'Account not found.'
        })
      };
    }

    account.auth = account.auth || {};
    account.auth[client_id] = {
      access_token: jwt({ id: account.id, username: account.username, email: account.email }),
      expires_at: Date.now() + 604800000 // 7 days
    };

    await dynamoDB.put({
      TableName: 'Accounts',
      Item: account
    });

    return {
      statusCode: 200,
      body: JSON.stringify(account.auth[client_id])
    };
  } catch (err) {
    return { statusCode: 500 };
  }
};
