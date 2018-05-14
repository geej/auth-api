export default (method, path) => (target, key, descriptor) => {
  target.__upsertHandler(key, {
    method,
    path,
  });

  return descriptor;
};