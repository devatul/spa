var NubityAPIUtils = require ('../utils/NubityAPIUtils');

module.exports = {
  login: function (user) {
    NubityAPIUtils.login(user);
  },

  forgotPassword: function (email) {
    NubityAPIUtils.forgotPassword(email);
  },

  changePassword: function (token, password, confirmation_password) {
    NubityAPIUtils.changePassword(token, password, confirmation_password);
  },

  getInfrastructureOverview: function (page) {
    NubityAPIUtils.getInfrastructureOverview(page);
  },

  getInfrastructurePublicCloud: function (page) {
    NubityAPIUtils.getInfrastructurePublicCloud(page);
  },

  getInfrastructurePrivateCloud: function (page) {
    NubityAPIUtils.getInfrastructurePrivateCloud(page);
  },
  getInfrastructureOnPremise: function (page) {
    NubityAPIUtils.getInfrastructureOnPremise(page);
  },

  getAlerts: function (page) {
    NubityAPIUtils.getAlerts(page);
  },

  getDashboardAlerts: function () {
    NubityAPIUtils.getDashboardAlerts();
  },
  
  getNinja: function (page) {
    NubityAPIUtils.getNinja(page);
  },
  
  getProviders: function () {
    NubityAPIUtils.getProviders();
  },

  getDashboards: function () {
    NubityAPIUtils.getDashboards();
  },

  getDashboard: function (id) {
    NubityAPIUtils.getDashboard(id);
  },

  createDashboard: function (widget, server, chart) {
    NubityAPIUtils.createGraph(widget, server, chart);
  },

  search: function () {
    NubityAPIUtils.search();
  },

  getAvailableGraphTypes: function (id) {
    NubityAPIUtils.getAvailableGraphTypes(id);
  },

  createTicket: function(ticket) {
    NubityAPIUtils.createTicket(ticket);
  },

  createAlertTicket: function (alert) {
    NubityAPIUtils.createAlertTicket(alert);
  },
}
