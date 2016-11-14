var NubityAPIUtils = require ('../utils/NubityAPIUtils');

module.exports = {
  login: function(user) {
    NubityAPIUtils.login(user);
  },

  getInfrastructureOverview: function() {
    NubityAPIUtils.getInfrastructureOverview();
  },

  getAlerts: function() {
    NubityAPIUtils.getAlerts();
  },
}
