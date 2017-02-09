var React                      = require('react');
var Router                     = require('../router');
var moment                     = require("moment");
var redirect                   = require('../actions/RouteActions').redirect;
var GraphStore                 = require('../stores/GraphStore');
var SessionStore               = require('../stores/SessionStore');
var AlertsStore                = require('../stores/AlertsStore');
var getDashboardAlerts         = require('../actions/RequestActions').getDashboardAlerts;
var getDashboards              = require('../actions/RequestActions').getDashboards;
var getDashboard               = require('../actions/RequestActions').getDashboard;
var getStats                   = require('../actions/RequestActions').getStats;
var Graphs                     = require('./Graphs.react');
var Preloader                  = require('./Preloader.react');
var Warning                    = require('./Warning_message.react');
var createAlertTicket          = require('../actions/ServerActions').createAlertTicket;
var acknowledge                = require('../actions/RequestActions').acknowledge;
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;
var getCompanyInfo             = require('../actions/RequestActions').getCompanyInfo;

module.exports = React.createClass({

  getInitialState: function() {
    var mainAlerts = AlertsStore.getDashboardAlerts();
    var dashboards = GraphStore.getDashboards();
    var dashboard  = GraphStore.getDashboard();
    var stats      = AlertsStore.getDashboardStats();
    var companyInfo = SessionStore.getCompanyInfo();
    return {
      mainAlerts: mainAlerts.member,
      dashboards: '',
      dashboard: '',
      stats: stats,
      companyInfo: companyInfo,
    };
  },

  componentDidMount: function() {
    getCompanyInfo();
    getDashboardAlerts();
    getDashboards();
    getStats();
    AlertsStore.addChangeListener(this._onChange);
    GraphStore.addChangeListener(this._onChange);
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AlertsStore.removeChangeListener(this._onChange);
    GraphStore.removeChangeListener(this._onChange);
    SessionStore.addChangeListener(this._onChange);
  },

  _onChange: function() {
    if (this.isMounted()) {
      var mainAlerts = AlertsStore.getDashboardAlerts();
      var dashboards = GraphStore.getDashboards();
      var dashboard  = GraphStore.getDashboard();
      var stats      = AlertsStore.getDashboardStats();
      var companyInfo = SessionStore.getCompanyInfo();
      this.setState({
        mainAlerts: mainAlerts.member,
        dashboards: dashboards,
        dashboard: dashboard,
        stats: stats,
        companyInfo: companyInfo,
      });

      if (AlertsStore.isAlertTicket()) {
        redirect('create_ticket');
      }
    }
  },

  _goToAlerts: function() {
    redirect('alerts');
  },

  _createTicket: function (alert) {
    createAlertTicket(alert);
  },

  _acknowledge: function (alertId) {
    acknowledge(alertId);
  },

  render: function() {
    var companyInfo = this.state.companyInfo;
    var dashboard = this.state.dashboard;
    var firstname = localStorage.getItem('nubity-firstname');
    var mainAlerts = this.state.mainAlerts;
    var notice;
    var tooltip = '';
    var companyName = companyInfo.name;

    if (undefined !== mainAlerts) {
      if (mainAlerts.length > 1) {
        notice = <p className="margin-sides right-aligned">These are only {mainAlerts.length} alerts that needs your attention. For more alerts click <a onClick={this._goToAlerts}>here</a></p>;
      } else if (mainAlerts.length == 1) {
        notice = <p className="margin-sides right-aligned">There is only {mainAlerts.length} alert that needs your attention. Go to <a onClick={this._goToAlerts}>Alerts</a></p>;
      } else {
        notice = <p className="margin-sides right-aligned">There are no alerts that needs your attention right now.</p>;
      }
    }

    var stats = '';
    if (undefined !== this.state.stats && mainAlerts) {
      var stats = (
        <div className="col-md-6 col-md-offset-3">
          <div className="col-xs-4 dashboard-icons blue">
            <i className="icon nb-information blue-text dashboard-minus" aria-hidden="true"></i>
            <span className="dashboard-icons-info">Information</span>
            <div className="dashboard-icons-counter first">{this.state.stats.info}</div>
          </div>
          <div className="col-xs-4 dashboard-icons">
            <i className="icon nb-warning yellow-text dashboard-minus" aria-hidden="true"></i>
            <span className="dashboard-icons-info">Warning</span>
            <div className="dashboard-icons-counter second">{this.state.stats.warning}</div>
          </div>
          <div className="col-xs-4 dashboard-icons">
            <i className="icon nb-critical red-text dashboard-minus" aria-hidden="true"></i>
            <span className="dashboard-icons-info">Critical</span>
            <div className="dashboard-icons-counter third">{this.state.stats.critical}</div>
          </div>
        </div>
      );
    }

    var rows = [];
    for (var key in mainAlerts) {
      var level = '';
      var state = '';
      var severityTooltip = '';
      if ('critical' == mainAlerts[key].level) {
        level = 'icon nb-critical icon-state red-text';
        severityTooltip = (<Tooltip id="tooltip">Critical</Tooltip>);
      } else if ('warning' == mainAlerts[key].level) {
        level = 'icon nb-warning icon-state yellow-text';
        severityTooltip = (<Tooltip id="tooltip">Warning</Tooltip>);
      } else if ('info' == mainAlerts[key].level) {
        level = 'icon nb-information icon-state blue-text';
        severityTooltip = (<Tooltip id="tooltip">Information</Tooltip>);
      }

      state = '';
      action = '';
      tooltip = '';

      if (mainAlerts[key].is_acknowledged) {
        state = 'icon nb-thick-circle icon-state green-text';
        tooltip = (<Tooltip id="tooltip">Notifications Muted</Tooltip>);
        action = (
          <td className="icons hidden-xs">
            <Warning type="mute" status={mainAlerts[key].is_acknowledged} hover={tooltip} />
          </td>
        );
      } else {
        state = 'icon nb-alert icon-state red-text';
        tooltip = (<Tooltip id="tooltip">Mute notifications</Tooltip>);
        action = (
          <td className="icons hidden-xs">
            <Warning type="mute" status={mainAlerts[key].is_acknowledged} hover={tooltip} clickAction={this._acknowledge.bind(this, mainAlerts[key].id)} />
          </td>
        );
      }

      var totalItems = this.state.mainAlerts.legth;

      var from = moment(mainAlerts[key].started_on).format('DD/MM/YYYY hh:mm:ss');
      var to = '';
      if (null != mainAlerts[key].resolved_on) {
        to = moment(mainAlerts[key].resolved_on).format('DD/MM/YYYY hh:mm:ss');
      } else {
        to = '-';
      }

      rows[rows.length] =
        <tr>
          <td className="icons">
            <OverlayTrigger placement="top" overlay={severityTooltip}>
              <i className={level} aria-hidden="true"></i>
            </OverlayTrigger>
          </td>
          <td>{mainAlerts[key].description}</td>
          <td>{mainAlerts[key].instance.hostname}</td>
          <td className="hidden-xs hidden-sm">{mainAlerts[key].instance.provider_credential.name}</td>
          <td className="hidden-xs hidden-sm">
            <time dateTime={mainAlerts[key].started_on}>{from}</time>
          </td>
          <td className="hidden-xs hidden-sm">
            <time dateTime={mainAlerts[key].resolved_on}>{to}</time>
          </td>
          {action}
          <td className="icons">
            <span className="action-button nubity-green hidden-xs hidden-sm" onClick={this._createTicket.bind(this, mainAlerts[key])}>Create Ticket</span>
            <span className="action-button nubity-green hidden-md hidden-lg" title="Create ticket" onClick={this._createTicket.bind(this, mainAlerts[key])}>
              <i className="icon nb-ticket white-text small"></i>
            </span>
          </td>
        </tr>;
    }

    var alertTable;

    if (!mainAlerts) {
      alertTable = <Preloader />;
    } else {
      if (0 == totalItems) {
        alertTable = (
          <div className="alert-table">
            <div className="margin-sides">
              <div className="clear"></div>
              <div className="empty-table">
                <i className="icon nb-thick-circle x-large grey-text"></i>
                <h1 className="grey-text">There are no Active alerts right now.</h1>
              </div>
            </div>
          </div>
        );
      } else {
        alertTable = (
          <div className="alert-table">
            <div className="margin-sides">
              <table>
                <thead>
                  <tr>
                    <th className="column-icon">Severity</th>
                    <th>Description</th>
                    <th>Device</th>
                    <th className="hidden-xs hidden-sm">Integration</th>
                    <th className="hidden-xs hidden-sm">Started on</th>
                    <th className="hidden-xs hidden-sm">Resolved on</th>
                    <th className="column-button hidden-xs">Notifications</th>
                    <th className="column-button">Report a problem</th>
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody>
              </table>
            </div>
            {notice}
          </div>
        );
      }
    }

    return (
      <div className="principal-section">
        <div className="section-title ">
          <h2 className="align-center">{companyName}'s dashboard</h2>
        </div>
        {stats}
        {alertTable}
        <div className="margin-sides row">
          <Graphs/>
        </div>
      </div>
    );
  }
});
