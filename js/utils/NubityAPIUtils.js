var request                        = require('superagent');
var Constants                      = require('../constants/Constants');
var SessionStore                   = require('../stores/SessionStore');
var redirect                       = require('../actions/RouteActions').redirect;
var error                          = require('../actions/ServerActions').error;
var showInfrastructureOverview     = require('../actions/ServerActions').showInfrastructureOverview;
var showInfrastructurePublicCloud  = require('../actions/ServerActions').showInfrastructurePublicCloud;
var showAlerts                     = require('../actions/ServerActions').showAlerts;
var showDashboardAlerts            = require('../actions/ServerActions').showDashboardAlerts;
var showDashboards                 = require('../actions/ServerActions').showDashboards;
var showDashboard                  = require('../actions/ServerActions').showDashboard;
var showProviders                  = require('../actions/ServerActions').showProviders;
var showNinja                      = require('../actions/ServerActions').showNinja;
var search                         = require('../actions/ServerActions').search;
var showAvailableGraphTypes        = require('../actions/ServerActions').showAvailableGraphTypes;
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
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.login(user);
        } else if (400 <= code) {
          console.error('Error in login request', code);
          redirect('login');
        } else {
          localStorage.setItem('nubity-token', text.token);
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
          console.error('Error in request password request', code);
          redirect('login');
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
          console.error('Error in request password request', code);
          redirect('login');
        } else {
          redirect('login');
        }
      }.bind(this));
  },

  refreshToken: function() {
    console.log('refresh');
    request
      .post(APIEndpoints.PUBLIC + '/token/refresh.json')
      .set('Accept', 'aplication/json')
      .send({refresh_token: localStorage.getItem('nubity-refresh-token')})
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        console.log(res);
        if (401 == code) {
          localStorage.removeItem('nubity-token');
          localStorage.removeItem('nubity-refresh-token');
          redirect('login');
        } else {
          localStorage.setItem('nubity-token', text.token);
          localStorage.setItem('nubity-refresh-token', text.refresh_token);
        }
      }.bind(this));
  },

  getUser: function() {
    var token = this.getToken();
    request
      .get(APIEndpoints.PUBLIC + '/user.json')
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        console.log('user',res);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getUser();
        } else if (400 <= code) {
          console.error('Error in user request', code);
          redirect('login');
        } else {
          localStorage.setItem('nubity-company', text.company);
          localStorage.setItem('nubity-firstname', text.firstname);
          localStorage.setItem('nubity-lastname', text.lastname);
          localStorage.setItem('nubity-user-id', text.user);
          localStorage.setItem('nubity-user-email', text.username);
          redirect('infrastructure');
        }
      }.bind(this));
  },

  getDashboard: function(id) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');
    request
    .get(APIEndpoints.PUBLIC + '/slot' )
    .query({user_id: user, company_id: company, dashboard_id: id, include_content: 1})
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function(res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      console.log('one dashboard', text);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getDashboard();
      } else if (400 <= code) {
        console.error('Error in dashboard request', code);
        redirect('login');
      } else {
        showDashboard(text);
      }
    }.bind(this));
  },

  getDashboards: function() {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');

    request
    .get(APIEndpoints.PUBLIC + '/company/' + company + '/user/' + user + '/dashboard')
    .query({scope: 'dashboard'})
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function(res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      console.log('res dashboard', text);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getDashboards();
      } else if (400 <= code) {
        console.error('Error in dashboards request', code);
        redirect('login');
      } else {
        showDashboards(text);
        for (var key in text.member) {
          this.getDashboard(text.member[key].dashboard);
        }
      }
    }.bind(this));
  },

  getInfrastructureOverview: function(page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (page != 0) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .query({page: page})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getInfrastructureOverview(page);
        } else if (400 <= code) {
          console.error('Error in instances request', code);
          redirect('login');
        } else {
          showInfrastructureOverview(text);
        }
      }.bind(this));

    } else {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getInfrastructureOverview(page);
        } else if (400 <= code) {
          console.error('Error in instances request', code);
          redirect('login');
        } else {
          showInfrastructureOverview(text);
        }
      }.bind(this));
    }   
  },

  getInfrastructurePublicCloud: function() {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getInfrastructurePublicCloud();
        } else if (400 <= code) {
          console.error('Error in instances request', code);
          redirect('login');
        } else {
          showInfrastructurePublicCloud(text);
        }
      }.bind(this));
  },

  getAlerts: function(page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (page != 0) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/alerts')
      .query({page: page})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getAlerts(page);
        } else if (400 <= code) {
          console.error('Error in alerts request', code);
          redirect('login');
        } else {
          showAlerts(text);
        }
      }.bind(this));
    } else {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/alerts')
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function(res) {
        var text = JSON.parse(res.text);
        console.log('alerts', text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getAlerts(page);
        } else if (400 <= code) {
          console.error('Error in alerts request', code);
          redirect('login');
        } else {
          showAlerts(text);
        }
      }.bind(this));
    }
  },

  getDashboardAlerts: function() {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');
    request
    .get(APIEndpoints.PUBLIC + '/company/' + company + '/alerts')
    .query({limit: 5})
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function(res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getDashboardAlerts();
      } else if (400 <= code) {
        console.error('Error in dashboard alerts request', code);
        redirect('login');
      } else {
        showDashboardAlerts(text);
      }
    }.bind(this));
  },

  getProviders: function() {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();

    request
    .get(APIEndpoints.PUBLIC + '/provider.json')
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function(res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getProviders();
      } else if (400 <= code) {
        console.error('Error in providers request', code);
        redirect('login');
      } else {
        showProviders(text);
      }
    }.bind(this));
  },

  createDashboard: function(widget, server, chart) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');

    request
    .post(APIEndpoints.PUBLIC + '/dashboard') //Changed to createDasboard
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .send({user_id: user, company_id: company, scope: 'dashboard'})
    .end(function(res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      console.log('res dashboard', res);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getDashboards();
      } else if (400 <= code) {
        console.error('Error in dashboard request', code);
        redirect('login');
      } else {
        showDashboards(text);
      }
    }.bind(this));
  },

  search: function() {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    request
    .get(APIEndpoints.PUBLIC + '/company/' + company + '/search.json')
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function(res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      console.log('one dashboard', text);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getUser();
      } else if (400 <= code) {
        console.error('Error in search request', code);
        redirect('login');
      } else {
        search(text);
      }
    }.bind(this));
  },

  getNinja: function(page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (page != 0) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/ticket')
      .query({page: page})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getNinja(page);
        } else if (400 <= code) {
          console.error('Error in ninja request', code);
          redirect('login');
        } else {
          showNinja(text);
        }
      }.bind(this));
    } else {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/ticket')
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function(res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getNinja(page);
        } else if (400 <= code) {
          console.error('Error in ninja request', code);
          redirect('login');
        } else {
          showNinja(text);
        }
      }.bind(this));
    }
  },

  hasToRefresh: function() {
    return (null != localStorage.getItem('nubity-token') && null != localStorage.getItem('nubity-refresh-token'));
  },

  getToken: function() {
    return ('Bearer '+ localStorage.getItem('nubity-token'));
  }
};
