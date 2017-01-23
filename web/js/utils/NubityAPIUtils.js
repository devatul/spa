var request                        = require('superagent-use')(require('superagent'));
var prefix                         = require('superagent-prefix');
var Constants                      = require('../constants/Constants');
var SessionStore                   = require('../stores/SessionStore');
var error                          = require('../actions/ServerActions').error;
var showInfrastructureOverview     = require('../actions/ServerActions').showInfrastructureOverview;
var showInfrastructurePublicCloud  = require('../actions/ServerActions').showInfrastructurePublicCloud;
var showInfrastructurePrivateCloud = require('../actions/ServerActions').showInfrastructurePrivateCloud;
var showInfrastructureOnPremise    = require('../actions/ServerActions').showInfrastructureOnPremise;
var showAlerts                     = require('../actions/ServerActions').showAlerts;
var showStats                      = require('../actions/ServerActions').showStats;
var showHistoryAlerts              = require('../actions/ServerActions').showHistoryAlerts;
var showDashboardAlerts            = require('../actions/ServerActions').showDashboardAlerts;
var showDashboards                 = require('../actions/ServerActions').showDashboards;
var createAlertTicket              = require('../actions/ServerActions').createAlertTicket;
var showDashboard                  = require('../actions/ServerActions').showDashboard;
var showProviders                  = require('../actions/ServerActions').showProviders;
var showNinja                      = require('../actions/ServerActions').showNinja;
var showSignupMessage              = require('../actions/ServerActions').showSignupMessage;
var showConfirmMessage             = require('../actions/ServerActions').showConfirmMessage;
var search                         = require('../actions/ServerActions').search;
var showAvailableGraphTypes        = require('../actions/ServerActions').showAvailableGraphTypes;
var showTicket                     = require('../actions/ServerActions').showTicket;
var showCompany                    = require('../actions/ServerActions').showCompany;
var APIEndpoints                   = Constants.APIEndpoints;
var routes                         = require('./RouteUtils');


request.use(prefix(APIEndpoints.PUBLIC));

