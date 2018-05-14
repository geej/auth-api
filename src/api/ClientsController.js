import RESTController from 'framework/dist/controller/RESTController';
import Client from '../models/Client';

export default class ClientController extends RESTController {
  static model = Client;
}
