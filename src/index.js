import Router from 'framework/dist/Router';
import AccountsController from './api/AccountsController';
import ClientsController from './api/ClientsController';
import OAuthController from './api/OAuthController';

const router = Router.from({
  '/accounts': AccountsController,
  '/clients': ClientsController,
  '/oauth': OAuthController,
});

export default router;