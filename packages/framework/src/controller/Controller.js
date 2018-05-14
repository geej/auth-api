export default class Controller {
  static __handlers = {};

  static __upsertHandler(handler, options) {
    if (!this.hasOwnProperty('__handlers')) {
      this.__handlers = {};
    }

    if (!this.__handlers[handler]) {
      this.__handlers[handler] = {};
    }

    this.__handlers[handler] = {
      ...this.__handlers[handler],
      ...options,
    }
  }

  static __getHandlers() {
    const inheritedHandlers =  Object.getPrototypeOf(this).__getHandlers ? Object.getPrototypeOf(this).__getHandlers() : {};
    return {
      ...inheritedHandlers,
      ...this.__handlers,
    }
  }
}
