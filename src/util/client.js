const config = require('../config');

module.exports.isClientIdValid = (clientId) => Object.keys(config.clients).indexOf(clientId) !== -1;
module.exports.isRedirectUriValid = (clientId, redirectUri) => config.clients[clientId].redirectUris.indexOf(redirectUri) !== -1;
module.exports.isClientSecretValid = (clientId, clientSecret) => config.clients[clientId].secret === clientSecret;