var Dispatcher  = require('../dispatcher/Dispatcher');
var Constants   = require('../constants/Constants');
var ActionTypes = Constants.ActionTypes;

module.exports = {
  redirect: function (route) {
    Dispatcher.handleViewAction({
      actionType: ActionTypes.REDIRECT,
      route: route,
    });
  },

  redirectWithParams: function (route, param) {
    Dispatcher.handleViewAction({
      actionType: ActionTypes.REDIRECT_WITH_PARAMS,
      route: route,
      param: param,
    });
  },
};
