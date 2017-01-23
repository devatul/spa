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
var CreateGraph                = require('./Create_graph.react');
var Graph                      = require('./Graph.react');
var Preloader                  = require('./Preloader.react');
var createAlertTicket          = require('../actions/ServerActions').createAlertTicket;
var acknowledge                = require('../actions/RequestActions').acknowledge;

module.exports = React.createClass({

  getInitialState: function() {
    var mainAlerts = AlertsStore.getDashboardAlerts();
    var dashboards = GraphStore.getDashboards();
    var dashboard  = GraphStore.getDashboard();
    var stats      = AlertsStore.getDashboardStats();
    return {
      mainAlerts: mainAlerts.member,
      dashboards: '',
      dashboard: '',
      stats: stats,
    };
  },

  componentDidMount: function() {
    getDashboardAlerts();
    getDashboards();
    getStats();
    AlertsStore.addChangeListener(this._onChange);
    GraphStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AlertsStore.removeChangeListener(this._onChange);
    GraphStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    if (this.isMounted()) {
      var mainAlerts = AlertsStore.getDashboardAlerts();
      var dashboards = GraphStore.getDashboards();
      var dashboard  = GraphStore.getDashboard();
      var stats      = AlertsStore.getDashboardStats();
      this.setState({
        mainAlerts: mainAlerts.member,
        dashboards: dashboards,
        dashboard: dashboard,
        stats: stats,
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
    var dashboard = this.state.dashboard;
    var firstname = localStorage.getItem('nubity-firstname');
    var mainAlerts = this.state.mainAlerts;
    var notice;
    
    if (undefined !== mainAlerts) {
      if (mainAlerts.length > 1) {
        notice = <p className="margin-sides right-aligned">These are only the {mainAlerts.length} alerts that needs your attention, see all <a onClick={this._goToAlerts}>here</a></p>;
      } else if (mainAlerts.length == 1) {
        notice = <p className="margin-sides right-aligned">There is only {mainAlerts.length} alert that needs your attention. Go to <a onClick={this._goToAlerts}>Alerts</a></p>;
      } else {
        notice = <p className="margin-sides right-aligned">There are no alerts that needs your attention right now.</p>;
      }
    }

    var stats = '';
    if (undefined !== this.state.stats && mainAlerts) {
      var stats = 
        <div className="col-md-6 col-md-offset-3">
          <div className="col-xs-4 dashboard-icons blue">
            <i className="icon nb-information blue-text dashboard-minus" aria-hidden="true"></i>
            Information
            <div className="dashboard-icons-counter first">{this.state.stats.info}</div>
          </div>
          <div className="col-xs-4 dashboard-icons">
            <i className="icon nb-warning yellow-text dashboard-minus" aria-hidden="true"></i>
            Warning
            <div className="dashboard-icons-counter second">{this.state.stats.warning}</div>
          </div>
          <div className="col-xs-4 dashboard-icons">
            <i className="icon nb-critical red-text dashboard-minus" aria-hidden="true"></i>
            Critical
            <div className="dashboard-icons-counter third">{this.state.stats.critical}</div>
          </div>
        </div>;
    } 

    var rows = [];
    for (var key in mainAlerts) {
      var level = '';
      var state = '';
      if ('critical' == mainAlerts[key].level) {
        level = 'icon nb-critical icon-state red-text';
      } else if ('warning' == mainAlerts[key].level) {
        level = 'icon nb-warning icon-state yellow-text';
      } else if ('info' == mainAlerts[key].level) {
        level = 'icon nb-information icon-state blue-text';
      }


      if (mainAlerts[key].is_acknowledged) {
        state = 'icon nb-thick-circle icon-state green-text';
        action = (<span className='action-button action-button-stop'>Stop Alerting</span>);
      } else {
        state = 'icon nb-alert icon-state red-text';
        action = (<span className='action-button action-button-start' onClick={this._acknowledge.bind(this, mainAlerts[key].id)}>Stop Alerting</span>); 
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
            <i className={state} aria-hidden="true"></i>
          </td>
          <td>{mainAlerts[key].instance.hostname}</td>
          <td>{mainAlerts[key].instance.provider_credential.name}</td>
          <td>{mainAlerts[key].description}</td>
          <td className="icons">
            <i className={level} aria-hidden="true"></i>
          </td>
          <td>
            <time dateTime={mainAlerts[key].started_on}>{from}</time>
          </td>
          <td>
            <time dateTime={mainAlerts[key].resolved_on}>{to}</time>
          </td>
          <td>
            {action}
          </td>
          <td>
            <span className="action-button nubity-green button-pointer" onClick={this._createTicket.bind(this, mainAlerts[key])}>Create Ticket</span>
          </td>
        </tr>;
    }

    var alertTable;

    if (!mainAlerts) {
      alertTable = <Preloader />;
    } else {
      alertTable = 
        <div className="alert-table">
          <div className="margin-sides">
            <table>
              <tr>
                <th>State</th>
                <th>Server</th>
                <th>Connection name</th>
                <th>Alert description</th>
                <th>Priority</th>
                <th>Started on</th>
                <th>Resolved on</th>
                <th>Action</th>
                <th>Report an issue</th>
              </tr>
              <tbody>
                {rows}
              </tbody>
            </table>
          </div>
          {notice}
        </div>;
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Hi {firstname}! Check your infrastructure and apps status</h2>
        </div>
        {stats}
        {alertTable}
        <div className="margin-sides row hidden">
          <div className="col-xs-12 col-md-6">
            
          </div>
          <div className="col-xs-6 right-div" id="container">
            
          </div>
        </div>
      </div>
    );
  }
});
