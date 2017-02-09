var React                 = require('react');
var AlertsStore           = require('../stores/AlertsStore');
var Link                  = require('react-router').Link;
var getStats              = require('../actions/RequestActions').getStats;

module.exports = React.createClass({

  getInitialState: function() {
    var stats      = AlertsStore.getDashboardStats();
    return {
      stats: stats,
    }
  },

  componentDidMount: function() {
    getStats();
    AlertsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AlertsStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    if (this.isMounted()) {
      var stats      = AlertsStore.getDashboardStats();
      this.setState({
        stats: stats,
      });
    }
  },

  render: function () {
    var url    = window.location.href;
    var login  = url.search('login');
    var signup = url.search('signup');
    var forgot = url.search('forgot');

    var stats = this.state.stats;
    var info;
    var warning;
    var critical;
    var statsNumber;
    var alertBadge;

    if ("" !== stats) {
      info = parseInt(stats.info);
      warning = parseInt(stats.warning);
      critical = parseInt(stats.critical);
      statsNumber = info + warning + critical;
      if (statsNumber >= 1) {
        alertBadge = (<span className="alert-badge">{statsNumber}</span>);
      } else {
        alertBadge = '';
      }
    } else {
      alertBadge = '';
    }

    if (0 < login || 0 < signup || 0 < forgot) {
      return (<div></div>);
    } else {
      return (

        <div className="side-bar-container" id="sidebar">
          <div className="menu-buttons">
            <Link to="/dashboard" activeClassName="nb-active">
              <div className="menu-button">
                <div className="icon nb-dashboard medium"></div>
                <p className="menu-text">Dashboard</p>
              </div>
            </Link>
            <Link to="/infrastructure" activeClassName="nb-active">
              <div className="menu-button">
                <div className="icon nb-infrastructure medium"></div>
                <p className="menu-text">Infrastructure</p>
              </div>
            </Link>
            <Link to="/alerts" activeClassName="nb-active">
              <div className="menu-button">
                <div className="icon nb-alert medium">
                  {alertBadge}
                </div>
                <p className="menu-text">Alerts</p>
              </div>
            </Link>
            <Link to="/performance" activeClassName="nb-active">
              <div className="menu-button hidden">
                <div className="icon nb-performance medium"></div>
                <p className="menu-text">Performance</p>
              </div>
            </Link>
            <Link to="/ninja-support" activeClassName="nb-active">
              <div className="menu-button">
                <div className="icon nb-ninja-support medium"></div>
                <p className="menu-text">Ninja Support</p>
              </div>
            </Link>
          </div>
          <div className="social-links">
            <div className="menu-button hide-it">
              <div className="icon nb-feedback medium"></div>
              <p className="menu-text">Feedback</p>
            </div>
            <div className="">
              <p>
                <span>
                  <a href="https://github.com/nubity" target="_blank">
                    <i className="fa fa-github social-icon icon-margin" aria-hidden="true"></i>
                  </a>
                </span>
                <span>
                  <a href="https://www.linkedin.com/company/nubity" target="_blank">
                    <i className="fa fa-linkedin-square social-icon icon-margin" aria-hidden="true">
                    </i>
                  </a>
                </span>
                <span>
                  <a href="https://plus.google.com/+Nubitycloud" target="_blank">
                    <i className="fa fa-google-plus social-icon icon-margin" aria-hidden="true">
                    </i>
                  </a>
                </span>
              </p>
              <p>
                <span>
                  <a href="https://www.facebook.com/Nubity" target="_blank">
                    <i className="fa fa-facebook-square social-icon icon-margin" aria-hidden="true"></i>
                  </a>
                </span>
                <span>
                  <a href="https://twitter.com/nubity" target="_blank">
                    <i className="fa fa-twitter social-icon icon-margin" aria-hidden="true"></i>
                  </a>
                </span>
                <span>
                  <a href="https://www.youtube.com/user/NubityCloud" target="_blank">
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
