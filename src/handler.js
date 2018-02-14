const wrapHandler = fn => (event, context, callback) => fn(event, context).then(res => callback(null, res)).catch(e => callback(e));

module.exports.createAccount = wrapHandler(require('./api/accounts/createAccount'));
module.exports.serveNewAccountScreen = require('./api/accounts/serveNewAccountScreen');

module.exports.token = wrapHandler(require('./api/oauth/token'));
module.exports.serveAuthorizationScreen = require('./api/oauth/serveAuthorizationScreen');
module.exports.processAuthorization = wrapHandler(require('./api/oauth/processAuthorization'));
