var NubityAPIUtils = require ('../utils/NubityAPIUtils');

module.exports = {
  login: function(user) {
    NubityAPIUtils.login(user);
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
