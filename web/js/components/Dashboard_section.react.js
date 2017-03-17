var React                      = require('react');
var Router                     = require('../router');
var moment                     = require('moment');
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
var createAlertTicket          = require('../actions/ServerActions').createAlertTicket;
var acknowledge                = require('../actions/RequestActions').acknowledge;
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;
var Modal                      = require('react-bootstrap').Modal;
var Button                     = require('react-bootstrap').Button;
var getCompanyInfo             = require('../actions/RequestActions').getCompanyInfo;

module.exports = React.createClass({

  getInitialState: function () {
    var mainAlerts = AlertsStore.getDashboardAlerts();
    var stats      = AlertsStore.getDashboardStats();
    var companyInfo = SessionStore.getCompanyInfo();
    return {
      mainAlerts: mainAlerts.member,
      dashboards: '',
      dashboard: '',
      stats: stats,
      companyInfo: companyInfo,
      modalType: '',
    };
  },

  componentDidMount: function () {
    getCompanyInfo();
    getDashboardAlerts();
    getDashboards();
    getStats();
    AlertsStore.addChangeListener(this._onChange);
    GraphStore.addChangeListener(this._onChange);
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillMount: function () {
    if (!SessionStore.isLoggedIn()) {
      redirect('login');
    }
  },

  componentWillUnmount: function () {
    AlertsStore.removeChangeListener(this._onChange);
    GraphStore.removeChangeListener(this._onChange);
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
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

  _goToAlerts: function () {
    redirect('alerts');
  },

  _goToPerformance: function () {
    redirect('performance');
  },

  _createTicket: function (alert) {
    createAlertTicket(alert);
  },

  _acknowledge: function (alertId) {
    acknowledge(alertId);
    this.setState({
      showModal: false,
    });
  },

  _warning: function (props) {
    switch (props) {
      case 'mute':
        this.setState({
          modalType: 'mute',
          showModal: true,
        });
        break;
      case 'newDashboard':
        this.setState({
          modalType: 'newDashboard',
          showModal: true,
        });
        break;
    }
  },

  close: function () {
    this.setState({
      showModal: false,
      modalType: '',
    });
  },

  render: function () {
    var companyInfo = this.state.companyInfo;
    var mainAlerts = this.state.mainAlerts;
    var notice;
    var tooltip = '';
    var companyName = companyInfo.name;

    if (undefined !== mainAlerts) {
      if (1 < mainAlerts.length) {
        notice = <p className="margin-sides right-aligned">These are only {mainAlerts.length} alerts that needs your attention. For more alerts click <a onClick={this._goToAlerts}>here</a></p>;
      } else if (1 == mainAlerts.length) {
        notice = <p className="margin-sides right-aligned">There is only {mainAlerts.length} alert that needs your attention. Go to <a onClick={this._goToAlerts}>Alerts</a></p>;
      } else {
        notice = <p className="margin-sides right-aligned">There are no alerts that needs your attention right now.</p>;
      }
    }

    var stats = '';
    if (undefined !== this.state.stats && mainAlerts) {
      stats = (
        <div className="col-md-12">
          <div className="col-xs-12 col-sm-4 col-md-4">
            <div className="dashboard-icons first">
              <div className="left">
                <i className="icon nb-information" aria-hidden="true"></i>
              </div>
              <div className="right">
                <div className="dashboard-icons-counter">{this.state.stats.info}</div>
                <span className="dashboard-icons-info">Information <br/>alerts</span>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4">
            <div className="dashboard-icons second">
              <div className="left">
                <i className="icon nb-warning" aria-hidden="true"></i>
              </div>
              <div className="right">
                <div className="dashboard-icons-counter">{this.state.stats.warning}</div>
                <span className="dashboard-icons-info">Warning <br/>alerts</span>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4">
            <div className="dashboard-icons third">
              <div className="left">
                <i className="icon nb-critical" aria-hidden="true"></i>
              </div>
              <div className="right">
                <div className="dashboard-icons-counter">{this.state.stats.critical}</div>
                <span className="dashboard-icons-info">Critical <br/>alerts</span>
              </div>
            </div>
          </div>
        </div>
      );
    }

    var rows = [];
    var mute = 'mute';
    for (var key in mainAlerts) {
      var level = '';
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

      var action = '';
      tooltip = '';

      if (mainAlerts[key].is_acknowledged) {
        tooltip = (<Tooltip id="tooltip">Notifications Muted</Tooltip>);
        action = (
          <td className="icons hidden-xs">
            <span>
              <span className='hidden-xs hidden-sm action-button-disabled'>Muted</span>
              <OverlayTrigger placement="top" overlay={tooltip}>
                <span className="hidden-md hidden-lg action-button-disabled" title="Notifications muted">
                  <i className="icon nb-mute-on grey-text small"></i>
                </span>
              </OverlayTrigger>
            </span>
          </td>
        );
      } else {
        tooltip = (<Tooltip id="tooltip">Mute notifications</Tooltip>);
        action = (
          <td className="icons hidden-xs">
            <span>
              <span className='action-button nubity-red hidden-xs hidden-sm' onClick={this._warning.bind(this, mute)}>Mute notifications</span>
              <OverlayTrigger placement="top" overlay={tooltip}>
                <span className="action-button nubity-red hidden-md hidden-lg" title="Mute notifications" onClick={this._warning.bind(this, mute)}>
                  <i className="icon nb-mute-off small white-text"></i>
                </span>
              </OverlayTrigger>
            </span>
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

      var warn;
      var form;
      var confirmButtons;

      switch (this.state.modalType) {
        case 'mute':
          warn = (
            <span><i className="icon nb-warning yellow-text large"></i> Are you sure?</span>
          );
          notice = 'If you turn off the alerts, you won\'t receive them anymore!';
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
              <span className="action-button nubity-red" onClick={this._acknowledge.bind(this, mainAlerts[key].id)}>OK</span>
            </div>
          );
          break;
        case 'newDashboard':
          warn = (
            <span>Add a new custom dashboard</span>
          );
          notice = '';
          form = (
            <div className="row margin-tops">
              <div className="col-xs-3 centered">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="fa fa-cubes" aria-hidden="true"></i>
                  </div>
                  <select className="form-control">
                    <option>Select icon</option>
                  </select>
                </div>
              </div>
              <div className="col-xs-4">
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-addon">
                      <i className="fa fa-area-chart" aria-hidden="true"></i>
                    </div>
                    <input type="text" className="form-control no-shadow" id="integrationName" placeholder="New Dashboard Performance Name"/>
                  </div>
                </div>
              </div>
              <button className="green-button">Save</button>
            </div>
          );
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
              <span className="action-button nubity-red" onClick={this._goToPerformance}>OK</span>
            </div>
          );
      }

      var warning = (
        <Modal show={this.state.showModal} onHide={this.close} bsSize="small">
          <Modal.Body>
            <div className="row">
              <div className="col-xs-12 warn-message">
                <h1>{warn}</h1>
                <p>{notice}</p>
                {form}
                <div className="med"></div>
                {confirmButtons}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      );

      rows[rows.length] = (
        <tr className="content">
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
        </tr>
      );
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
      var newDash = 'newDashboard';
    }

    if (!mainAlerts) {
      return (<Preloader/>);
    }

    return (
      <div className="principal-section">
        <div className="section-title ">
            <span className="item title">{companyName}&#39;s dashboard</span>
            <span className="item hidden" onClick={this._warning.bind(this, newDash)}>
              <i className="icon nb-plus icon-state"></i> Add a custom dashboard
            </span>
        </div>
        {stats}
        {alertTable}
        <div className="margin-sides row">
          <Graphs/>
        </div>
        {warning}
      </div>
    );
  },
});
