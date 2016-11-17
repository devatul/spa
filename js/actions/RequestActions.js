var NubityAPIUtils = require ('../utils/NubityAPIUtils');

module.exports = {
  login: function(user) {
    NubityAPIUtils.login(user);
  },

  getInfrastructureOverview: function(page) {
    NubityAPIUtils.getInfrastructureOverview(page);
  },

  getInfrastructurePublicCloud: function() {
    NubityAPIUtils.getInfrastructurePublicCloud();
  },

  getAlerts: function() {
    NubityAPIUtils.getAlerts();
  },
}
