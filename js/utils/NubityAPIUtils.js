var request                        = require('superagent');
var Constants                      = require('../constants/Constants');
var SessionStore                   = require('../stores/SessionStore');
var redirect                       = require('../actions/RouteActions').redirect;
var error                          = require('../actions/ServerActions').error;
var showInfrastructureOverview     = require('../actions/ServerActions').showInfrastructureOverview;
var showInfrastructurePublicCloud  = require('../actions/ServerActions').showInfrastructurePublicCloud;
var showInfrastructurePrivateCloud = require('../actions/ServerActions').showInfrastructurePrivateCloud;
var showInfrastructureOnPremise    = require('../actions/ServerActions').showInfrastructureOnPremise;
var showAlerts                     = require('../actions/ServerActions').showAlerts;
var showHistoryAlerts              = require('../actions/ServerActions').showHistoryAlerts;
var showDashboardAlerts            = require('../actions/ServerActions').showDashboardAlerts;
var showDashboards                 = require('../actions/ServerActions').showDashboards;
var createAlertTicket              = require('../actions/ServerActions').createAlertTicket;
var showDashboard                  = require('../actions/ServerActions').showDashboard;
var showProviders                  = require('../actions/ServerActions').showProviders;
var showNinja                      = require('../actions/ServerActions').showNinja;
var search                         = require('../actions/ServerActions').search;
var showAvailableGraphTypes        = require('../actions/ServerActions').showAvailableGraphTypes;
var showTicket                     = require('../actions/ServerActions').showTicket;
var APIEndpoints                   = Constants.APIEndpoints;

