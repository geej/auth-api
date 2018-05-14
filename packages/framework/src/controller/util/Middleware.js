function bind(original, context) {
  if (original.isMiddleware) {
    return original.bind(null, context);
  }

  return original.bind(context);
}

function applyMiddleware(middleware, next) {
  const replacement = async (context, event) => {
    return middleware(event, bind(next, context));
  };
  replacement.isMiddleware = true;
  return replacement;
}

export default middleware => (target, key, descriptor) => {
  // If this middleware is being applied to a Controller, register it on all Routes.
  if (key === undefined) {
    const routes = target.__getHandlers();
    const routeKeys = Object.keys(routes);

    routeKeys.forEach((key) => {
      target[key] = applyMiddleware(middleware, target[key]);
    });

    return target;
  }

  descriptor.value = applyMiddleware(middleware, descriptor.value);
  return descriptor;
}

