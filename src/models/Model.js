// eslint-disable-next-line import/no-extraneous-dependencies
import uuid from 'uuid/v4';
import Ajv from 'ajv';
import dynamoDB from '../util/dynamoDB';

class Model {
  static tableName = null;
  static secondaryIndices = [];
  static schema = {
    title: 'Model',
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
    },
    required: [ 'id' ],
  };

  static async getById(id) {
    if (!this.tableName) {
      throw new Error('tableName not defined!');
    }

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
    if (!this.tableName) {
      throw new Error('tableName not defined!');
    }

    const itemWithId = {
      id: uuid(),
      ...item,
    };

    if (!this.validateObject(itemWithId, true)) {
      throw new Error(`Input object does not match schema for ${this.tableName}`);
    }

    await dynamoDB.put({
      TableName: this.tableName,
      Item: itemWithId,
      ConditionExpression: 'attribute_not_exists(id)',
    });

    return itemWithId;
  }

  static validateObject(inputObject, prune = false) {
    const ajv = new Ajv({ removeAdditional: true });

    const schema = {
      ...this.schema,
      additionalProperties: prune ? false : undefined,
    };

    const validate = ajv.compile(schema);

    return validate(inputObject) ? inputObject : false;
  };

  static produceGetByHashAndRangeKeys(hashKey, rangeKey) {
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
      if (!this.tableName) {
        throw new Error('tableName not defined!');
      }

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

    return receiver.produceGetByHashAndRangeKeys(hashField, rangeField);
  },
});