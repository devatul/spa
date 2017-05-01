var router;
var Router = require('react-router');
module.exports = {
  transitionTo: function (to) {
    Router.hashHistory.push(to);
  },

  getRouter: function () {
    return router;
  },

  run: function (render) {
    router.run(render);
  },
};
