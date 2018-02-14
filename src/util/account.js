import AWS from 'aws-sdk';
import { hash } from './crypt';
import jwt from './jwt';
import { isClientIdValid, isClientSecretValid } from './client';

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });

const getLoggedInUser = (username, password) => new Promise((res, rej) => dynamoDB.get({
  TableName: 'Accounts',
  Key: {
    username
  }
}, (err, data) => {
  if (err) {
    rej(err);
  } else {
    const user = data.Item;

    hash(password, user.password.slice(0, 44)).then((passwordHash) => {
      if (passwordHash === user.password) {
        res(user);
      } else {
        rej(new Error('Incorrect password.'));
      }
    });
  }
}));

module.exports.getLoggedInUser = getLoggedInUser;

module.exports.handlePasswordGrant = (username, password, clientId, clientSecret) => new Promise((res, rej) => {
  if (!isClientIdValid(clientId) || !isClientSecretValid(clientSecret)) {
    rej(new Error('Client secret doesn\'t match!'));
    return;
  }

  getLoggedInUser(username, password).then((user) => {
    user.auth = user.auth || {};
    user.auth[clientId] = {
      access_token: jwt({ username }),
      expires_at: Date.now() + 604800000 // 7 days
    };

    dynamoDB.put({
      TableName: 'Accounts',
      Item: user
    }, (err) => {
      if (err) {
        rej(err);
      } else {
        res(user.auth[clientId]);
      }
    });
  }).catch((err) => rej(err));
});