import qs from 'querystring';
import { getCSRFToken } from '../../util/csrf';
import template from './newAccountScreen.hbs';

module.exports = async () => {
  const token = getCSRFToken();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      'Set-Cookie': `${qs.stringify({ 'csrf-token': token })}; Max-Age=300`,
    },
    body: template({
      csrfToken: token,
    }),
  };
};
