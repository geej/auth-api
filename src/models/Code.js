import Model from './Model';

module.exports = class Code extends Model {
  static tableName = 'Codes';

  static async create(item) {
    return super.create({
      ttl: Math.floor(Date.now() / 1000) + 60,
      ...item,
    });
  }
};
