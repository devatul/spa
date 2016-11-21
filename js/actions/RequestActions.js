var NubityAPIUtils = require ('../utils/NubityAPIUtils');

module.exports = {
  login: function(user) {
    NubityAPIUtils.login(user);
  },

  forgotPassword: function(email) {
    NubityAPIUtils.forgotPassword(email);
  },

  changePassword: function(token, password, confirmation_password) {
    NubityAPIUtils.changePassword(token, password, confirmation_password);
  },

  getInfrastructureOverview: function(page) {
    NubityAPIUtils.getInfrastructureOverview(page);
  },

  getInfrastructurePublicCloud: function() {
    NubityAPIUtils.getInfrastructurePublicCloud();
  },

  getAlerts: function(page) {
    NubityAPIUtils.getAlerts(page);
  },
  
  getNinja: function(page) {
    NubityAPIUtils.getAlerts(page);
  },
}
