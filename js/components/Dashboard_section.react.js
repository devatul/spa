var React                      = require('react');
var Router                     = require('../router');
var moment                     = require("moment");
var redirect                   = require('../actions/RouteActions').redirect;
var GraphStore                 = require('../stores/GraphStore');
var SessionStore               = require('../stores/SessionStore');
var AlertsStore                = require('../stores/AlertsStore');
var getAlerts                  = require('../actions/RequestActions').getAlerts;
var getDashboardAlerts         = require('../actions/RequestActions').getDashboardAlerts;
var getDashboards              = require('../actions/RequestActions').getDashboards;
var getDashboard               = require('../actions/RequestActions').getDashboard;
var CreateGraph                = require('./Create_graph.react');
var Graph                      = require('./Graph.react');

module.exports = React.createClass({
  getInitialState: function() {
    var alerts = AlertsStore.getAlerts();
    var mainAlerts = AlertsStore.getDashboardAlerts();
    var dashboards = GraphStore.getDashboards();
    var dashboard = GraphStore.getDashboard();
    return {
      alerts: alerts.member,
      mainAlerts: mainAlerts.member,
      dashboards: '',
      dashboard: '',
    };
  },

  componentDidMount: function() {
    getAlerts();
    getDashboardAlerts();
    getDashboards();
    GraphStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    GraphStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    if (this.isMounted()) {
      var alerts = AlertsStore.getAlerts();
      var mainAlerts = AlertsStore.getDashboardAlerts();
      var dashboards = GraphStore.getDashboards();
      var dashboard = GraphStore.getDashboard();
      this.setState({
        alerts: alerts.member,
        mainAlerts: mainAlerts.member,
        dashboards: dashboards,
        dashboard: dashboard,
      });
    }
  },

  _goToAlerts: function() {
    redirect('alerts');
  },

  render: function() {
    var alerts = this.state.alerts;
    var dashboard = this.state.dashboard;
    var firstname = localStorage.getItem('nubity-firstname');
    var mainAlerts = this.state.mainAlerts;
    if (undefined !== alerts) {
      console.log("alerts ", JSON.stringify(alerts.length));
    }

    var rows = [];
    for (var key in mainAlerts) {
      var level = '';
      var state = '';
      if ('critical' == mainAlerts[key].level) {
        level = 'fa fa-minus-square red-color';
      } else if ('warning' == mainAlerts[key].level) {
        level = 'fa fa-exclamation-triangle yellow-color';
      } else if ('info' == mainAlerts[key].level) {
        level = 'fa fa-info-circle blue-color';
      }

      if (mainAlerts[key].is_acknowledge) {
        state = 'fa fa-check-circle green-icon';
      } else {
        state = 'fa fa-exclamation-circle red-icon';
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
          <td>
            <i className={state} aria-hidden="true"></i>
          </td>
          <td>{mainAlerts[key].instance.hostname}</td>
          <td>{mainAlerts[key].instance.provider_credential.name}</td>
          <td>{mainAlerts[key].description}</td>
          <td>
            <i className={level} aria-hidden="true"></i>
          </td>
          <td>
            <time dateTime={mainAlerts[key].started_on}>{from}</time>
          </td>
          <td>
            <time dateTime={mainAlerts[key].resolved_on}>{to}</time>
          </td>
          <td>
            <span className="label label-danger">Stop Alerting</span>
          </td>
          <td>
            <span className="label label-success" onClick={this._createTicket}>Create Ticket</span>
          </td>
        </tr>;
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Hi {firstname}! Check your infrastructure and apps status</h2>
        </div>
        <div className="col-md-6 col-md-offset-3">
          <div className="col-xs-4 dashboard-icons blue">
            <i className="fa fa-info-circle dashboard-minus blue-color" aria-hidden="true"></i>
            Information
            <div className="dashboard-icons-counter first">1</div>
          </div>
          <div className="col-xs-4 dashboard-icons">
            <i className="fa fa-exclamation-triangle dashboard-minus yellow-color" aria-hidden="true"></i>
            Warning
            <div className="dashboard-icons-counter second">1</div>
          </div>
          <div className="col-xs-4 dashboard-icons">
            <i className="fa fa-minus-square dashboard-minus red-color" aria-hidden="true"></i>
            Critical
            <div className="dashboard-icons-counter third">1</div>
          </div>
        </div>
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
        <p className="margin-sides right-aligned">This are only the 5 alerts that needs your attention, se all <a onClick={this._goToAlerts}>here</a></p>
        <div className="margin-sides row">
          <div className="col-xs-12 col-md-6">
            <Graph/>
          </div>
          <div className="col-xs-6 right-div" id="container">
            <CreateGraph/>
          </div>
        </div>
      </div>
    );
  }
});
