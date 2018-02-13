const fs = require('fs');
const Path = require('path');
const Handlebars = require('handlebars');
const csrf = require('../../util/csrf');
const qs = require('querystring');

module.exports = (event, context, callback) => {
  fs.readFile(Path.join(__dirname, 'newAccountScreen.hbs'), (err, data) => {
    if (err) {
      callback(err);
      return;
    }

    const template = Handlebars.compile(data.toString('utf8'));
    const token = csrf.getCSRFToken();

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