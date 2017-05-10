var redirect        = require('../actions/RouteActions').redirect;

module.exports = {
  redirectLogin: function () {
    redirect('login');
  },
  redirectDashboard: function () {
    redirect('/');
  },
  redirectNinja: function () {
    redirect('ninja-support');
  },
  redirectTo: function (to) {
    redirect(to);
  },
};
