import render from 'preact-render-to-string';
import middleware from './Middleware';

export default contentType => middleware(contentType);

const JSONType = async (event, next) => {
  const body = await next(event);

  return {
    statusCode: 200,
    body: JSON.stringify(body),
  };
};

const JSXType = async (event, next) => {
  const {
    content,
    options: {
      pageTemplate,
      ...options
    },
  } = await next(event);

  return {
    statusCode: 200,
    headers: {
      'Content-Type': 'text/html',
    },
    body: pageTemplate(render(content), options),
  };
};

export {
  JSONType as JSON,
  JSXType as JSX,
};

