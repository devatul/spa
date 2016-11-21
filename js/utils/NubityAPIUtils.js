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
        if (401 == code) {
          this.refreshToken();
          this.login(user);
        } else if (400 <= code) {
          console.error("Error in login request", code);
        } else {
          var token = 'Bearer '+ text.token;
          localStorage.setItem('nubity-token', token);
          localStorage.setItem('nubity-refresh-token', text.refresh_token);
          this.getUser();
        }
      }.bind(this));
  },

  forgotPassword: function(email) {
    request
      .post(APIEndpoints.PUBLIC + '/password/request-reset.json')
      .send({_username: email})
      .set('Accept', 'aplication/json')
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (400 <= code) {
          console.error("Error in request password request", code);
        } 
      }.bind(this));
  },

  changePassword: function(token, password, confirmation_password) {
    request
      .post(APIEndpoints.PUBLIC + '/password/reset/' + token + '.json')
      .send({_password: password, _password_confirmation: confirmation_password})
      .set('Accept', 'aplication/json')
      .end(function(res) {
        if (400 <= code) {
          console.error("Error in request password request", code);
        } else {
          redirect('login');
        }
      }.bind(this));
  },

  refreshToken: function() {
    console.log("refresh");
    request
      .post(APIEndpoints.PUBLIC + '/token/refresh.json')
      .set('Accept', 'aplication/json')
      .send({refresh_token: localStorage.getItem('nubity-refresh-token')})
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        console.log(res);
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
        if (401 == code) {
          this.refreshToken();
          this.getUser();
        } else if (400 <= code) {
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
        if (401 == code) {
          this.refreshToken();
          this.getInfrastructureOverview(page);
        } else if (400 <= code) {
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
        if (401 == code) {
          this.refreshToken();
          this.getInfrastructureOverview(page);
        } else if (400 <= code) {
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
        if (401 == code) {
          this.refreshToken();
          this.getInfrastructurePublicCloud();
        } else if (400 <= code) {
          console.error("Error in instances request", code);
        } else {
          showInfrastructurePublicCloud(text);
        }
      }.bind(this));
  },

  getAlerts: function(page) {
    var company = localStorage.getItem('nubity-company');
    if (page != 0) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/alerts')
      .query({page: page})
      .set('Accept', 'aplication/json')
      .set('Authorization', localStorage.getItem('nubity-token'))
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code) {
          this.refreshToken();
          this.getAlerts(page);
        } else if (400 <= code) {
          console.error("Error in alerts request", code);
        } else {
          showAlerts(text);
        }
      }.bind(this));
    } else {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/alerts')
      .set('Accept', 'aplication/json')
      .set('Authorization', localStorage.getItem('nubity-token'))
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code) {
          this.refreshToken();
          this.getAlerts(page);
        } else if (400 <= code) {
          console.error("Error in alerts request", code);
        } else {
          showAlerts(text);
        }
      }.bind(this));
    }
  },
};
