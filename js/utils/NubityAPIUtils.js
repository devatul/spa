var request                        = require('superagent');
var Constants                      = require('../constants/Constants');
var SessionStore                   = require('../stores/SessionStore');
var redirect                       = require('../actions/RouteActions').redirect;
var error                          = require('../actions/ServerActions').error;
var showInfrastructureOverview     = require('../actions/ServerActions').showInfrastructureOverview;
var showInfrastructurePublicCloud  = require('../actions/ServerActions').showInfrastructurePublicCloud;
var showAlerts                     = require('../actions/ServerActions').showAlerts;
var APIEndpoints                   = Constants.APIEndpoints;

module.exports = {

  login: function(user) {
    request
      .post(APIEndpoints.PUBLIC + '/login.json')
      .send({_username: 'mail', _password: 'password'})
      .set('Accept', 'aplication/json')
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (400 <= code) {
          console.error("Error in login request", code);
        } else {
          var token = 'Bearer '+ text.token;
          localStorage.setItem('nubity-token', token);
          redirect('infrastructure');
        }
      }.bind(this));
  },

  getInfrastructureOverview: function() {
    request
      .get(APIEndpoints.PUBLIC + '/company/78/instances')
      .set('Accept', 'aplication/json')
      .set('Authorization', localStorage.getItem('nubity-token'))
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (400 <= code) {
          console.error("Error in instances request", code);
        } else {
          showInfrastructureOverview(text);
        }
      }.bind(this));
  },
  getInfrastructurePublicCloud: function() {
    request
      .get(APIEndpoints.PUBLIC + '/company/78/instances')
      .set('Accept', 'aplication/json')
      .set('Authorization', localStorage.getItem('nubity-token'))
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (400 <= code) {
          console.error("Error in instances request", code);
        } else {
          showInfrastructurePublicCloud(text);
        }
      }.bind(this));
  },

  getAlerts: function() {
    request
      .get(APIEndpoints.PUBLIC + '/company/78/alerts')
      .set('Accept', 'aplication/json')
      .set('Authorization', localStorage.getItem('nubity-token'))
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (400 <= code) {
          console.error("Error in alerts request", code);
        } else {
          showAlerts(text);
        }
      }.bind(this));
  },
};
