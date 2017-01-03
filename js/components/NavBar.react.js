var React                 = require('react');
var Router                = require('../router');
var logOutAction          = require('../actions/ServerActions').logOut;
var redirect              = require('../actions/RouteActions').redirect;
var SessionStore          = require('../stores/SessionStore');
var RouteStore            = require('../stores/RouteStore');
var MyAccountSection      = require('./My_account_section.react');
var BillingHistorySection = require('./Billing_history_section.react');
var PaymentMethodSection  = require('./Payment_method_section.react');
var MyTeamSection         = require('./My_team_section.react');
var CompanySection        = require('./Company_section.react');
var AccountStatusSection  = require('./Account_status_section.react');

var NavBar = React.createClass({

  getInitialState: function() {
    return {
      isLoggedIn: '',
    };
  },

  componentDidMount: function() {
    SessionStore.addChangeListener(this._onChange);
    RouteStore.addChangeListener(this._onChange);
    $('.nav a').on('click', function() {
      $(".btn-navbar").click(); 
      $(".navbar-toggle").click(); 
      $(".dropdown-toggle").click();
    });
  },

  componentWillUnmount: function() {
    SessionStore.removeChangeListener(this._onChange);
    RouteStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    if (this.isMounted()) {
      this.setState({
        isLoggedIn: SessionStore.isLoggedIn(),
      });
    }
  },

  _onClickLogOut: function() {
    this.setState({
      mail: '',
      isLoggedIn: '',
    });

    logOutAction();
  },

  _redirectOnboarding: function() {
    redirect('onboarding');
  },

  _openBilling: function() {
    $('#myModal').modal('show');
    $('#myModal').on('shown.bs.modal', function(e) {
    });
  },

  _profileButton: function() {
    localStorage.setItem("landing", true);
    redirect('landing');
  },
  onSelected: function(e) {
    // doesn't need to have functionality
  },

  render: function() {
    var url       = window.location.href;
    var firstname = localStorage.getItem('nubity-firstname');
    var lastname  = localStorage.getItem('nubity-lastname');
    var login     = url.search("login");
    var signup    = url.search("signup");
    var forgot    = url.search("forgot");

    if (0 < login || 0 < signup || 0 < forgot) {
      return (
        <div></div>
      );
    } else {
      return (
        <nav className="navbar navbar-default nav navbar-fixed-top">
          <div className="container-fluid">         
            <div className="navbar-header">
              <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
                <span className="sr-only">Toggle navigation</span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
                <span className="icon-bar"></span>
              </button>
              <img src="./images/nubity-logo-hd.png" alt="Nubity" title="Nubity" className="nav-brand"/>
            </div>
            <div className="collapse navbar-collapse" >
              <ul className="nav navbar-nav navbar-right">
                <li className="up-li">
                  <button className="btn btn-primary notification-button" type="button" onClick={this._redirectOnboarding}>
                    <span className="notification-badge">+</span>
                  </button>
                </li>
                <li className="profile-picture-li">
                  <img src="./images/nubity-logo-hd.png" alt="add photo" title="add photo" className="user-photo img-circle"/>
                </li>
                <li className="dropdown">
                  <a className="dropdown-toggle white-color" data-toggle="dropdown" id="dropdown-nav" role="button" aria-haspopup="true" aria-expanded="false"><span>{firstname}, {lastname}! <b className="caret"></b></span></a>
                  <ul className="dropdown-menu" aria-labelledby="dropdown-nav">
                    <li>
                      <a onClick={this._openAccount} data-toggle="modal" data-target="#myModal">
                        <i className="icon nb-config small"></i> My Account
                      </a>
                    </li>
                    <li>
                      <a onClick={this._openAccount}>
                        <i className="icon nb-company small"></i> Company
                      </a>
                    </li>
                    <li>
                      <a onClick={this._openAccount}>
                        <i className="icon nb-team small"></i> My Team
                      </a>
                    </li>
                    <li>
                      <a onClick={this._openBilling} >
                        <i className="icon nb-billing small"></i> Billing
                      </a>
                    </li>
                    <li>
                      <a onClick={this._onClickLogOut}>
                        <i className="icon nb-logout small"></i> Log Out
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
          <div className="modal fade" tabindex="-1" id="myModal" role="dialog">
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-body">
                  <div role="navigation" className="modal-title">
                    <ul className="nav nav-tabs section-tabs">
                      <li role="presentation" className="active" >
                        <a className="grey-color" data-toggle="tab" href="#myAccount">
                          <i className="icon nb-config"></i> My Account
                        </a>
                      </li>
                      <li role="presentation">
                        <a className="grey-color" data-toggle="tab" href="#company">
                          <i className="fa fa-suitcase"></i> Comany
                        </a>
                      </li>
                      <li role="presentation">
                        <a className="grey-color" data-toggle="tab" href="#myTeam">
                          <i className="fa fa-group"></i> My Team
                        </a>
                      </li>
                      <li role="presentation">
                        <a className="grey-color" data-toggle="tab" href="#accountStatus">
                          <i className="fa fa-credit-card-alt" aria-hidden="true"></i> Account Status
                        </a>
                      </li>
                      <li role="presentation">
                        <a className="grey-color" data-toggle="tab" href="#billingHistory">
                          <i className="fa fa-credit-card-alt" aria-hidden="true"></i> Billing History
                        </a>
                      </li>
                      <li role="presentation">
                        <a className="grey-color" data-toggle="tab" href="#paymentMethod">
                          <i className="fa fa-credit-card-alt" aria-hidden="true"></i> Payment Method
                        </a>
                      </li>
                    </ul>
                  </div>
                  <div className="tab-content section-content menu-tab-content">
                    <div id="myAccount" className="tab-pane fade in active">
                      <MyAccountSection/>
                    </div>
                    <div id="billingHistory" className="tab-pane fade">
                      <BillingHistorySection/>
                    </div>
                    <div id="paymentMethod" className="tab-pane fade">
                      <PaymentMethodSection/>
                    </div>
                    <div id="company" className="tab-pane fade">
                      <CompanySection/>
                    </div>
                    <div id="myTeam" className="tab-pane fade">
                      <MyTeamSection/>
                    </div>
                    <div id="accountStatus" className="tab-pane fade">
                      <AccountStatusSection/>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </nav>
      );
    }
  }
});

module.exports = NavBar;
