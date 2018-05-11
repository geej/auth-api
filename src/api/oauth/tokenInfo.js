import { parse } from 'querystring';
import JWT from '../../util/jwt';
import { verifiesClientCredentials } from '../../util/client';

const handler = async (event) => {
  const {
    access_token: accessToken,
  } = parse(event.body);

  try {
    const token = JWT.from(accessToken);
    return {
      statusCode: 200,
      body: JSON.stringify(token.payload),
    };
  } catch (e) {
    return {
      statusCode: 403,
    };
  }
};

module.exports = verifiesClientCredentials(handler);