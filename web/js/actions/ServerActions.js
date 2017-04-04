var Dispatcher    = require ('../dispatcher/Dispatcher');
var ActionTypes   = require ('../constants/Constants').ActionTypes;

module.exports = {
  isLogin: function () {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.LOGIN_RESPONSE,
    });
  },

  loginError: function (message) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.LOGIN_ERROR,
      res: message,
    });
  },

  logOut: function () {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.LOGOUT,
    });
  },

  goBackToAdmin: function () {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.BACK_TO_ADMIN,
    });
  },

  showSignupMessage: function (message) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_SIGNUP_MESSAGE,
      res: message,
    });
  },

  showConfirmMessage: function (code, message) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_CONFIRM_MESSAGE,
      res: message,
      code: code,
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

  showInstanceForMonitoring: function (instance) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_INSTANCE_FOR_MONITORING,
      res: instance,
    });
  },

  showInstanceConfiguration: function (instance) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_INSTANCE_CONFIGURATION,
      res: instance,
    });
  },

  showInfrastructurePrivateCloud: function (privateCloud) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_INFRASTRUCTURE_PRIVATE_CLOUD,
      res: privateCloud,
    });
  },

  showInfrastructureOnPremise: function (onPremise) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_INFRASTRUCTURE_ON_PREMISE,
      res: onPremise,
    });
  },

  showAlerts: function (alerts) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_ALERTS,
      res: alerts,
    });
  },

  showStats: function (stats) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_STATS,
      res: stats,
    });
  },

  showHistoryAlerts: function (alerts) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_HISTORY_ALERTS,
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
  },

  createAlertTicket: function (alert) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.CREATE_ALERT_TICKET,
      res: alert,
    });
  },

  viewTicket: function (ticket) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.VIEW_TICKET,
      res: ticket,
    });
  },

  showTicket: function (ticket) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_TICKET,
      res: ticket,
    });
  },

  showCompany: function (companyInfo) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_COMPANY,
      res: companyInfo,
    });
  },
  showCustomDashboards: function (dashboards) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_CUSTOM_DASHBOARDS,
      res: dashboards,
    });
  },
  showCustomSlots: function (slots) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.SHOW_CUSTOM_SLOTS,
      res: slots,
    });
  },
  showTimezone: function (timezone) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.STORE_TIMEZONE,
      res: timezone,
    });
  },
  showLocales: function (locales) {
    Dispatcher.handleServerAction({
      actionType: ActionTypes.STORE_LOCALES,
      res: locales,
    });
  },
};
