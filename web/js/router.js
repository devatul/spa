var router;

module.exports = {
  transitionTo: function (to) {
    router.transitionTo(to);
  },

  getRouter: function () {
    return router;
  },

  run: function (render) {
    router.run(render);
  },
};

var routes = require('./routes'),
  Router = require('react-router');

router = Router.create({
  routes: routes,
  location: null,
});
