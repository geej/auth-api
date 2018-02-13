module.exports.createAccount = require('./api/accounts/createAccount');
module.exports.serveNewAccountScreen = require('./api/accounts/serveNewAccountScreen');

module.exports.token = require('./api/oauth/token');
module.exports.serveAuthorizationScreen = require('./api/oauth/serveAuthorizationScreen');
module.exports.processAuthorization = require('./api/oauth/processAuthorization');
