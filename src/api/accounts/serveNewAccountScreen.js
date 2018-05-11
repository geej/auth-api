import fs from 'fs';
import path from 'path';
import qs from 'querystring';
import Handlebars from 'handlebars';
import { getCSRFToken } from '../../util/csrf';

module.exports = (event, context, callback) => {
  fs.readFile(path.join(__dirname, 'newAccountScreen.hbs'), (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    const template = Handlebars.compile(data.toString('utf8'));
    const token = getCSRFToken();

    callback(null, {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/html',
        'Set-Cookie': `${qs.stringify({ 'csrf-token': token })}; Max-Age=300`,
      },
      body: template({
        csrfToken: token,
      }),
    });
  });
};