module.exports = {
  isTokenValidating: false,
  validateToken: function (res) {
    var _SELF = this;
    var interval = false;
    var code = JSON.parse(res.status);
    return new Promise(( resolve, reject ) => {
      if (code >= 400 && _SELF.hasToRefresh()) {
        setTimeout( function () {
        if (!_SELF.isTokenValidating) {
          _SELF.isTokenValidating = true;
          _SELF.refreshToken().then(function (msg) {
            _SELF.isTokenValidating = false;
            resolve(false);
          }.bind(_SELF));
        } else {
          interval = setInterval(function () {
            if (!_SELF.isTokenValidating) {
              clearInterval(interval);
              resolve(false);
            }
          }, 100);
        }
      },0);
      } else if (code >= 300 && code < 400) {
        routes.redirectLogin();
      } else if (code >= 200 && code < 300) {
        resolve(true);
      }
    });
  },
  login: function (user) {
    request
      .post('/login.json')
      .send({_username: user.email, _password: user.password})
      .accept('application/json')
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.login(user);
          } else {
            localStorage.setItem('nubity-token', text.token);
            localStorage.setItem('nubity-refresh-token', text.refresh_token);
            this.getUser();
          }
        }.bind(this));
      }.bind(this));
  },

  signup: function (user) {
    request
      .post('/signup.json')
      .send({firstname: user.firstname, lastname: user.lastname, email: user.email,  password: user.password, password_confirmation: user.password2, phone: user.phone, company_name: user.company, locale: user.locale})
      .accept('application/json')
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.signup(user);
          } else {
            showSignupMessage(text.message);
          }
        }.bind(this));
      }.bind(this));
  },

  confirmAccount: function (token) {
    request
      .get('/signup/email-confirm/' + token + '.json')
      .accept('application/json')
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (400 <= code) {
          showConfirmMessage(text.code, text.message);
        } else {
          showConfirmMessage(200, "Salio todo bien");
        }

      }.bind(this));
  },
  forgotPassword: function (email) {
    request
      .post('/password/request-reset.json')
      .send({_username: email})
      .accept('application/json')
      .end(function (res) {
        this.validateToken(res);
      }.bind(this));
  },

  changePassword: function (token, password, confirmation_password) {
    request
      .post('/password/reset/' + token + '.json')
      .send({_password: password, _password_confirmation: confirmation_password})
      .accept('application/json')
      .end(function (res) {
        this.validateToken(res).then(function () {
          routes.redirectLogin();
        }.bind(this));
      }.bind(this));
  },

  refreshToken: function () {
    var _SELF = this;
    return new Promise(( resolve, reject ) => {
      request
        .post('/token/refresh.json')
        .accept('application/json')
        .send({refresh_token: localStorage.getItem('nubity-refresh-token')})
        .end(function (res) {
          var text = JSON.parse(res.text);
          var code = JSON.parse(res.status);
          if (401 == code) {
            localStorage.removeItem('nubity-token');
            localStorage.removeItem('nubity-refresh-token');
            routes.redirectLogin();
            resolve();
          } else {
            localStorage.setItem('nubity-token', text.token);
            localStorage.setItem('nubity-refresh-token', text.refresh_token);
            resolve();
          }
        }.bind(_SELF));
    });
  },

  getUser: function () {
    var token = this.getToken();
    request
      .get('/user.json')
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getUser();
          } else {
            localStorage.setItem('nubity-company', text.company);
            localStorage.setItem('nubity-firstname', text.firstname);
            localStorage.setItem('nubity-lastname', text.lastname);
            localStorage.setItem('nubity-user-id', text.user);
            localStorage.setItem('nubity-user-email', text.username);
            localStorage.setItem('nubity-user-avatar', text.public_path);
            localStorage.setItem('nubity-user-language', text.locale_display_name);

            routes.redirectDashboard();
          }
        }.bind(this));
      }.bind(this));
  },

  getCompanyInfo: function () {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    request
    .get('/company/' + company)
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res,function (status) {
        if (!status) {
          this.getCompanyInfo();
        } else {
          showCompany(text);
        }
      }.bind(this));
    }.bind(this));
  },

  getDashboard: function (id) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');
    request
    .get('/slot' )
    .query({user_id: user, company_id: company, dashboard_id: id, include_content: 1})
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getDashboard();
        } else {
          showDashboard(text);
        }
      }.bind(this));
    }.bind(this));
  },

  getDashboards: function () {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');

    request
    .get('/company/' + company + '/user/' + user + '/dashboard')
    .query({scope: 'dashboard'})
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getDashboards();
        } else {
          showDashboards(text);
          for (var key in text.member) {
            this.getDashboard(text.member[key].dashboard);
          }
        }
      }.bind(this));
    }.bind(this));
  },

  getInfrastructureOverview: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get('/company/' + company + '/instances')
      .query({page: page, include_health: true})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getInfrastructureOverview(page);
          } else {
            showInfrastructureOverview(text);
          }
        }.bind(this));
      }.bind(this));

    } else {
      request
      .get('/company/' + company + '/instances')
      .query({include_health: true})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getInfrastructureOverview(page);
          } else {
            showInfrastructureOverview(text);
          }
        }.bind(this));
      }.bind(this));
    }
  },

  getInfrastructurePublicCloud: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get('/company/' + company + '/instances')
      .query({provider_classification: 'public', page: page, include_health: true})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getInfrastructurePublicCloud();
          } else {
            showInfrastructurePublicCloud(text);
          }
        }.bind(this));
      }.bind(this));

    } else {
      request
      .get('/company/' + company + '/instances')
      .query({provider_classification: 'public', include_health: true})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getInfrastructurePublicCloud();
          } else {
            showInfrastructurePublicCloud(text);
          }
        }.bind(this));
      }.bind(this));
    }
  },

  getInfrastructurePrivateCloud: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get('/company/' + company + '/instances')
      .query({provider_classification: 'private', page: page})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getInfrastructurePrivateCloud();
          } else {
            showInfrastructurePrivateCloud(text);
          }
        }.bind(this));
      }.bind(this));

    } else {
      request
      .get('/company/' + company + '/instances')
      .query({provider_classification: 'private'})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getInfrastructurePrivateCloud();
          } else {
            showInfrastructurePrivateCloud(text);
          }
        }.bind(this));
      }.bind(this));
    }
  },

  getInfrastructureOnPremise: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get('/company/' + company + '/instances')
      .query({provider_classification: 'on-premise', page: page})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getInfrastructureOnPremise(page);
          } else {
            showInfrastructureOnPremise(text);
          }
        }.bind(this));
      }.bind(this));

    } else {
      request
      .get('/company/' + company + '/instances')
      .query({provider_classification: 'on-premise'})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getInfrastructureOnPremise(page);
          } else {
            showInfrastructureOnPremise(text);
          }
        }.bind(this));
      }.bind(this));
    }
  },

  getAlerts: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get('/company/' + company + '/alerts')
      .query({page: page})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getAlerts(page);
          } else {
            showAlerts(text);
          }
        }.bind(this));
      }.bind(this));
    } else {
      request
      .get('/company/' + company + '/alerts')
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getAlerts(page);
          } else {
            showAlerts(text);
          }
        }.bind(this));
      }.bind(this));
    }
  },

  getStats: function () {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
      request
      .get('/company/' + company + '/alerts-stats.json')
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getStats();
          } else {
            showStats(text);
          }
        }.bind(this));
      }.bind(this));
  },

  getHistoryAlerts: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get('/company/' + company + '/alerts')
      .query({page: page, include_history: true})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getHistoryAlerts(page);
          } else {
            showHistoryAlerts(text);
          }
        }.bind(this));
      }.bind(this));
    } else {
      request
      .get('/company/' + company + '/alerts')
      .query({include_history: true})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getHistoryAlerts(page);
          } else {
            showHistoryAlerts(text);
          }
        }.bind(this));
      }.bind(this));
    }
  },

  acknowledge: function (alertId) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();

    request
    .put('/company/' + company + '/alerts/' + alertId + '/acknowledge.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (err, res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.acknowledge();
        } else {
          this.getAlerts();
          this.getDashboardAlerts();
        }
      }.bind(this));
    }.bind(this));

  },

  getDashboardAlerts: function () {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');
    request
    .get('/company/' + company + '/alerts')
    .query({limit: 5})
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getDashboardAlerts();
        } else {
          showDashboardAlerts(text);
        }
      }.bind(this));
    }.bind(this));
  },

  getProviders: function () {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();

    request
    .get('/provider.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getProviders();
        } else {
          showProviders(text);
        }
      }.bind(this));
    }.bind(this));
  },

  createDashboard: function (widget, server, chart) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');

    request
    .post('/dashboard') //Changed to createDasboard
    .accept('application/json')
    .set('Authorization', token)
    .send({user_id: user, company_id: company, scope: 'dashboard'})
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getDashboards();
        } else {
          showDashboards(text);
        }
      }.bind(this));
    }.bind(this));
  },

  search: function () {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    request
    .get('/company/' + company + '/search.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.search();
        } else {
          search(text);
        }
      }.bind(this));
    }.bind(this));
  },

  getNinja: function (page) {
    var company = localStorage.getItem('nubity-company');
    var token = this.getToken();
    if (0 != page) {
      request
      .get('/company/' + company + '/ticket')
      .query({page: page})
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getNinja(page);
          } else {
            showNinja(text);
          }
        }.bind(this));
      }.bind(this));
    } else {
      request
      .get('/company/' + company + '/ticket')
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getNinja(page);
          } else {
            showNinja(text);
          }
        }.bind(this));
      }.bind(this));
    }
  },

  createTicket: function (ticket) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();

    request
    .post('/company/' + company + '/ticket.json')
    .accept('application/json')
    .set('Authorization', token)
    .send({department_id: ticket.department, priority_id: ticket.priority, type_id: ticket.type, subject: ticket.subject, content: ticket.content, hostname: ticket.hostname})
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.createTicket(ticket);
        } else {
          routes.redirectNinja();
        }
      }.bind(this));
    }.bind(this));
  },

  replyTicket: function (id, content) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();

    request
    .post('/company/' + company + '/ticket/' + id + '/reply.json')
    .accept('application/json')
    .set('Authorization', token)
    .send({content: content})
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.replyTicket(ticket);
        } else {
          this.getTicket(id);
        }
      }.bind(this));
    }.bind(this));
  },

  getTicket: function (ticketId) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    request
    .get('/company/' + company + '/ticket/' + ticketId)
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getTicket();
        } else {
          showTicket(text);
        }
      }.bind(this));
    }.bind(this));
  },

  getMonitored: function (instanceId) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();

    request
    .post('/order.json')
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .send({instance_id: instanceId, product_type_id: 2})
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getMonitored(instanceId);
        } else {
          this.getInfrastructureOverview();
          this.getInfrastructureOnPremise();
          this.getInfrastructurePrivateCloud();
          this.getInfrastructurePublicCloud();
        }
      }.bind(this));
    }.bind(this));
  },

  getManaged: function (instanceId) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();

    request
    .post('/order.json')
    .set('Accept', 'aplication/json')
    .set('Authorization', token)
    .send({instance_id: instanceId, product_type_id: 1})
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getMonitored(instanceId);
        } else {
          this.getInfrastructureOverview();
          this.getInfrastructureOnPremise();
          this.getInfrastructurePrivateCloud();
          this.getInfrastructurePublicCloud();
        }
      }.bind(this));
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
