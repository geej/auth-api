import Model from 'framework/dist/model/Model';

export default class Client extends Model {
  static tableName = 'Clients';
  static schema = {
    title: 'Client',
    type: 'object',
    properties: {
      id: {
        type: 'string',
      },
      redirectUri: {
        type: 'string',
      },
      secret: {
        type: 'string',
      },
    },
    required: [ 'id', 'redirectUri', 'secret' ],
  };
};
