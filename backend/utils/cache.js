let store = {};

module.exports = {
  get: function (key) {
    return store[key] || null;
  },
  set: function (key, value) {
    store[key] = value;
  },
  del: function (key) {
    delete store[key];
  },
  delPrefix: function (prefix) {
    Object.keys(store).forEach(function (key) {
      if (key.indexOf(prefix) === 0) delete store[key];
    });
  },
};