var React                      = require('react');
var Router                     = require('../router');
var moment                     = require('moment');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var AlertsStore                = require('../stores/AlertsStore');
var getAlerts                  = require('../actions/RequestActions').getAlerts;
var createAlertTicket          = require('../actions/ServerActions').createAlertTicket;
var Preloader                  = require('./Preloader.react');

module.exports = React.createClass({
  getInitialState: function () {
    var alerts = AlertsStore.getAlerts();
    return {
      alerts: alerts,
      totalItems: alerts.totalItems,
    };
  },

  componentDidMount: function () {
    getAlerts(0);
    AlertsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AlertsStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var alerts = AlertsStore.getAlerts();
      this.setState({
        alerts: alerts,
        totalItems: alerts.totalItems,
      });
      if (AlertsStore.isAlertTicket()) {
        redirect('create_ticket');
      }
    }
  },

  _newPage: function (page) {
    getAlerts(page);
  },

  _createTicket: function (alert) {
    createAlertTicket(alert);
  },

  render: function () {
    var alerts = this.state.alerts.member;

    var rows = [];
    for (var key in alerts) {

      var level = '';
      if ('critical' == alerts[key].level) {
        level = 'fa fa-minus-square red-color';
      } else if ('warning' == alerts[key].level) {
        level = 'fa fa-exclamation-triangle yellow-color';
      } else if ('info' == alerts[key].level) {
        level = 'fa fa-info-circle blue-color';
      }

      var state = '';
      if (alerts[key].is_acknowledge) {
        state = 'fa fa-check-circle green-icon';
      } else {
        state = 'fa fa-exclamation-circle red-icon';
      }

      var from = moment(alerts[key].started_on).format('DD/MM/YYYY hh:mm:ss');
      var to = '';
      if (null != alerts[key].resolved_on) {
        to = moment(alerts[key].resolved_on).format('DD/MM/YYYY hh:mm:ss');
      } else {
        to = '-';
      }
      
      rows.push(
        <tr key={key}>
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
            <time dateTime="">{from}</time>
          </td>
          <td>
            <time dateTime="">{to}</time>
          </td>
          <td>
            <span className="label label-danger">Stop Alerting</span>
          </td>
          <td>
            <span className="label label-success button-pointer" onClick={this._createTicket.bind(this, alerts[key])}>Create Ticket</span>
          </td>
        </tr>
      );
    }

    var totalItems = this.state.alerts.totalItems;
    var pages = Math.ceil(parseInt(totalItems)/10);

    var navpages = [];
    for (var key = 0; key < pages; key++) {
      var page = key + 1;
      var send = page.toString();
      navpages[navpages.length] = <li><a onClick={this._newPage.bind(this, page)}>{page}</a></li>;
    }

    var alertTable;

    if (!alerts) {
      alertTable = <Preloader />;
    } else {
      alertTable = 
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
            </tbody>
          </table>
          <nav aria-label="Page navigation">
          <ul className="pagination">
            <li>
              <a aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {navpages}
            <li>
              <a aria-label="Next">
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
      </div>;
    }
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Alerts</h2>
        </div>
        {alertTable}
      </div>
    );
  },
});
