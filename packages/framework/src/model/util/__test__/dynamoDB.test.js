describe('dynamoDB', () => {
  let dynamoDB;
  let AWS;

  beforeEach(() => {
    jest.mock('aws-sdk', () => {
      let get = jest.fn().mockImplementation((q, cb) => cb());
      let put = jest.fn().mockImplementation((q, cb) => cb());
      let query = jest.fn().mockImplementation((q, cb) => cb());

      return {
        DynamoDB: {
          DocumentClient: function() {
            this.get = get;
            this.put = put;
            this.query = query;
          }
        }
      };
    });

    AWS = require('aws-sdk');
    dynamoDB = require('../dynamoDB');
  });

  it('calls GET on DocumentClient', async () => {
    expect.assertions(1);
    await dynamoDB.get({});
    expect(new AWS.DynamoDB.DocumentClient().get).toHaveBeenCalled();
  });

  it('calls PUT on DocumentClient', async () => {
    expect.assertions(1);
    await dynamoDB.put({});
    expect(new AWS.DynamoDB.DocumentClient().put).toHaveBeenCalled();
  });

  it('calls QUERY on DocumentClient', async () => {
    expect.assertions(1);
    await dynamoDB.query({});
    expect(new AWS.DynamoDB.DocumentClient().query).toHaveBeenCalled();
  });

  it('rejects on DocumentClient error', async () => {
    const query = new AWS.DynamoDB.DocumentClient().query;
    query.mockImplementation((q, cb) => cb(new Error()));

    expect.assertions(1);

    try {
      await dynamoDB.query({});
    } catch(e) {
      expect(e).toBeInstanceOf(Error);
    }
  });
});