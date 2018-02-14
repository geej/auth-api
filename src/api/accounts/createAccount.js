import uuid from 'uuid/v4';
import { parse } from 'querystring';
import { hash } from '../../util/crypt';
import { verifyCSRFToken } from '../../util/csrf';
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
    username,
    password,
    email
  } = parse(event.body);

  if (!password || !username || !email) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Not all registration parameters were provided.'
      })
    };
  }

  try {
    const hashedPassword = await hash(password);

    await dynamoDB.put({
      TableName: 'Accounts',
      Item: {
        id: uuid(),
        username,
        password: hashedPassword,
        email
      }
    });

    return { statusCode: 200 };
  } catch (err) {
    return { statusCode: 500 };
  }
};