var React                      = require('react');
var moment                     = require('moment-timezone');
var redirect                   = require('../actions/RouteActions').redirect;
var GraphStore                 = require('../stores/GraphStore');
var SessionStore               = require('../stores/SessionStore');
var AlertsStore                = require('../stores/AlertsStore');
var getDashboardAlerts         = require('../actions/RequestActions').getDashboardAlerts;
var getDashboards              = require('../actions/RequestActions').getDashboards;
var getStats                   = require('../actions/RequestActions').getStats;
var getUserData                = require('../actions/StorageActions').getUserData;
var Graphs                     = require('./Graphs.react');
var Preloader                  = require('./Preloader.react');
var createAlertTicket          = require('../actions/ServerActions').createAlertTicket;
var acknowledge                = require('../actions/RequestActions').acknowledge;
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;
var Modal                      = require('react-bootstrap').Modal;
var DropdownButton             = require('react-bootstrap').DropdownButton;
var ButtonToolbar              = require('react-bootstrap').ButtonToolbar;
var MenuItem                   = require('react-bootstrap').MenuItem;
import Authorization from './Authorization.react';

class DefaultDashboard extends Authorization {
  constructor(props) {
    super(props);
    var mainAlerts = AlertsStore.getDashboardAlerts();
    var stats      = AlertsStore.getDashboardStats();
    this.state = {
      mainAlerts: mainAlerts.member,
      dashboards: '',
      dashboard:  '',
      stats:      stats,
      modalType:  '',
      mute:       '',
    };
    this.allowedRoles = ['ROLE_USER_TICKET'];
    this._onChange = this._onChange.bind(this);
    this.close = this.close.bind(this);
    this._acknowledge = this._acknowledge.bind(this);
    this._warning = this._warning.bind(this);
    this._goToDashboard = this._goToDashboard.bind(this);
  }

  componentDidMount() {
    getDashboardAlerts();
    getDashboards();
    getStats();
    AlertsStore.addChangeListener(this._onChange);
    GraphStore.addChangeListener(this._onChange);
    SessionStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    AlertsStore.removeChangeListener(this._onChange);
    GraphStore.removeChangeListener(this._onChange);
    SessionStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    var mainAlerts       = AlertsStore.getDashboardAlerts();
    var dashboards       = GraphStore.getDashboards();
    var dashboard        = GraphStore.getDashboard();
    var stats            = AlertsStore.getDashboardStats();
    this.setState({
      mainAlerts: mainAlerts.member,
      dashboards: dashboards,
      dashboard:  dashboard,
      stats:      stats,
    });

    if (AlertsStore.isAlertTicket()) {
      redirect('create_ticket');
    }
  }

  _goToAlerts() {
    redirect('alerts');
  }

  _goToPerformance() {
    redirect('performance');
  }

  _createTicket(alert) {
    createAlertTicket(alert);
  }

  _acknowledge(alertId) {
    var mute = this.state.mute;
    acknowledge(mute);
    this.setState({
      showModal: false,
      mute:      '',
    });
  }

  close() {
    this.setState({
      showModal: false,
      modalType: '',
      mute:      '',
    });
  }

  _warning(props) {
    switch (props) {
      case 'mute':
        this.setState({
          modalType: 'mute',
          showModal: true,
        });
        break;
    }
  }

  _warningMute(props, id) {
    switch (props) {
      case 'mute':
        this.setState({
          modalType: 'mute',
          showModal: true,
          mute:      id,
        });
        break;
    }
  }

  _goToDashboard(dashboard) {
    // body...
  }

