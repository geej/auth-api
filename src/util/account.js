import { hash } from './crypt';
import dynamoDB from './dynamoDB';

module.exports.getAccountByNameAndPassword = async (username, password) => {
  const {
    Items: items,
  } = await dynamoDB.query({
    TableName: 'Accounts',
    IndexName: 'AccountNameIndex',
    KeyConditionExpression: 'username = :username',
    ExpressionAttributeValues: {
      ':username': username,
    },
  });

  const account = items && items[0];
  const passwordHash = await hash(password, account.password.slice(0, 44));

  if (passwordHash === account.password) {
    return account;
  }
  throw new Error('Password does not match');
};

module.exports.getAccountById = async (id) => {
  const {
    Item: account,
  } = await dynamoDB.get({
    TableName: 'Accounts',
    Key: {
      id,
    },
  });

  return account;
};
