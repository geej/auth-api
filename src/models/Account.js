import { hash } from '../util/crypt';
import Model from './Model';

module.exports = class Account extends Model {
  static tableName = 'Accounts';
  static secondaryIndices = [
    {
      name: 'AccountNameIndex',
      hash: 'username',
    },
  ];
  static schema = {
    title: 'Account',
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      username: {
        title: 'Username',
        type: 'string',
      },
      password: {
        title: 'Password',
        type: 'string',
      },
      email: {
        title: 'E-mail',
        type: 'string',
      },
    },
    required: [ 'id', 'username', 'password', 'email' ],
  };

  static async create(user) {
    const completeUser = {
      ...user,
      password: await hash(user.password),
    };

    return super.create(completeUser);
  }

  static async getByUsernameAndPassword(username, password) {
    const accounts = await this.getByUsername(username);
    const account = accounts && accounts[0];

    if (!account) {
      return null;
    }

    const passwordHash = await hash(password, account.password.slice(0, 44));

    if (passwordHash === account.password) {
      return account;
    }

    return null;
  }
};
