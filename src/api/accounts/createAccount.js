// eslint-disable-next-line import/no-extraneous-dependencies
import uuid from 'uuid/v4';
import { parse } from 'querystring';
import { hash } from '../../util/crypt';
import { verifyCSRFToken } from '../../util/csrf';
import dynamoDB from '../../util/dynamoDB';
import { isClientIdValid, isClientSecretValid } from '../../util/client';

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
    const hashedPassword = await hash(password);

    const item = {
      id: uuid(),
      username,
      password: hashedPassword,
      email,
    };

    await dynamoDB.put({
      TableName: 'Accounts',
      Item: item,
      ConditionExpression: 'attribute_not_exists(id)',
    });

    return {
      statusCode: 200,
      body: JSON.stringify({
        id: item.id,
      }),
    };
  } catch (err) {
    return { statusCode: 500 };
  }
};
