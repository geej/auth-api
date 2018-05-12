import qs from 'querystring';
import { h } from 'preact';
import { getCSRFToken } from '../../util/csrf';
import renderAsHtml from '../../view/renderAsHtml';
import CreateForm from '../../view/CreateForm';
import Account from '../../models/Account';

module.exports = async () => {
  const token = getCSRFToken();

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
      'Set-Cookie': `${qs.stringify({ 'csrf-token': token })}; Max-Age=300`,
    },
    body: renderAsHtml({
      children: <CreateForm
        csrfToken={token}
        model={Account}
        url="/accounts"
      />,
      styles: '',
      title: 'Create Account',
    }),
  };
};
