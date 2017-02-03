var NubityAPIUtils = require ('../utils/NubityAPIUtils');

module.exports = {
  login: function (user) {
    NubityAPIUtils.login(user);
  },

  getUserForSwitchUser: function () {
    NubityAPIUtils.getUserForSwitchUser();
  },

  signup: function (user) {
    return NubityAPIUtils.signup(user);
  },

  confirmAccount: function (token) {
    NubityAPIUtils.confirmAccount(token);
  },

  forgotPassword: function (email) {
    return NubityAPIUtils.forgotPassword(email);
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

  getDashboard: function (dashboardId) {
    NubityAPIUtils.getDashboard(dashboardId);
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

  createTicket: function (ticket) {
    NubityAPIUtils.createTicket(ticket);
  },

  closeTicket: function (ticket) {
    NubityAPIUtils.closeTicket(ticket);
  },

  replyTicket: function (ticketId, content) {
    NubityAPIUtils.replyTicket(ticketId, content);
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
  },

  getManaged: function (instanceId) {
    NubityAPIUtils.getManaged(instanceId);
  },

  stopOrder: function (orderCode) {
    NubityAPIUtils.stopOrder(orderCode);
  },

  startInstance: function (instanceId) {
    NubityAPIUtils.startInstance(instanceId);
  },

  restartInstance: function (instanceId) {
    NubityAPIUtils.restartInstance(instanceId);
  },

  stopInstance: function (instanceId) {
    NubityAPIUtils.stopInstance(instanceId);
  },

  deleteOrderCancelation: function (orderCode) {
    NubityAPIUtils.deleteOrderCancelation(orderCode);
  },

  getInstanceForMonitoring: function (instanceId) {
    NubityAPIUtils.getInstanceForMonitoring(instanceId);
  },

  getInstanceConfiguration: function (instanceId) {
    NubityAPIUtils.getInstanceConfiguration(instanceId);
  },

  uninstallPlugin: function (pluginId, instanceId) {
    NubityAPIUtils.uninstallPlugin(pluginId, instanceId);
  },

  installPlugin: function (pluginId, instanceId) {
    NubityAPIUtils.installPlugin(pluginId, instanceId);
  }

  configureTemplate: function (id, macros, templateId) {
    NubityAPIUtils.configureTemplate(id, macros, templateId);
  },

  submitCloudData: function (cloudData) {
    NubityAPIUtils.submitCloudData(cloudData);
  },
}
