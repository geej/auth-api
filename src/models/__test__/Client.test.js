const Client = require('../Client');

describe('Client', () => {
  it('has a tableName and no secondary indices', () => {
    expect(Client.tableName).toEqual('Clients');
    expect(Client.secondaryIndices.length).toEqual(0);
  });
});