var React                      = require('react');
var Router                     = require('../router');
var moment                     = require('moment');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var GraphStore                 = require('../stores/GraphStore');
var AlertsStore                = require('../stores/AlertsStore');
var Preloader                  = require('./Preloader.react');
var DefaultDashboard           = require('./Default_dashboard.react');
var CustomPerformanceDashboard = require('./Custom_performance_dashboard.react');
var getCustomDashboards        = require('../actions/RequestActions').getCustomDashboards;
var createCustomDashboard      = require('../actions/RequestActions').createCustomDashboard;
var createAlertTicket          = require('../actions/ServerActions').createAlertTicket;
var acknowledge                = require('../actions/RequestActions').acknowledge;
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;
var Modal                      = require('react-bootstrap').Modal;
var Button                     = require('react-bootstrap').Button;
var getCompanyInfo             = require('../actions/RequestActions').getCompanyInfo;

class DashboardSection extends React.Component {
  constructor(props) {
    super(props);
    var companyInfo = SessionStore.getCompanyInfo();
    this.state = {
      companyInfo:           companyInfo,
      currentDashboard:      (<DefaultDashboard />),
      currentDashboardIndex: '0',
    };
    this._onChange = this._onChange.bind(this);
    this.close = this.close.bind(this);
    this._warning = this._warning.bind(this);
    this._newDashboard = this._newDashboard.bind(this);
    this._goToDashboard = this._goToDashboard.bind(this);
    this._goToDefaultDashboard = this._goToDefaultDashboard.bind(this);
  }
  componentWillMount() {
    if (!SessionStore.isLoggedIn()) {
      redirect('login');
    }
  }
  componentDidMount() {
    if (SessionStore.isLoggedIn()) {
      getCompanyInfo();
      getCustomDashboards();
    } else {
      redirect('login');
    }
    GraphStore.addChangeListener(this._onChange);
    SessionStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    GraphStore.removeChangeListener(this._onChange);
    SessionStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    if (GraphStore.deletedDashboard()) {
      getCustomDashboards();
      this.setState({
        currentDashboard:      (<DefaultDashboard />),
        currentDashboardIndex: '0',
      });
      GraphStore.resetDeletedDashboard();
    }
    var companyInfo = SessionStore.getCompanyInfo();
    this.setState({
      companyInfo:      companyInfo,
      customDashboards: GraphStore.getCustomDashboards(),
    });

    if (AlertsStore.isAlertTicket()) {
      redirect('support/create-ticket');
    }
  }

  close() {
    this.setState({
      modalType: '',
      showModal: false,
    });
  }

  _warning() {
    this.setState({
      modalType: 'newDashboard',
      showModal: true,
    });
  }

  _newDashboard(e) {
    e.preventDefault();
    var form  = e.target.elements;
    var title = form.integrationName.value;
    createCustomDashboard(title, title);
    this.setState({
      modalType: '',
      showModal: false,
    });
  }

  _goToDashboard(dashboard) {
    this.setState({
      currentDashboard:      (<CustomPerformanceDashboard dashboard={dashboard} />),
      currentDashboardIndex: dashboard,
    });
  }

  _goToDefaultDashboard() {
    this.setState({
      currentDashboard:      (<DefaultDashboard />),
      currentDashboardIndex: '0',
    });
  }

  render() {
    var dashboardsTabs;
    var customDashboardsTabs = [];
    if (this.state.customDashboards) {
      for (var key in this.state.customDashboards) {
        customDashboardsTabs.push(
          <div key={key} className={this.state.customDashboards[key] == this.state.currentDashboardIndex ? 'item-tab title item-tab-active' : 'item-tab title'} onClick={this._goToDashboard.bind(this, this.state.customDashboards[key])}>
            <span className="auto-margin">{this.state.customDashboards[key].name}</span>
          </div>
        );
      }

      if (3 > this.state.customDashboards.length) {
        dashboardsTabs = (
          <div className="section-title">
            <div className={'0' == this.state.currentDashboardIndex ? 'item-tab title item-tab-active' : 'item-tab title'} onClick={this._goToDefaultDashboard}><span className="auto-margin">Main dashboard</span></div>
            {customDashboardsTabs}
            <div className="item-tab-button new-dashboard-button" onClick={this._warning}>
              <span className="auto-margin"><i className="icon fa fa-plus-circle new-dashboard-plus"></i> Add a custom dashboard</span>
            </div>
          </div>
        );
      } else {
        dashboardsTabs = (
          <div className="section-title">
            <div className={'0' == this.state.currentDashboardIndex ? 'item-tab title item-tab-active' : 'item-tab title'} onClick={this._goToDefaultDashboard}><span className="auto-margin">Main dashboard</span></div>
            {customDashboardsTabs}
          </div>
        );
      }
    } else {
      dashboardsTabs = (
        <div className="section-title">
          <div className={'0' == this.state.currentDashboardIndex ? 'item-tab title item-tab-active' : 'item-tab title'} onClick={this._goToDefaultDashboard}><span className="auto-margin">Main dashboard</span></div>
          {customDashboardsTabs}
          <div className="item-tab-button new-dashboard-button" onClick={this._warning}>
            <span className="auto-margin"><i className="icon fa fa-plus-circle new-dashboard-plus"></i> Add a custom dashboard</span>
          </div>
        </div>
      );
    }

    var warn;
    var form;

    switch (this.state.modalType) {
      case 'newDashboard':
        warn = (
          <span>Add a new custom dashboard</span>
        );
        form = (
          <div className="row margin-tops">
            <form onSubmit={this._newDashboard}>
              <div className="col-xs-3 centered hidden">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="fa fa-cubes" aria-hidden="true"></i>
                  </div>
                  <select className="form-control">
                    <option>Select icon</option>
                  </select>
                </div>
              </div>
              <div className="col-xs-12">
                <div className="form-group">
                  <div className="input-group">
                    <div className="input-group-addon">
                      <i className="fa fa-area-chart" aria-hidden="true"></i>
                    </div>
                    <input type="text" className="form-control no-shadow" id="integrationName" ref="integrationName" placeholder="New Performance Dashboard Name" required />
                  </div>
                </div>
              </div>
              <div className="col-xs-12">
                <button type="submit" className="green-button">Save</button>
                <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
              </div>
            </form>
          </div>
        );
        break;
    }

    var warning = (
      <Modal show={this.state.showModal} onHide={this.close} bsSize="small">
        <Modal.Body>
          <div className="row">
            <div className="col-xs-12 warn-message">
              <h1>{warn}</h1>
              {form}
            </div>
          </div>
        </Modal.Body>
      </Modal>
    );

    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
    }

    return (
      <div className="principal-section">
        {dashboardsTabs}
        {this.state.currentDashboard}
        {warning}
      </div>
    );
  }
}

module.exports = DashboardSection;
