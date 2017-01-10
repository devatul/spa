var React                 = require('react');
var Router                = require('../router');
var redirect              = require('../actions/RouteActions').redirect;
var SessionStore          = require('../stores/SessionStore');

module.exports = React.createClass({

  _onClickInfrastructure: function () {
    redirect('infrastructure');
  },

  _onClickDashboard: function () {
    redirect('dashboard');
  },

  _onClickAlerts: function () {
    redirect('alerts');
  },

  _onClickPerformance: function () {
    redirect('performance');
  },

  _onClickNinja: function () {
    redirect('ninja');
  },

  render: function () {
    var url    = window.location.href;
    var login  = url.search('login');
    var signup = url.search('signup');
    var forgot = url.search('forgot');

    if (0 < login || 0 < signup || 0 < forgot) {
      return (<div></div>);
    } else {
      return (

        <div className="side-bar-container" id="sidebar">
          <div className="menu-buttons">
            <div className="menu-button nb-active">
              <a onClick={this._onClickDashboard}>
                <div className="icon nb-dashboard medium"></div>
                <p className="menu-text">Dashboard</p>
              </a>
            </div>
            <div className="menu-button">
              <a onClick={this._onClickInfrastructure}>
                <div className="icon nb-infrastructure medium"></div>
                <p className="menu-text">Infrastructure</p>
              </a>
            </div>
            <div className="menu-button">
              <a onClick={this._onClickAlerts}>
                <div className="icon nb-alert medium"></div>
                <p className="menu-text">Alerts</p>
              </a>
            </div>
            <div className="menu-button hidden">
              <a onClick={this._onClickPerformance}>
                <div className="icon nb-performance medium"></div>
                <p className="menu-text">Performance</p>
              </a>
            </div>
            <div className="menu-button">
              <a onClick={this._onClickNinja}>
                <div className="icon nb-ninja-support medium"></div>
                <p className="menu-text">Ninja Support</p>
              </a>
            </div>
          </div>
          <div className="social-links">
            <div className="menu-button hidden">
              <div className="icon nb-feedback medium"></div>
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
                    <i className="fa fa-facebook-square social-icon icon-margin" aria-hidden="true"></i>
                  </a>
                </span>
                <span>
                  <a href="" target="_blank">
                    <i className="fa fa-twitter social-icon icon-margin" aria-hidden="true"></i>
                  </a>
                </span>
                <span>
                  <a href="" target="_blank">
                    <i className="fa fa-youtube-play social-icon icon-margin" aria-hidden="true"></i>
                  </a>
                </span>
              </p>
            </div>
          </div>
        </div>
      );
    }   
  },
});