  render() {
    var mainAlerts = this.state.mainAlerts;
    var notice;

    if (undefined !== mainAlerts) {
      if (1 < mainAlerts.length) {
        notice = <span><i className="icon nb-information icon-state reset grey-text"></i> These are only {mainAlerts.length} alerts that needs your attention. For more alerts click <a onClick={this._goToAlerts}>here  &#8594;</a></span>;
      } else if (1 == mainAlerts.length) {
        notice = <span><i className="icon nb-information icon-state reset grey-text"></i> There is only {mainAlerts.length} alert that needs your attention. Go to <a onClick={this._goToAlerts}>Alerts &#8594;</a></span>;
      } else {
        notice = <span><i className="icon nb-information icon-state reset grey-text"></i> There are no alerts that needs your attention right now.</span>;
      }
    }

    var stats = '';
    if (undefined !== this.state.stats && mainAlerts) {
      stats = (
        <div className="col-md-12">
          <div className="col-xs-12 col-sm-4 col-md-4">
            <div className="dashboard-icons first">
              <div className="left">
                <span><i className="icon nb-information" aria-hidden="true"></i></span>
              </div>
              <div className="right">
                <span className="dashboard-icons-counter">{this.state.stats.info}</span>
                <span className="dashboard-icons-info"> Information</span>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4">
            <div className="dashboard-icons second">
              <div className="left">
                <span><i className="icon nb-warning" aria-hidden="true"></i></span>
              </div>
              <div className="right">
                <span className="dashboard-icons-counter">{this.state.stats.warning}</span>
                <span className="dashboard-icons-info"> Warning</span>
              </div>
            </div>
          </div>
          <div className="col-xs-12 col-sm-4 col-md-4">
            <div className="dashboard-icons third">
              <div className="left">
                <span><i className="icon nb-critical" aria-hidden="true"></i></span>
              </div>
              <div className="right">
                <span className="dashboard-icons-counter">{this.state.stats.critical}</span>
                <span className="dashboard-icons-info"> Critical</span>
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

      var totalItems = this.state.mainAlerts.legth;
      var userTimeZone = getUserData('timezone');
      var locale = getUserData('locale');
      moment.locale(locale);
      var dateFromObj = moment.tz(mainAlerts[key].started_on, userTimeZone).toDate();
      var from = dateFromObj.toLocaleDateString() + ' ' + dateFromObj.toLocaleTimeString();
      var to = '';
      if (null != mainAlerts[key].resolved_on) {
        var dateToObj = moment.tz(mainAlerts[key].resolved_on, userTimeZone).toDate();
        to = (<span><i className="icon nb-time grey-text small"></i> {dateToObj.toLocaleDateString() + ' ' + dateToObj.toLocaleTimeString()}</span>);
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
              <span className="table-action-button action-button nubity-blue" onClick={this.close}>Cancel</span>
              <span className="table-action-button action-button nubity-red" onClick={this._acknowledge.bind(this, mainAlerts[key].id)}>OK</span>
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
              <form onSubmit={this._newDashboard}>
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
                      <input type="text" className="form-control no-shadow" id="integrationName" ref="integrationName" placeholder="New Dashboard Performance Name" required />
                    </div>
                  </div>
                </div>
                <button type="submit" className="green-button">Save</button>
              </form>
            </div>
          );
          confirmButtons = (
            <div className="pull-right">
              <span className="table-action-button action-button nubity-blue" onClick={this.close}>Cancel</span>
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

      var action = '';
      var actionIcon = '';

      if (mainAlerts[key].is_acknowledged) {
        actionIcon = (<i className="icon nb-mute-on small light-grey-text"></i>);
        action = (
          <span className='hidden-xs muted-span action-button-disabled'><i className="icon nb-mute-on small"></i> Muted</span>
        );
      } else {
        actionIcon = '';
        action = (
          <span className='dark-grey-text hidden-xs' onClick={this._warningMute.bind(this, mute, mainAlerts[key].id)}><i className="icon nb-mute-off small"></i> Mute</span>
        );
      }

      var newAction = (
        <td className="centered alerts-dropdown hidden-xs">
          <ButtonToolbar>
            <DropdownButton className="no-border ellipsis-button" bsStyle="default" title={<span className="ellipsis-span"><i className="icon nb-ellipsis ellipsis-medium"></i></span>} noCaret pullRight id="dropdown-no-caret">
              <MenuItem eventKey="1">
                {action}
              </MenuItem>
              {this.rolesMatched(this.allowedRoles) ?
                <MenuItem eventKey="2">
                  <span className="dark-grey-text hidden-xs" onClick={this._createTicket.bind(this, mainAlerts[key])}>
                    <i className="icon nb-ticket small"></i> Create Ticket
                  </span>
                </MenuItem>
                : ''
              }
            </DropdownButton>
          </ButtonToolbar>
        </td>
      );

      rows.push(
        <tr key={rows.length} className="content">
          <td className="icons">
            <OverlayTrigger placement="top" overlay={severityTooltip}>
              <i className={level} aria-hidden="true"></i>
            </OverlayTrigger>
          </td>
          <td className="left-aligned"><strong>{mainAlerts[key].description}</strong> {actionIcon}</td>
          <td className="left-aligned">{mainAlerts[key].instance.hostname}</td>
          <td className="hidden-xs hidden-sm left-aligned">{mainAlerts[key].instance.provider_credential.name}</td>
          <td className="hidden-xs hidden-sm">
            <time dateTime={mainAlerts[key].started_on}><i className="icon nb-time grey-text small"></i> {from}</time>
          </td>
          <td className="hidden-xs hidden-sm">
            <time dateTime={mainAlerts[key].resolved_on}>{to}</time>
          </td>
          {newAction}
        </tr>
      );
    }

    var alertTable;

    if (!mainAlerts) {
      alertTable = <Preloader />;
    } else if (0 == totalItems) {
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
                  <th className="column-button hidden-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {rows}
                <tr>
                  <td className="centered" colSpan={8}>
                    {notice}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        );
    }

    if (!mainAlerts) {
      return (<Preloader />);
    }

    return (
      <div className="default-dashboard">
        <h2 className="dashboard-title">Alerts resume</h2>
        {stats}
        {alertTable}
        <h2 className="dashboard-title">Graphs</h2>
        <div className="margin-sides row">
          <Graphs />
        </div>
        {warning}
      </div>
    );
  }
}

module.exports = DefaultDashboard;
