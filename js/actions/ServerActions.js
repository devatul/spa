var Dispatcher    = require ('../dispatcher/Dispatcher');
var ActionTypes   = require ('../constants/Constants').ActionTypes;

module.exports = {
  isLogin: function() {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.LOGIN_RESPONSE,
    });
  },

  logOut: function() {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.LOGOUT,
    });
  },

  showInfrastructureOverview: function(overview) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_INFRASTRUCTURE_OVERVIEW,
      res: overview,
    });
  },

  showInfrastructurePublicCloud: function(publicCloud) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_INFRASTRUCTURE_PUBLIC_CLOUD,
      res: publicCloud,
    });
  },
  
  showAlerts: function(alerts) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_ALERTS,
      res: alerts,
    });
  },
}
