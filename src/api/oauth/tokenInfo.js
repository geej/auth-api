import { parse } from 'querystring';
import { isClientIdValid, isClientSecretValid } from '../../util/client';
import { validateJWT, readJWT } from "../../util/jwt";

module.exports = async (event) => {
  const {
    client_id,
    client_secret,
    access_token,
  } = parse(event.body);

  if (!isClientIdValid(client_id) || !isClientSecretValid(client_id, client_secret)) {
    return {
      statusCode: 401,
      body: JSON.stringify({
        error: 'Bad client credentials',
        client_id
      })
    };
  }

  if (validateJWT(access_token)) {
    return {
      statusCode: 200,
      body: JSON.stringify(
        readJWT(access_token),
      ),
    };
  }

  return {
    statusCode: 403
  };
};
