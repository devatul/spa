var React                 = require('react');
var AlertsStore           = require('../stores/AlertsStore');
var RouteStore            = require('../stores/RouteStore');
var Link                  = require('react-router').Link;
var getStats              = require('../actions/RequestActions').getStats;
var redirect              = require('../actions/RouteActions').redirect;

module.exports = React.createClass({

  getInitialState: function () {
    var stats       = AlertsStore.getDashboardStats();
    var url = window.location.href;
    if (0 <= url.search('infrastructure')) {
      return {
        stats: stats,
        infrastructureClass: 'nb-active',
        dashboardClass: '',
        alertsClass: '',
        performanceClass: '',
        ninjaSupportClass: '',
      };
    }
    if (0 <= url.search('ticket')) {
      return {
        stats: stats,
        infrastructureClass: '',
        dashboardClass: '',
        alertsClass: '',
        performanceClass: '',
        ninjaSupportClass: 'nb-active',
      };
    }
    if (0 <= url.search('ninja-support')) {
      return {
        stats: stats,
        infrastructureClass: '',
        dashboardClass: '',
        alertsClass: '',
        performanceClass: '',
        ninjaSupportClass: 'nb-active',
      };
    }
    if (0 <= url.search('alerts')) {
      return {
        stats: stats,
        infrastructureClass: '',
        dashboardClass: '',
        alertsClass: 'nb-active',
        performanceClass: '',
        ninjaSupportClass: '',
      };
    }

    return {
      stats: stats,
      dashboardClass: 'nb-active',
      infrastructureClass: '',
      alertsClass: '',
      performanceClass: '',
      ninjaSupportClass: '',
    };
  },

  componentDidMount: function () {
    getStats();
    AlertsStore.addChangeListener(this._onChange);
    RouteStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AlertsStore.removeChangeListener(this._onChange);
    RouteStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    var url = window.location.href;
    if (0 <= url.search('infrastructure')) {
      this.setState({
        infrastructureClass: 'nb-active',
        dashboardClass: '',
        alertsClass: '',
        performanceClass: '',
        ninjaSupportClass: '',
      });
    }
    if (0 <= url.search('ticket')) {
      this.setState({
        infrastructureClass: '',
        dashboardClass: '',
        alertsClass: '',
        performanceClass: '',
        ninjaSupportClass: 'nb-active',
      });
    }
    if (this.isMounted()) {
      var stats      = AlertsStore.getDashboardStats();
      this.setState({
        stats: stats,
      });
    }
  },

  _dashboard: function () {
    redirect('dashboard');
    this.setState({
      dashboardClass: 'nb-active',
      infrastructureClass: '',
      alertsClass: '',
      performanceClass: '',
      ninjaSupportClass: '',
    });
  },

  _alerts: function () {
    redirect('alerts');
    this.setState({
      alertsClass: 'nb-active',
      dashboardClass: '',
      infrastructureClass: '',
      performanceClass: '',
      ninjaSupportClass: '',
    });
  },

  _infrastructure: function () {
    redirect('infrastructure');
    this.setState({
      infrastructureClass: 'nb-active',
      dashboardClass: '',
      alertsClass: '',
      performanceClass: '',
      ninjaSupportClass: '',
    });
  },

  _performance: function () {
    redirect('performance');
    this.setState({
      performanceClass: 'nb-active',
      dashboardClass: '',
      infrastructureClass: '',
      alertsClass: '',
      ninjaSupportClass: '',
    });
  },

  _ninjaSupport: function () {
    redirect('ninja');
    this.setState({
      ninjaSupportClass: 'nb-active',
      dashboardClass: '',
      infrastructureClass: '',
      alertsClass: '',
      performanceClass: '',
    });
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

    if ('' !== stats) {
      info = parseInt(stats.info);
      warning = parseInt(stats.warning);
      critical = parseInt(stats.critical);
      statsNumber = info + warning + critical;
      if (1 <= statsNumber) {
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
            <a onClick={this._dashboard} className={this.state.dashboardClass}>
              <div className="menu-button">
                <div className="icon nb-dashboard medium"></div>
                <p className="menu-text">Dashboard</p>
              </div>
            </a>
            <a onClick={this._infrastructure} className={this.state.infrastructureClass}>
              <div className="menu-button">
                <div className="icon nb-infrastructure medium"></div>
                <p className="menu-text">Infrastructure</p>
              </div>
            </a>
            <a onClick={this._alerts} className={this.state.alertsClass}>
              <div className="menu-button">
                <div className="icon nb-alert medium">
                  {alertBadge}
                </div>
                <p className="menu-text">Alerts</p>
              </div>
            </a>
            <a onClick={this._performance} className={this.state.performanceClass}>
              <div className="menu-button hidden">
                <div className="icon nb-performance medium"></div>
                <p className="menu-text">Performance</p>
              </div>
            </a>
            <a onClick={this._ninjaSupport} className={this.state.ninjaSupportClass}>
              <div className="menu-button">
                <div className="icon nb-ninja-support medium"></div>
                <p className="menu-text">Support</p>
              </div>
            </a>
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
