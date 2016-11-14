var React                 = require('react');
var Router                = require('../router');
var redirect              = require('../actions/RouteActions').redirect;
var SessionStore          = require('../stores/SessionStore');

module.exports = React.createClass({

  _onClickInfrastructure: function() {
    redirect('infrastructure');
  },

  _onClickDashboard: function() {
    redirect('dashboard');
  },

  _onClickAlerts: function() {
    redirect('alerts');
  },

  _onClickPerformance: function() {
    redirect('performance');
  },

  _onClickNinja: function() {
    redirect('ninja');
  },

  render: function() {
    var url = window.location.href;
    var login = url.search("login");
    var signup = url.search("signup");
    if (login > 0 || signup > 0) {
      return (<div></div>);
    } else {
      return (
        <div className="side-bar-container" id="sidebar">
          <div className="menu-buttons">
            <div className="menu-button">
              <a onClick={this._onClickDashboard}>
                <i className="fa fa-tachometer menu-icon" aria-hidden="true"></i>
                <p className="menu-text">Dashboard</p>
              </a>
            </div>
            <div className="menu-button">
              <a onClick={this._onClickInfrastructure}>
                <i className="fa fa-cloud menu-icon" aria-hidden="true"></i>
                <p className="menu-text">Infrastructure</p>
              </a>
            </div>
            <div className="menu-button">
              <a onClick={this._onClickAlerts}>
                <i className="fa fa-exclamation-circle menu-icon" aria-hidden="true"></i>
                <p className="menu-text">Alerts</p>
              </a>
            </div>
            <div className="menu-button">
              <a onClick={this._onClickPerformance}>
                <i className="fa fa-line-chart menu-icon" aria-hidden="true"></i>
                <p className="menu-text">Performance</p>
              </a>
            </div>
            <div className="menu-button">
              <a onClick={this._onClickNinja}>
                <i className="fa fa-user menu-icon" aria-hidden="true"></i>
                <p className="menu-text">Ninja Support</p>
              </a>
            </div>
          </div>
          <div className="social-links">
            <div className="menu-button">
              <i className="fa fa-paper-plane-o menu-icon" aria-hidden="true"></i>
              <p className="menu-text">FeedBack</p>
            </div>
            <div className="">
              <p>
                <span>
                  <a href="http://github.com" target="_blank">
                    <i className="fa fa-github social-icon icon-margin" aria-hidden="true"></i>
                  </a>
                </span>
                <span>
                  <a href="" target="_blank">
                    <i className="fa fa-linkedin-square social-icon icon-margin" aria-hidden="true">
                    </i>
                  </a>
                </span>
                <span>
                  <a href="" target="_blank">
                    <i className="fa fa-google-plus social-icon icon-margin" aria-hidden="true">
                    </i>
                  </a>
                </span>
              </p>
              <p>
                <span>
                  <a href="" target="_blank">
                    <i className="fa fa-facebook social-icon icon-margin" aria-hidden="true"></i>
                  </a>
                </span>
                <span>
                  <a href="" target="_blank">
                    <i className="fa fa-twitter social-icon icon-margin" aria-hidden="true"></i>
                  </a>
                </span>
                <span>
                  <a href="" target="_blank">
                    <i className="fa fa-youtube social-icon icon-margin" aria-hidden="true"></i>
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      );
    }   
  }
});
