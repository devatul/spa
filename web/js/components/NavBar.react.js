var React                 = require('react');
var Router                = require('../router');
var logOutAction          = require('../actions/ServerActions').logOut;
var goBackToAdmin         = require('../actions/ServerActions').goBackToAdmin;
var redirect              = require('../actions/RouteActions').redirect;
var SessionStore          = require('../stores/SessionStore');
var RouteStore            = require('../stores/RouteStore');
var MyAccountSection      = require('./My_account_section.react');
var BillingHistorySection = require('./Billing_history_section.react');
var PaymentMethodSection  = require('./Payment_method_section.react');
var MyTeamSection         = require('./My_team_section.react');
var CompanySection        = require('./Company_section.react');
var AccountStatusSection  = require('./Account_status_section.react');
var Tooltip               = require('react-bootstrap').Tooltip;
var OverlayTrigger        = require('react-bootstrap').OverlayTrigger;
var getCompanyInfo        = require('../actions/RequestActions').getCompanyInfo;
var getTimezone           = require('../actions/RequestActions').getTimezone;
var getLocales            = require('../actions/RequestActions').getLocales;

var NavBar = React.createClass({

  getInitialState: function () {
    var companyInfo = SessionStore.getCompanyInfo();
    return {
      isLoggedIn:  SessionStore.isLoggedIn(),
      companyInfo: companyInfo,
    };
  },

  componentDidMount: function () {
    SessionStore.addChangeListener(this._onChange);
    RouteStore.addChangeListener(this._onChange);
    $('.nav a').on('click', function () {
      $('.btn-navbar').click();
      $('.navbar-toggle').click();
    });
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
    RouteStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var companyInfo = SessionStore.getCompanyInfo();
      this.setState({
        isLoggedIn:  SessionStore.isLoggedIn(),
        companyInfo: companyInfo,
      });
    }
  },

  _openAccount: function () {
    getTimezone();
    getLocales();
    getCompanyInfo();
  },

  _onClickLogOut: function () {
    this.setState({
      mail:       '',
      isLoggedIn: '',
    });

    logOutAction();
  },

  _redirectOnboarding: function () {
    redirect('onboarding');
  },

  _openBilling: function () {
    $('#myModal').modal('show');
    $('#myModal').on('shown.bs.modal', function (e) {
    });
  },

  _profileButton: function () {
    localStorage.setItem('landing', true);
    redirect('landing');
  },

  _redirectLogin: function () {
    redirect('login');
  },

  _redirectSignUp: function () {
    redirect('signup');
  },

  _redirectHome: function () {
    redirect('home');
  },

  _onClickGoBackToAdmin: function (argument) {
    goBackToAdmin();
  },

  onSelected: function (e) {
    // doesn't need to have functionality
  },

  render: function () {
    var url       = window.location.href;
    var login     = url.search('login');
    var signup    = url.search('signup');
    var forgot    = url.search('forgot');

    var integrations = (<Tooltip id="tooltip">Integrations</Tooltip>);
    var configure = (<Tooltip id="tooltip">My account</Tooltip>);
    var logout = (<Tooltip id="tooltip">Log out</Tooltip>);
    var switchUser = (<Tooltip id="tooltip">Go back to admin</Tooltip>);

    if (0 < login || 0 < signup || 0 < forgot || !SessionStore.isLoggedIn()) {
      return (
        <div></div>
      );
    } else if (false == this.state.isLoggedIn) {
      return (
        <nav className="navbar navbar-default nav navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <img src="./images/nubity-logo-hd-W.png" alt="Nubity" title="Nubity" className="nav-brand" />
            </div>
            <div>
              <ul className="nav navbar-nav navbar-right">
                <li className="up-li">
                  <div className="top-div-navbar">
                    <button className="go-to-signup" onClick={this._redirectLogin}>Log in</button>
                    <button className="go-to-signup" onClick={this._redirectSignUp}>Sign Up</button>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </nav>
      );
    } else {
      return (
        <nav className="navbar navbar-default nav navbar-fixed-top">
          <div className="container-fluid">
            <div className="navbar-header">
              <a onClick={this._redirectHome}>
                <img src="./images/nubity-logo-hd-W.png" alt="Nubity" title="Nubity" className="nav-brand" />
                <span className="navbar-company-name">{this.state.companyInfo.name}</span>
              </a>
            </div>
            <div>
              <ul className="nav navbar-nav navbar-right">
                <li className="up-li">
                  <OverlayTrigger placement="bottom" overlay={integrations}>
                    <a className="onboarding-button" onClick={this._redirectOnboarding}>
                      <i className="icon nb-connection-circle"></i>
                      <span className="notification-badge">+</span>
                    </a>
                  </OverlayTrigger>
                </li>
                <li className={'true' == localStorage.getItem('switching-user') ? 'up-li last' : 'hidden'} >
                  <OverlayTrigger placement="bottom" overlay={switchUser}>
                    <a className="onboarding-button" onClick={this._onClickGoBackToAdmin}>
                      <i className="icon nb-logout-circle"></i>
                    </a>
                  </OverlayTrigger>
                </li>
                <li className="up-li">
                  <OverlayTrigger placement="bottom" overlay={configure}>
                    <a className="onboarding-button" onClick={this._openAccount} data-toggle="modal" data-target="#myModal">
                      <i className="icon nb-config-circle"></i>
                    </a>
                  </OverlayTrigger>
                </li>
                <li className="up-li last">
                  <OverlayTrigger placement="bottom" overlay={logout}>
                    <a className="onboarding-button" onClick={this._onClickLogOut}>
                      <i className="icon nb-logout-circle"></i>
                    </a>
                  </OverlayTrigger>
                </li>
              </ul>
            </div>
          </div>
          <div className="modal fade" tabIndex="-1" id="myModal" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-body">
                  <button type="button" className="modal-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                  <div role="navigation" className="modal-title">
                    <ul className="nav nav-tabs section-tabs">
                      <li role="presentation" className="active tab-link" >
                        <a className="grey-color" data-toggle="tab" href="#myAccount">
                          <i className="icon nb-config small"></i> My Account
                        </a>
                      </li>
                      <li role="presentation" className="tab-link">
                        <a className="grey-color" data-toggle="tab" href="#company">
                          <i className="icon nb-company small"></i> Comany
                        </a>
                      </li>
                      <li role="presentation" className="tab-link hidden">
                        <a className="grey-color" data-toggle="tab" href="#myTeam">
                          <i className="icon nb-team small"></i> My Team
                        </a>
                      </li>
                      <li role="presentation" className="tab-link hidden">
                        <a className="grey-color" data-toggle="tab" href="#accountStatus">
                          <i className="icon nb-billing small" aria-hidden="true"></i> Account Status
                        </a>
                      </li>
                      <li role="presentation" className="tab-link hidden">
                        <a className="grey-color" data-toggle="tab" href="#billingHistory">
                          <i className="icon nb-billing small" aria-hidden="true"></i> Billing History
                        </a>
                      </li>
                      <li role="presentation" className="tab-link hidden">
                        <a className="grey-color" data-toggle="tab" href="#paymentMethod">
                          <i className="icon nb-billing small" aria-hidden="true"></i> Payment Method
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content section-content menu-tab-content">
                    <div id="myAccount" className="tab-pane fade in active">
                      <MyAccountSection />
                    </div>
                    <div id="billingHistory" className="tab-pane fade">
                      <BillingHistorySection />
                    </div>
                    <div id="paymentMethod" className="tab-pane fade">
                      <PaymentMethodSection />
                    </div>
                    <div id="company" className="tab-pane fade">
                      <CompanySection />
                    </div>
                    <div id="myTeam" className="tab-pane fade">
                      <MyTeamSection />
                    </div>
                    <div id="accountStatus" className="tab-pane fade">
                      <AccountStatusSection />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      );
    }
  },
});

module.exports = NavBar;
