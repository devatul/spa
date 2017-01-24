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
      totalPages: {alerts: 0, history: 0},
      pageNo: 1,
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

  componentDidUpdate: function () {
    var _uri = this._getURI();
    if (_uri.pageNo !== this.state.pageNo) {
      this._updatePage(_uri.hash, _uri.pageNo);
    }
  },

  _getURI: function () {
    var hash = window.location.href.split('/alerts')[1] || '';
    var pageNo = 1;
    if ('' !== hash) {
      var arr = hash.split('#page=');
      hash = arr[0];
      pageNo = parseInt(arr[1]);
    }
    return {hash: hash, pageNo: pageNo}
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
        totalPages: {
          alerts: Math.ceil(parseInt(alerts.totalItems)/10),
          history: Math.ceil(parseInt(historyAlerts.totalItems)/10),
        },
      });
      if (AlertsStore.isAlertTicket()) {
        redirect('create_ticket');
      }
    }
  },

  _updatePage: function (sectionId, page) {
    var i = false;
    if ('#activeAlerts' == sectionId && 0 < page && page <= this.state.totalPages.alerts) {
      this._newPage(page);
      i = true;
    }
    if ('#historyAlerts' == sectionId && 0 < page && page <= this.state.totalPages.history) {
      this._newHistoryPage(page);
      i = true;
    }
    if (i) {
      this.updateURL(sectionId, page);
    }
  },

  updateURL: function (sectionId, pageNo) {
    this.setState({
      pageNo: pageNo,
    });
    var hash = window.location.href.split('/alerts');
    window.location.href = hash[0]+'/alerts'+sectionId+'#page='+pageNo;
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
  updateURL: function (id) {
    return function () {
      var hash = window.location.href.split('/alerts');
      window.location.href = hash[0]+'/alerts'+id;
    }
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
        action = (<span className='action-button action-button-stop'>Alert Stopped</span>);
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
            <span className="action-button action-button-stop" onClick={this._acknowledge.bind(this, historyAlerts[key].id)}>Alert Stopped</span>
          </td>
          <td className="icons">
            <span className="action-button nubity-green" onClick={this._createTicket.bind(this, historyAlerts[key])}>Create Ticket</span>
          </td>
        </tr>
      );
    }

    var totalItems = this.state.alerts.totalItems;
    var pages = this.state.totalPages.alerts;

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
      navpages[navpages.length] = <li className={this.state.pageNo == page ? "active" : ""}><a onClick={this._updatePage.bind(this, '#activeAlerts', page)}>{page}</a></li>;
    }

    var historyPages = this.state.totalPages.history;

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
      historynavpages.push(<li key={key} className={this.state.pageNo == hpage ? "active" : ""}><a onClick={this._updatePage.bind(this, '#historyAlerts', hpage)}>{hpage}</a></li>);
    }

    var alertTable;

    if (!alerts) {
      alertTable = <Preloader />;
    } else {
      alertTable =
      <div className="col-xs-12">
        <table className="table table-striped table-condensed">
          <tr>
            <th className="column-icon">State</th>
            <th>Server</th>
            <th>Integration name</th>
            <th>Alert description</th>
            <th className="column-icon">Priority</th>
            <th>Started on</th>
            <th>Resolved on</th>
            <th className="column-button">Action</th>
            <th className="column-button">Report a problem</th>
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
        <table className="table table-striped table-condensed">
          <tr>
            <th className="column-icon">State</th>
            <th>Server</th>
            <th>Integration name</th>
            <th>Alert description</th>
            <th className="column-icon">Priority</th>
            <th>Started on</th>
            <th>Resolved on</th>
            <th className="column-button">Action</th>
            <th className="column-button">Report a problem</th>
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

    var hash = this._getURI().hash;
    var _SELF = this;

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Alerts</h2>
        </div>
        <div>
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className={hash == '#activeAlerts' || hash == '' ? "active" : ""}>
              <a className="grey-color" data-toggle="tab" href="#activeAlerts" onClick={function () {_SELF._updatePage('#activeAlerts', 1)}}>
                Active alerts
              </a>
            </li>
            <li role="presentation" className={hash == '#historyAlerts' ? "active" : ""}>
              <a className="grey-color" data-toggle="tab" href="#historyAlerts" onClick={function () {_SELF._updatePage('#historyAlerts', 1)}}>
                History alerts
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="activeAlerts" className={"tab-pane fade " + (hash == '#activeAlerts' || hash == '' ? "in active" : "")}>
            <div>{alertTable}</div>
            <div className="invisible">oh</div>
          </div>
          <div id="historyAlerts" className={"tab-pane fade " + (hash == '#historyAlerts' ? "in active" : "")}>
            <div>{historyTable}</div>
            <div className="invisible">oh</div>
          </div>
        </div>
      </div>
    );
  },
});
