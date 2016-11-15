var React                      = require('react');
var Router                     = require('../router');
var moment                     = require("moment");
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var AlertsStore                = require('../stores/AlertsStore');
var getAlerts                  = require('../actions/RequestActions').getAlerts;

module.exports = React.createClass({
  getInitialState: function() {
    return {
      alerts: '',
    };
  },

  componentDidMount: function() {
    getAlerts();
    AlertsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    AlertsStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    if (this.isMounted()) {
      var alerts = AlertsStore.getAlerts();
      this.setState({
        alerts: alerts,
      });
    }
  },

  render: function() {
    var alerts = this.state.alerts.member;
    var rows = [];
    for (var key in alerts) {
      var level = '';
      var state = '';
      if ('critical' == alerts[key].level) {
        level = 'fa fa-minus-square red-color';
      } else if ('warning' == alerts[key].level) {
        level = 'fa fa-exclamation-triangle yellow-color';
      } else if ('info' == alerts[key].level) {
        level = 'fa fa-info-circle blue-color';
      }

      if (alerts[key].is_acknowledge) {
        state = 'fa fa-check-circle green-icon';
      } else {
        state = 'fa fa-exclamation-circle red-icon';
      }

      var date = moment(alerts[key].started_on).format('DD/MM/YYYY hh:mm:ss');
      rows.push(
        <tr>
          <td>
            <i className={state} aria-hidden="true"></i>
          </td>
          <td>{alerts[key].instance.hostname}</td>
          <td>{alerts[key].instance.provider_credential.name}</td>
          <td>{alerts[key].description}</td>
          <td>
            <i className={level} aria-hidden="true"></i>
          </td>
          <td>
            <time datetime="">{date}</time>
          </td>
          <td>
            <time datetime="">DD/MM/YYYY 00:00:00</time>
          </td>
          <td>
            <span className="label label-danger">Stop Alerting</span>
          </td>
          <td>
            <span className="label label-success">Create Ticket</span>
          </td>
        </tr>
      );
    }
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Alerts</h2>
        </div>
        <div className="col-xs-12">
          <table className="table table-striped table-condensed">
            <tr>
              <th>State</th>
              <th>Server</th>
              <th>Integration name</th>
              <th>Alert description</th>
              <th>Priority</th>
              <th>Started on</th>
              <th>Resolved on</th>
              <th>Acknowledge</th>
              <th>Report a problem</th>
            </tr>
            <tbody>
              {rows}
              <tr>
                <td>
                  <i className="fa fa-exclamation-circle red-icon" aria-hidden="true"></i>
                </td>
                <td>server - bla bla</td>
                <td>front 1</td>
                <td>Server down. Nubity agent is unreachable</td>
                <td>
                  <i className="fa fa-info-circle blue-color" aria-hidden="true"></i>
                </td>
                <td>
                  <time datetime="">DD/MM/YYYY 00:00:00</time>
                </td>
                <td>
                  <time datetime="">DD/MM/YYYY 00:00:00</time>
                </td>
                <td>
                  <span className="label label-danger">Stop Alerting</span>
                </td>
                <td>
                  <span className="label label-success">Create Ticket</span>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="fa fa-exclamation-circle red-icon" aria-hidden="true"></i>
                </td>
                <td>server - bla bla</td>
                <td>back 1</td>
                <td>Host information was changed</td>
                <td>
                  <i className="fa fa-exclamation-triangle yellow-color" aria-hidden="true"></i>
                </td>
                <td>
                  <time datetime="">DD/MM/YYYY 00:00:00</time>
                </td>
                <td>
                  <time datetime="">DD/MM/YYYY 00:00:00</time>
                </td>
                <td>
                  <span className="label label-default">Alerting Stopped</span>
                </td>
                <td>
                  <span className="label label-success">Create Ticket</span>
                </td>
              </tr>
              <tr>
                <td>
                  <i className="fa fa-check-circle green-icon" aria-hidden="true"></i>
                </td>
                <td>server - bla bla</td>
                <td>back 2</td>
                <td>Lack of free memory</td>
                <td>
                  <i className="fa fa-exclamation-triangle yellow-color" aria-hidden="true"></i>
                </td>
                <td>
                  <time datetime="">DD/MM/YYYY 00:00:00</time>
                </td>
                <td>
                  <time datetime="">DD/MM/YYYY 00:00:00</time>
                </td>
                <td>
                  <span>Resolved</span>
                </td>
                <td>
                  <span className="label label-success">Create Ticket</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
});
