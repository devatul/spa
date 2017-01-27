var NubityAPIUtils = require ('../utils/NubityAPIUtils');

module.exports = {
  login: function (user) {
    NubityAPIUtils.login(user);
  },

  signup: function (user) {
    NubityAPIUtils.signup(user);
  },

  confirmAccount: function (token) {
    NubityAPIUtils.confirmAccount(token);
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

  getStats: function () {
    NubityAPIUtils.getStats();
  },
  
  getHistoryAlerts: function (page) {
    NubityAPIUtils.getHistoryAlerts(page);
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

  createDashboard: function (widget, server, chart, dashboardId, position) {
    NubityAPIUtils.createGraph(widget, server, chart, dashboardId, position);
  },

  createGraph: function (widget, server, chart, dashboardId, position) {
    NubityAPIUtils.createGraph(widget, server, chart, dashboardId, position);
  },

  deleteSlot: function (slot) {
    NubityAPIUtils.deleteSlot(slot);
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

  replyTicket: function(id, content) {
    NubityAPIUtils.replyTicket(id, content);
  },

  createAlertTicket: function (alert) {
    NubityAPIUtils.createAlertTicket(alert);
  },

  acknowledge: function (alertId) {
    NubityAPIUtils.acknowledge(alertId);
  },

  getTicket: function (ticket) {
    NubityAPIUtils.getTicket(ticket);
  },

  getCompanyInfo: function (company) {
    NubityAPIUtils.getCompanyInfo(company);
  },

  getMonitored: function (instanceId) {
    NubityAPIUtils.getMonitored(instanceId);
  }
}
