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
      .send({_username: user.email, _password: user.password})
      .set('Accept', 'aplication/json')
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (400 <= code) {
          console.error("Error in login request", code);
        } else {
          var token = 'Bearer '+ text.token;
          localStorage.setItem('nubity-token', token);
          this.getUser();
        }
      }.bind(this));
  },

  getUser: function() {
    request
      .get(APIEndpoints.PUBLIC + '/user.json')
      .set('Accept', 'aplication/json')
      .set('Authorization', localStorage.getItem('nubity-token'))
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (400 <= code) {
          console.error("Error in user request", code);
        } else {
          localStorage.setItem('nubity-company', text.company);
          localStorage.setItem('nubity-firstname', text.firstname);
          localStorage.setItem('nubity-lastname', text.lastname);
          redirect('infrastructure');
        }
      }.bind(this));
  },

  getInfrastructureOverview: function(page) {
    var company = localStorage.getItem('nubity-company');
    if (page != 0) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .query({page: page})
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

    } else {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .set('Accept', 'aplication/json')
      .set('Authorization', localStorage.getItem('nubity-token'))
      .end(function(res) {
        console.log(res);
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (400 <= code) {
          console.error("Error in instances request", code);
        } else {
          showInfrastructureOverview(text);
        }
      }.bind(this));
    }   
  },

  getInfrastructurePublicCloud: function() {
    var company = localStorage.getItem('nubity-company');
    request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
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
    var company = localStorage.getItem('nubity-company');
    request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/alerts')
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
