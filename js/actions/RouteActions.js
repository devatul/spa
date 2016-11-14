var Dispatcher  = require('../dispatcher/Dispatcher');
var Constants   = require('../constants/Constants');
var ActionTypes = require ('../constants/Constants').ActionTypes;

var ActionTypes = Constants.ActionTypes;

module.exports = {
  redirect: function(route) {
    Dispatcher.handleViewAction({
      actionType: ActionTypes.REDIRECT,
      route: route,
    });
  },
};
