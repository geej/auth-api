xdescribe('account', () => {
  let account;
  let dynamoDB;

  beforeEach(() => {
    jest.mock('../../util/crypt', () => ({
      hash: password => password
    }));

    jest.mock('../../util/dynamoDB', () => {
      return {
        query: jest.fn().mockReturnValue({
          Items: [
            {
              password: 'password'
            }
          ]
        }),
        get: jest.fn().mockReturnValue({
          Items: [
            {}
          ]
        })
      };
    });

    dynamoDB = require('../../util/dynamoDB');
    account = require('../Account');
  });

  describe('get account by name and password', () => {
    it('passes the username to dynamoDB', async () => {
      expect.assertions(1);
      await account.getAccountByNameAndPassword('name', 'password');
      expect(dynamoDB.query.mock.calls[0][0].ExpressionAttributeValues[':username']).toEqual('name');
    });

    it('returns the account if the password matches', async () => {
      expect.assertions(1);
      const user = await account.getAccountByNameAndPassword('name', 'password');
      expect(user).toBeTruthy();
    });

    it('throws if the account is not found', async () => {
      expect.assertions(1);
      dynamoDB.query.mockReturnValue({
        Items: []
      });

      try {
        await account.getAccountByNameAndPassword('name', 'password');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });

    it('throws if the password is wrong', async () => {
      expect.assertions(1);
      dynamoDB.query.mockReturnValue({
        Items: [
          { password: 'password is wrong' }
        ]
      });

      try {
        await account.getAccountByNameAndPassword('name', 'password');
      } catch (e) {
        expect(e).toBeInstanceOf(Error);
      }
    });
  });

  describe('get account by id', () => {

  });
});