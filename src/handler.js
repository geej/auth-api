import router from './index';

const wrapHandler = fn => (event, context, callback) => {
  fn(event, context)
    .then(res => callback(null, res))
    .catch(e => callback(e));
};

const AccountsController = require('./api/AccountsController').default;
module.exports.createAccount = wrapHandler(router['POST__accounts_create'].handler);
module.exports.serveNewAccountScreen = wrapHandler(router['GET__accounts_new'].handler);

module.exports.generateToken = wrapHandler(require('./api/oauth/generateToken'));
module.exports.tokenInfo = wrapHandler(require('./api/oauth/tokenInfo'));
module.exports.serveAuthorizationScreen = wrapHandler(require('./api/oauth/serveAuthorizationScreen'));
module.exports.processAuthorization = wrapHandler(require('./api/oauth/processAuthorization'));

console.log(router);