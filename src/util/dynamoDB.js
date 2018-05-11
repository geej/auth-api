// eslint-disable-next-line
import AWS from 'aws-sdk';

const config = {
  region: process.env.REGION,
};

if (process.env.IS_OFFLINE) {
  config.region = 'localhost';
  config.endpoint = 'http://localhost:8000';
}

const dynamoDB = new AWS.DynamoDB.DocumentClient(config);

const dbPromise = (verb, query) => new Promise((resolve, reject) => dynamoDB[verb](query, (err, data) => {
  if (err) {
    reject(err);
  } else {
    resolve(data);
  }
}));

module.exports.get = query => dbPromise('get', query);
module.exports.put = query => dbPromise('put', query);
module.exports.query = query => dbPromise('query', query);
