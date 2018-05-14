export default (controller) => new Proxy(controller, {
  get: function(target, prop, receiver) {
    // Babel's transform-decorators-legacy doesn't support inheritance on static properties.
    // This is a hack to make it work for this case.
    if (Object.keys(target.__getHandlers()).indexOf(prop) !== -1) {
      return target[prop].bind(null, receiver);
    }

    return target[prop];
  }
});