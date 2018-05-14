import RESTController from 'framework/dist/controller/RESTController';
import Account from '../models/Account';

export default class AccountsController extends RESTController {
  static model = Account;
}