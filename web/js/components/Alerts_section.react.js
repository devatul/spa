var React                      = require('react');
var Router                     = require('../router');
var moment                     = require('moment');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var AlertsStore                = require('../stores/AlertsStore');
var getAlerts                  = require('../actions/RequestActions').getAlerts;
var getHistoryAlerts           = require('../actions/RequestActions').getHistoryAlerts;
var createAlertTicket          = require('../actions/ServerActions').createAlertTicket;
var acknowledge                = require('../actions/RequestActions').acknowledge;
var Preloader                  = require('./Preloader.react');

module.exports = React.createClass({
  getInitialState: function () {
    var alerts = AlertsStore.getAlerts();
    var historyAlerts = AlertsStore.getHistoryAlerts();
    return {
      alerts: alerts,
      historyAlerts: historyAlerts,
      totalItems: alerts.totalItems,
      totalHistoryItems: historyAlerts.totalItems,
    };
  },

  componentDidMount: function () {
    getAlerts(0);
    getHistoryAlerts(0);
    AlertsStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    AlertsStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var alerts = AlertsStore.getAlerts();
      var historyAlerts = AlertsStore.getHistoryAlerts();
      this.setState({
        alerts: alerts,
        totalItems: alerts.totalItems,
        historyAlerts: historyAlerts,
        totalHistoryItems: historyAlerts.totalItems,
      });
      if (AlertsStore.isAlertTicket()) {
        redirect('create_ticket');
      }
    }
  },

  _newPage: function (page) {
    getAlerts(page);
  },

  _newHistoryPage: function (page) {
    getHistoryAlerts(page);
  },

  _createTicket: function (alert) {
    createAlertTicket(alert);
  },

  _acknowledge: function (alertId) {
    acknowledge(alertId);
  },

  render: function () {
    var alerts = this.state.alerts.member;
    var historyAlerts = this.state.historyAlerts.member;

    var rows = [];
    var level;
    var state;
    var action;

    for (var key in alerts) {
      level = '';
      if ('critical' == alerts[key].level) {
        level = 'icon nb-critical icon-state red-text';
      } else if ('warning' == alerts[key].level) {
        level = 'icon nb-warning icon-state yellow-text';
      } else if ('info' == alerts[key].level) {
        level = 'icon nb-information icon-state blue-text';
      }

      state = '';
      action = '';
      
      if (alerts[key].is_acknowledged) {
        state = 'icon nb-thick-circle icon-state green-text';
        action = (<span className='action-button action-button-stop'>Stop Alerting</span>);
      } else {
        state = 'icon nb-alert icon-state red-text';
        action = (<span className='action-button action-button-start' onClick={this._acknowledge.bind(this, alerts[key].id)}>Stop Alerting</span>);
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
          <td className="icons">
            <i className={state} aria-hidden="true"></i>
          </td>
          <td>{alerts[key].instance.hostname}</td>
          <td>{alerts[key].instance.provider_credential.name}</td>
          <td>{alerts[key].description}</td>
          <td className="icons">
            <i className={level} aria-hidden="true"></i>
          </td>
          <td>
            <time dateTime="">{from}</time>
          </td>
          <td>
            <time dateTime="">{to}</time>
          </td>
          <td className="icons">
            {action}
          </td>
          <td className="icons">
            <span className="action-button nubity-green" onClick={this._createTicket.bind(this, alerts[key])}>Create Ticket</span>
          </td>
        </tr>
      );
    }

    var historyRows = [];
    var hlevel;
    var hstate;
    for (var key in historyAlerts) {

      hlevel = '';
      if ('critical' == historyAlerts[key].level) {
        hlevel = 'icon nb-critical icon-state red-text';
      } else if ('warning' == historyAlerts[key].level) {
        hlevel = 'icon nb-warning icon-state yellow-text';
      } else if ('info' == historyAlerts[key].level) {
        hlevel = 'icon nb-information icon-state blue-text';
      }

      hstate = '';
      if (historyAlerts[key].is_acknowledged) {
        hstate = 'icon nb-thick-circle icon-state green-text';
      } else {
        hstate = 'icon nb-alert icon-state red-text';
      }

      var from = moment(historyAlerts[key].started_on).format('DD/MM/YYYY hh:mm:ss');
      var to = '';
      if (null != historyAlerts[key].resolved_on) {
        to = moment(historyAlerts[key].resolved_on).format('DD/MM/YYYY hh:mm:ss');
      } else {
        to = '-';
      }
      
      historyRows.push(
        <tr key={key}>
          <td className="icons">
            <i className={hstate} aria-hidden="true"></i>
          </td>
          <td>{historyAlerts[key].instance.hostname}</td>
          <td>{historyAlerts[key].instance.provider_credential.name}</td>
          <td>{historyAlerts[key].description}</td>
          <td className="icons">
            <i className={hlevel} aria-hidden="true"></i>
          </td>
          <td>
            <time dateTime="">{from}</time>
          </td>
          <td>
            <time dateTime="">{to}</time>
          </td>
          <td className="icons">
            <span className="action-button action-button-stop" onClick={this._acknowledge.bind(this, historyAlerts[key].id)}>Stop Alerting</span>
          </td>
          <td className="icons">
            <span className="action-button nubity-green" onClick={this._createTicket.bind(this, historyAlerts[key])}>Create Ticket</span>
          </td>
        </tr>
      );
    }

    var totalItems = this.state.alerts.totalItems;
    var pages = Math.ceil(parseInt(totalItems)/10);

    var paginatorClass;
    if (pages <= 1) {
      paginatorClass = 'hidden';
    }

    var navpages = [];
    var page = '';
    var send = '';
    for (var key = 0; key < pages; key++) {
      page = key + 1;
      send = page.toString();
      navpages[navpages.length] = <li><a onClick={this._newPage.bind(this, page)}>{page}</a></li>;
    }

    var totalHistoryItems = this.state.totalHistoryItems;
    var historyPages = Math.ceil(parseInt(totalHistoryItems)/10);

    var hpaginatorClass;
    if (historyPages <= 1) {
      hpaginatorClass = 'hidden';
    }

    var historynavpages = [];
    var hpage = '';
    var hsend = '';
    for (var key = 0; key < historyPages; key++) {
      hpage = key + 1;
      hsend = page.toString();
      historynavpages.push(<li key={key}><a onClick={this._newHistoryPage.bind(this, hpage)}>{hpage}</a></li>);
    }

    var alertTable;

    if (!alerts) {
      alertTable = <Preloader />;
    } else {
      alertTable = 
      <div className="col-xs-12">
        <table>
          <tr>
            <th>State</th>
            <th>Server</th>
            <th>Integration name</th>
            <th>Alert description</th>
            <th>Priority</th>
            <th>Started on</th>
            <th>Resolved on</th>
            <th>Action</th>
            <th>Report a problem</th>
          </tr>
          <tbody>
            {rows}
          </tbody>
        </table>
        <nav aria-label="Page navigation" className={paginatorClass}>
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

    var historyTable;

    if (!historyAlerts) {
      historyTable = <Preloader />;
    } else {
      historyTable = 
      <div className="col-xs-12">
        <table>
          <tr>
            <th>State</th>
            <th>Server</th>
            <th>Integration name</th>
            <th>Alert description</th>
            <th>Priority</th>
            <th>Started on</th>
            <th>Resolved on</th>
            <th>Action</th>
            <th>Report a problem</th>
          </tr>
          <tbody>
            {historyRows}
          </tbody>
        </table>
        <nav aria-label="Page navigation" className={hpaginatorClass}>
          <ul className="pagination">
            <li>
              <a aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {historynavpages}
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
        <div>
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className="active">
              <a className="grey-color" data-toggle="tab" href="#activeAlerts">
                Active alerts
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#historyAlerts">
                History alerts
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="activeAlerts" className="tab-pane fade in active ">
            <div>{alertTable}</div>
            <div className="invisible">oh</div>
          </div>
          <div id="historyAlerts" className="tab-pane fade">
            <div>{historyTable}</div>
            <div className="invisible">oh</div>
          </div>
        </div>
      </div>
    );
  },
});
