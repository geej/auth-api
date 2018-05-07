// eslint-disable-next-line import/no-extraneous-dependencies
import uuid from 'uuid/v4';
import dynamoDB from '../util/dynamoDB';

class Model {
  static tableName = null;
  static secondaryIndices = [];

  static async getById(id) {
    const {
      Item: item,
    } = await dynamoDB.get({
      TableName: this.tableName,
      Key: {
        id,
      },
    });

    return item;
  }

  static async create(item) {
    const itemWithId = {
      id: uuid(),
      ...item,
    };

    await dynamoDB.put({
      TableName: this.tableName,
      Item: itemWithId,
      ConditionExpression: 'attribute_not_exists(id)',
    });

    return itemWithId;
  }

  static getByHashAndRangeKeysGenerator(hashKey, rangeKey) {
    const secondaryIndex = this.secondaryIndices.find((index) => {
      if (rangeKey) {
        return index.hash === hashKey && index.range === rangeKey;
      }

      return index.hash === hashKey;
    });

    if (!secondaryIndex) {
      throw new Error('There is no valid index for these search criteria');
    }

    return async (hash, range) => {
      const query = {
        TableName: this.tableName,
        IndexName: secondaryIndex.name,
        KeyConditionExpression: `${hashKey} = :hash`,
        ExpressionAttributeValues: {
          ':hash': hash,
        },
      };

      if (rangeKey) {
        query.KeyConditionExpression = `${hashKey} = :hash AND ${rangeKey} = :range`;
        query.ExpressionAttributeValues[':range'] = range;
      }

      console.log('query', query);

      const {
        Items: items,
      } = await dynamoDB.query(query);

      return items;
    };
  }
}

module.exports = new Proxy(Model, {
  get(object, path, receiver) {
    if (object[path]) {
      return object[path];
    }

    if (!path.startsWith('getBy')) {
      return undefined;
    }

    const [
      hashField,
      rangeField,
    ] = path.slice(5).split('And').map(string => string.charAt(0).toLowerCase() + string.slice(1));

    return receiver.getByHashAndRangeKeysGenerator(hashField, rangeField);
  },
});
