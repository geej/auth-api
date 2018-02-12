'use strict';

const AWS = require('aws-sdk');
const crypt = require('../../util/crypt');

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });

module.exports = (event, context, callback) => {
  const body = JSON.parse(event.body);

  if (!body || !body.password || !body.username) {
    callback(null, {
      statusCode: 400,
      body: JSON.stringify({
        error: 'Username and password not provided.'
      })
    });
    return;
  }

  crypt.hash(body.password).then((hash) => {
    dynamoDB.put({
      TableName: 'Users',
      Item: {
        id: body.username,
        password: hash,
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