var React                      = require('react');
var Router                     = require('../router');
var moment                     = require('moment');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var GraphStore                 = require('../stores/GraphStore');
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

module.exports = React.createClass({

  getInitialState: function () {
    var companyInfo = SessionStore.getCompanyInfo();
    return {
      companyInfo:           companyInfo,
      currentDashboard:      (<DefaultDashboard />),
      currentDashboardIndex: '0',
    };
  },

  componentDidMount: function () {
    if (SessionStore.isLoggedIn()) {
      getCompanyInfo();
      getCustomDashboards();
    } else {
      redirect('login');
    }
    GraphStore.addChangeListener(this._onChange);
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    GraphStore.removeChangeListener(this._onChange);
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
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
    }
  },

  close: function () {
    this.setState({
      showModal: false,
      modalType: '',
    });
  },

  _warning: function () {
    this.setState({
      modalType: 'newDashboard',
      showModal: true,
    });
  },

  _newDashboard: function (e) {
    e.preventDefault();
    var form  = e.target.elements;
    var title = form.integrationName.value;
    createCustomDashboard(title, title);
    this.setState({
      modalType: '',
      showModal: false,
    });
  },


  _goToDashboard: function (dashboard) {
    this.setState({
      currentDashboard:      (<CustomPerformanceDashboard dashboard={dashboard} />),
      currentDashboardIndex: dashboard,
    });
  },

  _goToDefaultDashboard: function () {
    this.setState({
      currentDashboard:      (<DefaultDashboard />),
      currentDashboardIndex: '0',
    });
  },

  render: function () {
    var dashboardsTabs;
    var customDashboardsTabs = [];
    if (this.state.customDashboards) {
      for (var key in this.state.customDashboards) {
        customDashboardsTabs.push(
          <span key={key} className={this.state.customDashboards[key] == this.state.currentDashboardIndex ? 'item-tab title item-tab-active' : 'item-tab title'} onClick={this._goToDashboard.bind(this, this.state.customDashboards[key])}>
            {this.state.customDashboards[key].name}
          </span>
        );
      }

      if (3 > this.state.customDashboards.length) {
        dashboardsTabs = (
          <div className="section-title">
            <span className={'0' == this.state.currentDashboardIndex ? 'item-tab title item-tab-active' : 'item-tab title'} onClick={this._goToDefaultDashboard}>Main dashboard</span>
            {customDashboardsTabs}
            <span className="item-tab" onClick={this._warning}>
              <i className="icon nb-plus icon-state"></i> Add a custom dashboard
            </span>
          </div>
        );
      } else {
        dashboardsTabs = (
          <div className="section-title">
            <span className={'0' == this.state.currentDashboardIndex ? 'item-tab title item-tab-active' : 'item-tab title'} onClick={this._goToDefaultDashboard}>Main dashboard</span>
            {customDashboardsTabs}
          </div>
        );
      }
    } else {
      dashboardsTabs = (
        <div className="section-title">
          <span className={'0' == this.state.currentDashboardIndex ? 'item-tab title item-tab-active' : 'item-tab title'} onClick={this._goToDefaultDashboard}>Main dashboard</span>
          {customDashboardsTabs}
          <span className="item-tab" onClick={this._warning}>
            <i className="icon nb-plus icon-state"></i> Add a custom dashboard
          </span>
        </div>
      );
    }

    var warn;
    var form;
    var confirmButtons;

    switch (this.state.modalType) {
      case 'newDashboard':
        warn = (
          <span>Add a new custom dashboard</span>
        );
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
            <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
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
              <div className="med"></div>
              {confirmButtons}
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
  },
});
