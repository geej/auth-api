const wrapHandler = fn => (event, context, callback) => {
  fn(event, context)
    .then(res => callback(null, res))
    .catch(e => callback(e));
};

module.exports.createAccount = wrapHandler(require('./api/accounts/create'));
module.exports.serveNewAccountScreen = wrapHandler(require('./api/accounts/serveNewAccountScreen'));

module.exports.generateToken = wrapHandler(require('./api/oauth/generateToken'));
module.exports.tokenInfo = wrapHandler(require('./api/oauth/tokenInfo'));
module.exports.serveAuthorizationScreen = wrapHandler(require('./api/oauth/serveAuthorizationScreen'));
module.exports.processAuthorization = wrapHandler(require('./api/oauth/processAuthorization'));
