var NubityAPIUtils = require ('../utils/NubityAPIUtils');

module.exports = {
  getInfrastructureOverview: function() {
    NubityAPIUtils.getInfrastructureOverview();
  },

  getInfrastructurePublicCloud: function() {
    NubityAPIUtils.getInfrastructurePublicCloud();
  },
}
