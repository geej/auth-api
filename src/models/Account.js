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

    if (!account || !account.password) {
      return null;
    }

    const passwordHash = await hash(password, account.password.slice(0, 44));

    if (passwordHash === account.password) {
      return account;
    }

    return null;
  }
};
