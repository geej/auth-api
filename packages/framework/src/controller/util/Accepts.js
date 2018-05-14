import { parse } from 'querystring';
import middleware from './Middleware';

export default acceptsFn => middleware(acceptsFn);

const JSONAcceptor = async (event, next) => {
  return next({
    ...event,
    rawBody: event.body,
    body: JSON.parse(event.body),
  });
};
const FormAcceptor = async (event, next) => {
  return next({
    ...event,
    rawBody: event.body,
    body: parse(event.body),
  });
};

export {
  JSONAcceptor as JSON,
  FormAcceptor as FORM,
};