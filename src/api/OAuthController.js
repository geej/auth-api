import { h } from 'preact';
import Controller from 'framework/dist/controller/Controller';
import Route from 'framework/dist/controller/util/Route';
import ContentType, * as ContentTypes from 'framework/dist/controller/util/ContentType';
import Page from 'framework/dist/view/Page';
import Client from '../models/Client';

export default class OAuthController extends Controller {
  @Route('GET', 'authorize')
  @ContentType(ContentTypes.JSX)
  static async serveAuthorizationScreen(event) {
    const {
      response_type: responseType,
      client_id: clientId,
      redirect_uri: redirectUri,
    } = event.queryStringParameters || {};

    const client = Client.getById(clientId);
    if (responseType !== 'code' || !client || client.redirectUri !== redirectUri) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          error: 'Invalid query params',
        }),
      };
    }

    return {
      content: (
        <form action="/oauth/authorize" method="post">
          <div className="signin-card mdl-card mdl-shadow--2dp">
            <div className="mdl-card__title mdl-card--expand">
              <h2 className="mdl-card__title-text">Sign in</h2>
            </div>
            <div className="mdl-card__supporting-text">
              <input type="hidden" name="csrfToken" value=""/>
              <input type="hidden" name="clientId" value={clientId}/>
              <input type="hidden" name="redirectUri" value={redirectUri}/>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input className="mdl-textfield__input" type="text" id="username" name="username"/>
                <label className="mdl-textfield__label" for="username">Username</label>
              </div>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input className="mdl-textfield__input" type="password" id="password" name="password"/>
                <label className="mdl-textfield__label" for="password">Password</label>
              </div>
            </div>
            <div className="mdl-card__actions mdl-card--border">
              <input
                className="mdl-button mdl-js-button mdl-button--raised mdl-button--colored"
                type="submit"
                value="Submit"
              />
            </div>
          </div>
        </form>
      ),
      options: {
        pageTemplate: Page,
        title: 'Sign in',
      }
    };
  }
  
  @Route('POST', 'authorize')
  @ContentType(ContentTypes.JSON)
  static async processAuthorization() {
    
  }
  
  @Route('POST', 'token')
  @ContentType(ContentTypes.JSON)
  static async generateToken() {
    
  }
  
  @Route('POST', 'token_info')
  @ContentType(ContentTypes.JSON)
  static async getTokenInfo() {
    
  }
}