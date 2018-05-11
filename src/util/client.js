import Client from '../models/Client';

module.exports.verifiesClientCredentials = handler => async (event) => {
  try {
    const {
      client_id: clientId,
      client_secret: clientSecret,
    } = parse(event.body);

    const client = await Client.getById(clientId);
    if (!client || client.secret !== clientSecret) {
      return {
        statusCode: 401,
        body: JSON.stringify({
          error: 'Bad client credentials',
          client_id: clientId,
        }),
      };
    }

    return handler({
      ...event,
      clientId,
    });
  } catch (e) {
    return { statusCode: 500 };
  }
}