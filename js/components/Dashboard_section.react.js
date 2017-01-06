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
var CreateGraph                = require('./Create_graph.react');
var Graph                      = require('./Graph.react');

module.exports = React.createClass({
  getInitialState: function() {
    var mainAlerts = AlertsStore.getDashboardAlerts();
    var dashboards = GraphStore.getDashboards();
    var dashboard = GraphStore.getDashboard();
    return {
      mainAlerts: mainAlerts.member,
      dashboards: '',
      dashboard: '',
    };
  },

  componentDidMount: function() {
    getDashboardAlerts();
    getDashboards();
    GraphStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    GraphStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    if (this.isMounted()) {
      var mainAlerts = AlertsStore.getDashboardAlerts();
      var dashboards = GraphStore.getDashboards();
      var dashboard = GraphStore.getDashboard();
      this.setState({
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

      if (mainAlerts[key].is_acknowledge) {
        state = 'icon nb-thick-circle icon-state green-text';
      } else {
        state = 'icon nb-alert icon-state red-text';
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
            <i className="icon nb-information blue-text dashboard-minus" aria-hidden="true"></i>
            Information
            <div className="dashboard-icons-counter first">1</div>
          </div>
          <div className="col-xs-4 dashboard-icons">
            <i className="icon nb-warning yellow-text dashboard-minus" aria-hidden="true"></i>
            Warning
            <div className="dashboard-icons-counter second">1</div>
          </div>
          <div className="col-xs-4 dashboard-icons">
            <i className="icon nb-critical red-text dashboard-minus" aria-hidden="true"></i>
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
        {notice}
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
