var NubityAPIUtils = require ('../utils/NubityAPIUtils');

module.exports = {
  login: function() {
    NubityAPIUtils.login();
  },

  getInfrastructureOverview: function() {
    NubityAPIUtils.getInfrastructureOverview();
  },

  getInfrastructurePublicCloud: function() {
    NubityAPIUtils.getInfrastructurePublicCloud();
  },

  getAlerts: function() {
    NubityAPIUtils.getAlerts();
  },
}
