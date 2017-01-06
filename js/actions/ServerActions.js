var Dispatcher    = require ('../dispatcher/Dispatcher');
var ActionTypes   = require ('../constants/Constants').ActionTypes;

module.exports = {
  isLogin: function () {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.LOGIN_RESPONSE,
    });
  },

  logOut: function () {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.LOGOUT,
    });
  },

  showInfrastructureOverview: function (overview) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_INFRASTRUCTURE_OVERVIEW,
      res: overview,
    });
  },

  showInfrastructurePublicCloud: function (publicCloud) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_INFRASTRUCTURE_PUBLIC_CLOUD,
      res: publicCloud,
    });
  },
  
  showAlerts: function (alerts) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_ALERTS,
      res: alerts,
    });
  },

  showDashboardAlerts: function (dashboardAlerts) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_DASHBOARD_ALERTS,
      res: dashboardAlerts,
    });
  },

  showProviders: function (providers) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_PROVIDERS,
      res: providers,
    });
  },

  showDashboards: function (dashboards) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_DASHBOARDS,
      res: dashboards,
    });
  },

  showNinja: function (ninja) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_NINJA,
      res: ninja,
    });
  },

  showDashboard: function (dashboard) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_DASHBOARD,
      res: dashboard,
    });
  },

  search: function (search) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SEARCH,
      res: search,
    });
  },

  showAvailableGraphTypes: function (graphTypes) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_AVAILABLE_GRAPH_TYPES,
      res: graphTypes,
    });
  }
}
