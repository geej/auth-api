describe('Account', () => {
  let Account;
  let dynamoDB;

  beforeEach(() => {
    jest.mock('../../util/crypt', () => ({
      hash: () => Promise.resolve('hashedPassword')
    }));

    jest.mock('framework/dist/model/util/dynamoDB', () => ({
      get: jest.fn().mockReturnValue(Promise.resolve({
        Item: {}
      })),
      put: jest.fn().mockReturnValue(Promise.resolve({})),
      query: jest.fn().mockReturnValue(Promise.resolve({
        Items: [
          {
            id: 'userId',
            password: 'hashedPassword',
          }
        ]
      }))
    }));

    Account = require('../Account');
    dynamoDB = require('framework/dist/model/util/dynamoDB');
  });

  it('has a tableName and one secondary index', () => {
    expect(Account.tableName).toEqual('Accounts');
    expect(Account.secondaryIndices.length).toEqual(1);
  });

  describe('create', () => {
    it('hashes password on create', async () => {
      expect.assertions(1);
      await Account.create({ password: '1234' });
      expect(dynamoDB.put.mock.calls[0][0].Item.password).toEqual('hashedPassword');
    });
  });

  describe('getByUsernameAndPassword', () => {
    it('returns account if password matches', async () => {
      await expect(Account.getByUsernameAndPassword('userId', 'password')).resolves.toBeTruthy();
    });

    it('returns null if no user matches', async () => {
      dynamoDB.query.mockReturnValue(Promise.resolve({
        Items: []
      }));
      await expect(Account.getByUsernameAndPassword('userId', 'password')).resolves.toBeFalsy();
    });

    it('returns null if no password does not match', async () => {
      dynamoDB.query.mockReturnValue(Promise.resolve({
        Items: [
          {
            id: 'userId',
            password: 'wrongPassword'
          }
        ]
      }));
      await expect(Account.getByUsernameAndPassword('userId2', 'password')).resolves.toBeFalsy();
    });
  });
});