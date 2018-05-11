import { parse } from 'querystring';
import { verifiesCSRFToken } from '../csrf';

module.exports = model => verifiesCSRFToken(async (event) => {
  try {
    const { id } = await model.create(parse(event.body));

    return {
      statusCode: 200,
      body: JSON.stringify({ id }),
    };
  } catch (err) {
    console.log(err);
    return { statusCode: 500 };
  }
});