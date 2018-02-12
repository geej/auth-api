const AWS = require('aws-sdk');
const crypt = require('./crypt');
const jwt = require('./jwt');

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });

module.exports.handlePasswordGrant = (username, password, clientId, clientSecret) => {
  return new Promise((res, rej) => {
    dynamoDB.get({
      TableName: 'Users',
      Key: {
        id: username
      }
    }, (err, data) => {
      if (err) {
        rej(err);
        return;
      }

      const user = data.Item;

      crypt.hash(password, user.password.slice(0, 44)).then((hash) => {
        if (hash !== user.password) {
          rej(new Error('Password is incorrect'));
          return;
        }

        const token = jwt({
          username: username
        });

        const tokenHash = {
          access_token: token,
          expires_at: Date.now() + 604800000 // 7 days
        };

        user.auth = crypt.encrypt(JSON.stringify(tokenHash));

        dynamoDB.put({
          TableName: 'Users',
          Item: user
        }, (err) => {
          if (err) {
            rej(err);
          } else {
            res(tokenHash);
          }
        });
      });
    });
  });
};