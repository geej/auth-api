'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid/v4');
const querystring = require('querystring');
const crypt = require('../../util/crypt');
const csrf = require('../../util/csrf');

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });

module.exports = (event, context, callback) => {
  if (!csrf.verifyCSRFToken(event)) {
    callback(null, {
      statusCode: 401,
      body: JSON.stringify({
        error: 'CSRF token is not valid.'
      })
    });
  }

  const postParams = querystring.parse(event.body);

  const username = postParams.username;
  const password = postParams.password;
  const email = postParams.email;

  if (!password || !username || !email) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Not all registration parameters were provided.'
      })
    });
    return;
  }

  crypt.hash(password).then((hash) => {
    dynamoDB.put({
      TableName: 'Accounts',
      Item: {
        id: uuid(),
        username: username,
        password: hash,
        email: email
      }
    }, (err) => {
      if (err) {
        callback(err, null);
      } else {
        callback(null, {
          statusCode: 200
        });
      }
    });
  });
};