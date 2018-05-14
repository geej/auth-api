import path from 'path';
import Controller from './controller/Controller';
import controllerBindProxy from './controller/util/controllerBindProxy';

export default class Router {
  static from(routesObject) {
    const routes = {};
    const keys = Object.keys(routesObject);

    keys.forEach((key) => {
      const route = routesObject[key];

      if (!Controller.isPrototypeOf(route)) {
        throw new Error();
      }

      if (route) {
        const boundController = controllerBindProxy(route);
        const handlers = boundController.__getHandlers();

        Object.keys(handlers).forEach((handlerKey) => {
          const handlerPath = path.join(key, handlerKey);
          const handler = handlers[handlerKey];

          routes[`${handler.method}_${handlerPath.replace(/\//g, '_')}`] = {
            handler: boundController[handlerKey],
            events: [
              {
                http: {
                  path: handlerPath,
                  method: handler.method,
                }
              }
            ],
          };
        });
      }
    });

    return routes;
  }
}