module.exports = {

  login: function (user) {
    request
      .post(APIEndpoints.PUBLIC + '/login.json')
      .send({_username: user.email, _password: user.password})
      .set('Accept', 'aplication/json')
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.login(user);
        } else if (400 <= code) {
          redirect('login');
        } else {
          localStorage.setItem('nubity-token', text.token);
          localStorage.setItem('nubity-refresh-token', text.refresh_token);
          this.getUser();
        }
      }.bind(this));
  },

  forgotPassword: function (email) {
    request
      .post(APIEndpoints.PUBLIC + '/password/request-reset.json')
      .send({_username: email})
      .set('Accept', 'aplication/json')
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (400 <= code) {
          redirect('login');
        } 
      }.bind(this));
  },

  changePassword: function (token, password, confirmation_password) {
    request
      .post(APIEndpoints.PUBLIC + '/password/reset/' + token + '.json')
      .send({_password: password, _password_confirmation: confirmation_password})
      .set('Accept', 'aplication/json')
      .end(function (res) {
        if (400 <= code) {
          redirect('login');
        } else {
          redirect('login');
        }
      }.bind(this));
  },

  refreshToken: function () {
    request
      .post(APIEndpoints.PUBLIC + '/token/refresh.json')
      .set('Accept', 'aplication/json')
      .send({refresh_token: localStorage.getItem('nubity-refresh-token')})
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
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

  getUser: function () {
    var token = this.getToken();
    request
      .get(APIEndpoints.PUBLIC + '/user.json')
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getUser();
        } else if (400 <= code) {
          redirect('login');
        } else {
          localStorage.setItem('nubity-company', text.company);
          localStorage.setItem('nubity-firstname', text.firstname);
          localStorage.setItem('nubity-lastname', text.lastname);
          localStorage.setItem('nubity-user-id', text.user);
          localStorage.setItem('nubity-user-email', text.username);
          redirect('dashboard');
        }
      }.bind(this));
  },

  getDashboard: function (id) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');
    request
    .get(APIEndpoints.PUBLIC + '/slot' )
    .query({user_id: user, company_id: company, dashboard_id: id, include_content: 1})
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getDashboard();
      } else if (400 <= code) {
        redirect('login');
      } else {
        showDashboard(text);
      }
    }.bind(this));
  },

  getDashboards: function () {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');

    request
    .get(APIEndpoints.PUBLIC + '/company/' + company + '/user/' + user + '/dashboard')
    .query({scope: 'dashboard'})
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getDashboards();
      } else if (400 <= code) {
        redirect('login');
      } else {
        showDashboards(text);
        for (var key in text.member) {
          this.getDashboard(text.member[key].dashboard);
        }
      }
    }.bind(this));
  },

  getInfrastructureOverview: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .query({page: page, include_health: true})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getInfrastructureOverview(page);
        } else if (400 <= code) {
          redirect('login');
        } else {
          showInfrastructureOverview(text);
        }
      }.bind(this));

    } else {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .query({include_health: true})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getInfrastructureOverview(page);
        } else if (400 <= code) {
          redirect('login');
        } else {
          showInfrastructureOverview(text);
        }
      }.bind(this));
    }   
  },

  getInfrastructurePublicCloud: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .query({provider_classification: 'public', page: page, include_health: true})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getInfrastructurePublicCloud();
        } else if (400 <= code) {
          redirect('login');
        } else {
          showInfrastructurePublicCloud(text);
        }
      }.bind(this));

    } else {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .query({provider_classification: 'public', include_health: true})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getInfrastructurePublicCloud();
        } else if (400 <= code) {
          redirect('login');
        } else {
          showInfrastructurePublicCloud(text);
        }
      }.bind(this));
    }   
  },

  getInfrastructurePrivateCloud: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .query({provider_classification: 'private', page: page})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getInfrastructurePrivateCloud();
        } else if (400 <= code) {
          redirect('login');
        } else {
          showInfrastructurePrivateCloud(text);
        }
      }.bind(this));

    } else {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .query({provider_classification: 'private'})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getInfrastructurePrivateCloud();
        } else if (400 <= code) {
          redirect('login');
        } else {
          showInfrastructurePrivateCloud(text);
        }
      }.bind(this));
    }   
  },

  getInfrastructureOnPremise: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .query({provider_classification: 'on-premise', page: page})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getInfrastructureOnPremise(page);
        } else if (400 <= code) {
          redirect('login');
        } else {
          showInfrastructureOnPremise(text);
        }
      }.bind(this));

    } else {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/instances')
      .query({provider_classification: 'on-premise'})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getInfrastructureOnPremise(page);
        } else if (400 <= code) {
          redirect('login');
        } else {
          showInfrastructureOnPremise(text);
        }
      }.bind(this));
    }   
  },

  getAlerts: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/alerts')
      .query({page: page})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getAlerts(page);
        } else if (400 <= code) {
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
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getAlerts(page);
        } else if (400 <= code) {
          redirect('login');
        } else {
          showAlerts(text);
        }
      }.bind(this));
    }
  },

  getHistoryAlerts: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/alerts')
      .query({page: page, include_history: true})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getHistoryAlerts(page);
        } else if (400 <= code) {
          redirect('login');
        } else {
          showHistoryAlerts(text);
        }
      }.bind(this));
    } else {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/alerts')
      .query({include_history: true})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getHistoryAlerts(page);
        } else if (400 <= code) {
          redirect('login');
        } else {
          showHistoryAlerts(text);
        }
      }.bind(this));
    }
  },

  acknowledge: function (alertId) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();

    request
    .put(APIEndpoints.PUBLIC + '/company/' + company + '/alerts/' + alertId + '/acknowledge.json') 
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function (err, res) {
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.acknowledge();
      } else if (400 <= code) {
        redirect('login');
      } else {
        this.getAlerts();
        this.getDashboardAlerts();
      }
    }.bind(this));

  },

  getDashboardAlerts: function () {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');
    request
    .get(APIEndpoints.PUBLIC + '/company/' + company + '/alerts')
    .query({limit: 5})
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getDashboardAlerts();
      } else if (400 <= code) {
        redirect('login');
      } else {
        showDashboardAlerts(text);
      }
    }.bind(this));
  },

  getProviders: function () {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();

    request
    .get(APIEndpoints.PUBLIC + '/provider.json')
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getProviders();
      } else if (400 <= code) {
        redirect('login');
      } else {
        showProviders(text);
      }
    }.bind(this));
  },

  createDashboard: function (widget, server, chart) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');

    request
    .post(APIEndpoints.PUBLIC + '/dashboard') //Changed to createDasboard
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .send({user_id: user, company_id: company, scope: 'dashboard'})
    .end(function (res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getDashboards();
      } else if (400 <= code) {
        redirect('login');
      } else {
        showDashboards(text);
      }
    }.bind(this));
  },

  search: function () {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    request
    .get(APIEndpoints.PUBLIC + '/company/' + company + '/search.json')
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.search();
      } else if (400 <= code) {
        redirect('login');
      } else {
        search(text);
      }
    }.bind(this));
  },

  getNinja: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get(APIEndpoints.PUBLIC + '/company/' + company + '/ticket')
      .query({page: page})
      .set('Accept', 'aplication/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getNinja(page);
        } else if (400 <= code) {
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
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (401 == code && this.hasToRefresh()) {
          this.refreshToken();
          this.getNinja(page);
        } else if (400 <= code) {
          redirect('login');
        } else {
          showNinja(text);
        }
      }.bind(this));
    }
  },

  createTicket: function(ticket) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();

    request
    .post(APIEndpoints.PUBLIC + '/company/' + company + '/ticket.json')
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .send({department_id: ticket.department, priority_id: ticket.priority, type_id: ticket.type, subject: ticket.subject, content: ticket.content, hostname: ticket.hostname})
    .end(function(res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.createTicket(ticket);
      } else if (400 <= code) {
        redirect('login');
      } else {
        redirect('ninja');
      }
    }.bind(this));
  },

  replyTicket: function(id, content) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();

    request
    .post(APIEndpoints.PUBLIC + '/company/' + company + '/ticket/' + id + '/reply.json')
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .send({content: content})
    .end(function(res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.replyTicket(ticket);
      } else if (400 <= code) {
        redirect('login');
      } else {
        this.getTicket(id);
      }
    }.bind(this));
  },

  getTicket: function (ticketId) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    request
    .get(APIEndpoints.PUBLIC + '/company/' + company + '/ticket/' + ticketId)
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      var code = JSON.parse(res.status);
      if (401 == code && this.hasToRefresh()) {
        this.refreshToken();
        this.getTicket();
      } else if (400 <= code) {
        redirect('login');
      } else {
        showTicket(text);
      }
    }.bind(this));
  },

  hasToRefresh: function () {
    return (null != localStorage.getItem('nubity-token') && null != localStorage.getItem('nubity-refresh-token'));
  },

  getToken: function () {
    return ('Bearer '+ localStorage.getItem('nubity-token'));
  },

  createAlertTicket: function (alert) {
    createAlertTicket(alert);
  },
};
