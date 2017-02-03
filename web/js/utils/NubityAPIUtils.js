var request                        = require('superagent-use')(require('superagent'));
var prefix                         = require('superagent-prefix');
var Constants                      = require('../constants/Constants');
var SessionStore                   = require('../stores/SessionStore');
var loginError                     = require('../actions/ServerActions').loginError;
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
var showInstanceForMonitoring      = require('../actions/ServerActions').showInstanceForMonitoring;
var showInstanceConfiguration      = require('../actions/ServerActions').showInstanceConfiguration;
var showTicket                     = require('../actions/ServerActions').showTicket;
var showCompany                    = require('../actions/ServerActions').showCompany;
var showCustomDashboards           = require('../actions/ServerActions').showCustomDashboards;
var showCustomSlots                = require('../actions/ServerActions').showCustomSlots;
var APIEndpoints                   = Constants.APIEndpoints;
var routes                         = require('./RouteUtils');
var _                              = require('lodash');

request.use(prefix(APIEndpoints.PUBLIC));

module.exports = {
  fromLogin: false,
  isTokenValidating: false,
  validateToken: function (res) {
    var _SELF = this;
    var interval = false;
    var code = JSON.parse(res.status);
    return new Promise( function ( resolve, reject ) {
      if (401 === code && _SELF.hasToRefresh()) {
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
      } else if (300 <= code && 401 >= code) {
        _SELF.saveURI();
        routes.redirectLogin();
      } else if (200 <= code && 300 > code) {
        resolve(true);
      } else {
        var text = JSON.parse(res.text);
        var err = [];
        _.map(text.messages, function (errMag, i) {
          err = parseInt(i+1) + '. ' + errMag + '\n';
        });
        var message = 'Error ['+ code +'] : \n' + err;
        if (window.console) {
          console.error(message);
        }
        alert(message);
      }
    });
  },

  saveURI: function () {
    var uri = localStorage.getItem('nubity-uri');
    var path = window.location.href;
    var route = path.split('/#/')[1];
    if (null == uri
      && 'login' !== route
      && 'signup' !== route
      && 'forgot-password' !== route
      && 'terms-and-conditions' !== route
      && 'privacy-policies' !== route) {
      localStorage.setItem('nubity-uri', path);
    }
  },

  login: function (user) {
    request
      .post('/login.json')
      .send({_username: user.email, _password: user.password})
      .accept('application/json')
      .end(function (res) {
        var text = JSON.parse(res.text);
        var code = JSON.parse(res.status);
        if (300 <= code) {
          loginError('Bad credentials');
        } else {
          SessionStore.resetLoginError();
          localStorage.setItem('nubity-token', text.token);
          localStorage.setItem('nubity-refresh-token', text.refresh_token);
          this.fromLogin = true;
          this.getUser();
        }
      }.bind(this));
  },

  signup: function (user) {
    return new Promise( function ( resolve, reject ) {
      request
        .post('/signup.json')
        .send({firstname: user.firstname, lastname: user.lastname, email: user.email,  password: user.password, password_confirmation: user.password2, phone: user.phone, company_name: user.company, locale: user.locale})
        .accept('application/json')
        .end(function (res) {
          var text = JSON.parse(res.text);
          var code = JSON.parse(res.status);
          if (200 <= code && 300 > code) {
            showSignupMessage(text.message);
            resolve();
          } else {
            reject(text);
          }
        }.bind(this));
    });
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
          showConfirmMessage(200, 'Salio todo bien');
        }
      }.bind(this));
  },

  forgotPassword: function (email) {
    return new Promise( function ( resolve, reject ) {
      request
        .post('/password/request-reset.json')
        .send({_username: email})
        .accept('application/json')
        .end(function (res) {
          var text = JSON.parse(res.text);
          var code = JSON.parse(res.status);
          if (200 === code) {
            resolve('Reset link sent to your email');
          } else {
            reject(text);
          }
        }.bind(this));
    });
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
    return new Promise( function ( resolve, reject ) {
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
            _SELF.saveURI();
            routes.redirectLogin();
          } else if (SessionStore.isLoggedIn()) {
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
            localStorage.setItem('nubity-notification-level', text.notification_severity_level[0].name);

            if (this.fromLogin) {
              this.fromLogin = false;
              var uri = localStorage.getItem('nubity-uri');
              if (null !== uri) {
                localStorage.removeItem('nubity-uri');
                var to = uri.split('/#/')[1];
                to = to.split('#')[0];
                routes.redirectTo(to);
                window.location.href = uri;
              } else {
                routes.redirectDashboard();
              }
            }
          }
        }.bind(this));
      }.bind(this));
  },

  getUserForSwitchUser: function () {
    var token = this.getToken();
    request
      .get('/user.json')
      .accept('application/json')
      .set('Authorization', token)
      .end(function (res) {
        var text = JSON.parse(res.text);
        this.validateToken(res).then(function (status) {
          if (!status) {
            this.getUserForSwitchUser();
          } else {
            localStorage.setItem('nubity-company', text.company);
            localStorage.setItem('nubity-firstname', text.firstname);
            localStorage.setItem('nubity-lastname', text.lastname);
            localStorage.setItem('nubity-user-id', text.user);
            localStorage.setItem('nubity-user-email', text.username);
            localStorage.setItem('nubity-user-avatar', text.public_path);
            localStorage.setItem('nubity-user-language', text.locale_display_name);
            localStorage.setItem('nubity-notification-level', text.notification_severity_level[0].name);

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
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getCompanyInfo();
        } else {
          showCompany(text);
          this.getUser();
        }
      }.bind(this));
    }.bind(this));
  },

  getDashboardSlots: function (id) {
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
            if ('dashboard' == text.member[key].scope) {
              localStorage.setItem('dashboardId', text.member[key].dashboard);
              this.getDashboardSlots(text.member[key].dashboard);
            }
          }
        }
      }.bind(this));
    }.bind(this));
  },

  getAvailableGraphTypes: function (id) {
    var token   = this.getToken();

    request
    .get('/instance/' + id + '/graph.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getDashboard();
        } else {
          showAvailableGraphTypes(text);
        }
      }.bind(this));
    }.bind(this));
  },

  createGraph: function (widget, instance, chart, dashboardId, position) {
    var token   = this.getToken();
    request
    .post('/slot.json')
    .accept('application/json')
    .set('Authorization', token)
    .send({instance_id: instance, graph_id: chart, type: 'graph', dashboard_id: dashboardId, position: position, custom_interval: 'TODAY'})
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.createGraph(widget, instance, chart, dashboardId, position);
        } else {
          this.getDashboards();
        }
      }.bind(this));
    }.bind(this));
  },

  deleteSlot: function (slot) {
    var token   = this.getToken();
    request
    .del('/slot/' + slot + '.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (err, res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.deleteSlot(slot);
        } else {
          this.getDashboards();
          this.getCustomDashboards();
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
      .query({page: page, include_health: true, include_products: true})
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
      .query({include_health: true, include_products: true})
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
      .query({provider_classification: 'public', page: page, include_health: true, include_products: true})
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
      .query({provider_classification: 'public', include_health: true, include_products: true})
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
      .query({provider_classification: 'private', page: page, include_health: true, include_products: true})
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
      .query({provider_classification: 'private', include_health: true, include_products: true})
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
      .query({provider_classification: 'on-premise', page: page, include_health: true, include_products: true})
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
      .query({provider_classification: 'on-premise', include_health: true, include_products: true})
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

  createDasboard: function (widget, server, chart) {
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
          this.replyTicket(id, content);
        } else {
          this.getTicket(id);
        }
      }.bind(this));
    }.bind(this));
  },

  closeTicket: function (id) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();

    request
    .put('/company/' + company + '/ticket/' + id + '/close.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.closeTicket(id);
        } else {
          routes.redirectNinja();
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
          this.getTicket(ticketId);
        } else {
          showTicket(text);
        }
      }.bind(this));
    }.bind(this));
  },

  getMonitored: function (instanceId) {
    var token   = this.getToken();

    request
    .post('/order.json')
    .accept('application/json')
    .set('Authorization', token)
    .send({instance_id: instanceId, product_type_id: 2})
    .end(function (res) {
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
    var token   = this.getToken();

    request
    .post('/order.json')
    .accept('application/json')
    .set('Authorization', token)
    .send({instance_id: instanceId, product_type_id: 1})
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getManaged(instanceId);
        } else {
          this.getInfrastructureOverview();
          this.getInfrastructureOnPremise();
          this.getInfrastructurePrivateCloud();
          this.getInfrastructurePublicCloud();
        }
      }.bind(this));
    }.bind(this));
  },

  stopOrder: function (orderId) {
    var token   = this.getToken();

    request
    .del('/order/' + orderId + '.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.stopOrder(orderId);
        } else {
          this.getInfrastructureOverview();
          this.getInfrastructureOnPremise();
          this.getInfrastructurePrivateCloud();
          this.getInfrastructurePublicCloud();
        }
      }.bind(this));
    }.bind(this));
  },

  stopInstance: function (instanceId) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    request
    .put('/company/' + company + '/instance/' + instanceId + '/stop.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.startInstance(instanceId);
        } else {
          this.getInfrastructureOverview();
          this.getInfrastructureOnPremise();
          this.getInfrastructurePrivateCloud();
          this.getInfrastructurePublicCloud();
        }
      }.bind(this));
    }.bind(this));
  },

  startInstance: function (instanceId) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();

    request
    .put('/company/' + company + '/instance/' + instanceId + '/start.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.restartInstance(instanceId);
        } else {
          this.getInfrastructureOverview();
          this.getInfrastructureOnPremise();
          this.getInfrastructurePrivateCloud();
          this.getInfrastructurePublicCloud();
        }
      }.bind(this));
    }.bind(this));
  },

  restartInstance: function (instanceId) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();

    request
    .put('/company/' + company + '/instance/' + instanceId + '/reboot.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.stopInstance(instanceId);
        } else {
          this.getInfrastructureOverview();
          this.getInfrastructureOnPremise();
          this.getInfrastructurePrivateCloud();
          this.getInfrastructurePublicCloud();
        }
      }.bind(this));
    }.bind(this));
  },

  deleteOrderCancelation: function (orderId) {
    var token   = this.getToken();

    request
    .del('/order/' + orderId + '/cancellation-request.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.deleteOrderCancelation(orderId);
        } else {
          this.getInfrastructureOverview();
          this.getInfrastructureOnPremise();
          this.getInfrastructurePrivateCloud();
          this.getInfrastructurePublicCloud();
        }
      }.bind(this));
    }.bind(this));
  },

  submitCloudData: function (cloudData) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var _SELF = this;

    return new Promise( function ( resolve, reject ) {
      request
      .post('/company/'+company+'/cloud.json')
      .type('form')
      .set('Authorization', token)
      .send(cloudData)
      .end(function (res) {
        var text = JSON.parse(res.text);
        _SELF.validateToken(res).then(function (status) {
          if (!status) {
            _SELF.submitCloudData(cloudData);
          } else {
            resolve();
          }
        }.bind(_SELF));
      }.bind(_SELF));
    });
  },

  getInstanceForMonitoring: function (id) {
    var token   = this.getToken();
    var company = localStorage.getItem('nubity-company');
    request
    .get('/company/' + company + '/instance/' + id + '.json')
    .query({include_products: true})
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getInstanceForMonitoring(id);
        } else {
          var url = window.location.href;
          if (-1 != url.indexOf('monitoring')) {
            showInstanceForMonitoring(text);
          }
        }
      }.bind(this));
    }.bind(this));
  },

  getInstanceConfiguration: function (id) {
    var token = this.getToken();
    request
    .get('/instance/' + id + '/monitoring/configuration.json')
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getInstanceConfiguration(id);
        } else {
          showInstanceConfiguration(text);
        }
      }.bind(this));
    }.bind(this));
  },

  configureTemplate: function (id, macros, templateId) {
    var token   = this.getToken();

    request
    .put('/instance/' + id + '/monitoring/configuere-template.json')
    .accept('application/json')
    .send({user_macros: macros, template_id: templateId})
    .set('Authorization', token)
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.configureTemplate(id, macros);
        } else {
          this.getInstanceConfiguration(id);
        }
      }.bind(this));
    }.bind(this));
  },

  uninstallPlugin: function (idPlugin, id) {
    var token   = this.getToken();

    request
    .del('/instance/' + id + '/monitoring/uninstall-template.json')
    .send({template_id: idPlugin})
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.uninstallPlugin(idPlugin, id);
        } else {
          this.getInstanceConfiguration(id);
        }
      }.bind(this));
    }.bind(this));
  },

  installPlugin: function (idPlugin, id) {
    var token   = this.getToken();

    request
    .post('/instance/' + id + '/monitoring/install-template.json')
    .send({template_id: idPlugin})
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.installPlugin(idPlugin, id);
        } else {
          this.getInstanceConfiguration(id);
        }
      }.bind(this));
    }.bind(this));
  },

  createCustomDashboard: function (title, icon) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');

    request
    .post('/dashboard') 
    .accept('application/json')
    .set('Authorization', token)
    .send({user_id: user, company_id: company, scope: 'performance', name: title})
    .end(function (res) {
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.createCustomDashboard(title, icon);
        } else {
          this.getCustomDashboards();
        }
      }.bind(this));
    }.bind(this));
  },

  getCustomDashboards: function () {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');

    request
    .get('/company/' + company + '/user/' + user + '/dashboard')
    .query({scope: 'performance'})
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getCustomDashboards();
        } else {
          showCustomDashboards(text);
        }
      }.bind(this));
    }.bind(this));
  },

  getCustomSlots: function (id) {
    var company = localStorage.getItem('nubity-company');
    var token   = this.getToken();
    var user    = localStorage.getItem('nubity-user-id');

    request
    .get('/slot.json')
    .query({user_id: user, company_id: company, dashboard_id: id, include_content: 1})
    .accept('application/json')
    .set('Authorization', token)
    .end(function (res) {
      var text = JSON.parse(res.text);
      this.validateToken(res).then(function (status) {
        if (!status) {
          this.getCustomSlots(id);
        } else {
          showCustomSlots(text);
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
