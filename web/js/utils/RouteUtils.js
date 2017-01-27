var redirect        = require ('../actions/RouteActions').redirect;

module.exports = {
  redirectLogin: function () {
    redirect ('login');
  },
  redirectDashboard: function () {
    redirect ('dashboard');
  },
  redirectNinja: function () {
    redirect ('ninja');
  },
  redirectTo: function (to) {
    redirect (to)
  }
};
