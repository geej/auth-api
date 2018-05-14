describe('Model', () => {
  let Model;
  let dynamoDB;
  beforeEach(() => {
    jest.mock('../../util/dynamoDB', () => ({
      get: jest.fn().mockReturnValue(Promise.resolve({
        Item: {}
      })),
      put: jest.fn().mockReturnValue(Promise.resolve({})),
      query: jest.fn().mockReturnValue(Promise.resolve({
        Items: {}
      }))
    }));
    Model = require('../Model');
    dynamoDB = require('../util/dynamoDB');
  });

  describe('getById', () => {
    it('should pass id to get', async () => {
      expect.assertions(1);
      Model.tableName = 'TableName';

      await Model.getById('123');

      expect(dynamoDB.get.mock.calls[0][0].Key.id).toEqual('123');
    });

    it('should throw if tableName is not defined', async () => {
      expect.assertions(1);
      Model.tableName = null;
      await expect(Model.getById('123')).rejects.toThrow();
    });
  });

  describe('create', () => {
    it('should throw if tableName is not defined', async () => {
      expect.assertions(1);
      Model.tableName = null;
      await expect(Model.create({})).rejects.toThrow();
    });

    it('should call put on dynamoDB', async () => {
      expect.assertions(1);
      Model.tableName = 'TableName';

      await Model.create({});
      expect(dynamoDB.put).toHaveBeenCalled();
    });
  });

  describe('getByHashAndRangeKeys', () => {
    it('should throw if there are no secondary indices', () => {
      expect(() => {
        Model.produceGetByHashAndRangeKeys();
      }).toThrow();
    });

    it('should throw if there are no matching secondary indices', () => {
      Model.secondaryIndices = [
        {
          name: 'idx',
          hash: 'id',
          range: 'created_at'
        }
      ];

      expect(() => {
        Model.produceGetByHashAndRangeKeys('id', 'updated_at');
      }).toThrow();
    });

    describe('successful requests', () => {
      beforeEach(() => {
        Model.tableName = 'TableName';
        Model.secondaryIndices = [
          {
            name: 'idx',
            hash: 'id',
            range: 'created_at'
          }
        ];
      });

      it('should call query when there is a matching index', async () => {
        expect.assertions(1);
        await Model.produceGetByHashAndRangeKeys('id', 'created_at')();
        expect(dynamoDB.query).toHaveBeenCalled();
      });

      it('should call query when there is a partial matching index', async () => {
        expect.assertions(1);
        await Model.produceGetByHashAndRangeKeys('id')();
        expect(dynamoDB.query).toHaveBeenCalled();
      });

      it('should call query when there is a partial matching index', async () => {
        expect.assertions(1);
        Model.tableName = null;
        await expect(Model.produceGetByHashAndRangeKeys('id')()).rejects.toThrow();      });
    });
  });

  it('uses proxy to call complex queries', () => {
    const mock = jest.fn().mockReturnValue(() => {});
    Model.produceGetByHashAndRangeKeys = mock;

    Model.getByUsernameAndPassword();
    expect(mock).toHaveBeenCalledWith('username', 'password');
  });
});