import AWS from 'aws-sdk';

const dynamoDB = new AWS.DynamoDB.DocumentClient({ region: process.env.REGION });

const dbPromise = (verb, query) => new Promise((resolve, reject) => dynamoDB[verb](query, (err, data) => {
  if (err) {
    reject(err);
  } else {
    resolve(data);
  }
}));

module.exports.get = (query) => dbPromise('get', query);
module.exports.put = (query) => dbPromise('put', query);