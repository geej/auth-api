import { h } from 'preact';
import Controller from './Controller';
import Route from './util/Route';
import Accepts, * as AcceptTypes from './util/Accepts';
import ContentType, * as ContentTypes from './util/ContentType';
import Page from '../view/Page';
import CreateForm from '../view/CreateForm';

export default class RESTController extends Controller {
  static model = null;

  @Route('POST')
  @Accepts(AcceptTypes.FORM)
  @ContentType(ContentTypes.JSON)
  static async create(event) {
    try {
      const { id } = await this.model.create(event.body);

      return { id };
    } catch (err) {
      return { statusCode: 500 };
    }
  }


  @Route('GET', 'new')
  @ContentType(ContentTypes.JSX)
  static async new() {
    return {
      content: <CreateForm
        csrfToken="abc"
        model={this.model}
        url="/accounts"
      />,
      options: {
        pageTemplate: Page,
        title: `Create ${this.model.schema.title}`,
      }
    };
  }
}