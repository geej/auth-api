import fs from 'fs';
import Path from 'path';
import Handlebars from 'handlebars';
import { getCSRFToken } from '../../util/csrf';
import qs from 'querystring';

module.exports = (event, context, callback) => {
  fs.readFile(Path.join(__dirname, 'newAccountScreen.hbs'), (err, data) => {
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
        'Set-Cookie': `${ qs.stringify({ 'csrf-token': token }) }; Max-Age=300; Secure`
      },
      body: template({
        csrfToken: token
      })
    });
  });
};