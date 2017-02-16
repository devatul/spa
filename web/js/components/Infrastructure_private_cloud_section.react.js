var React                         = require('react');
var ReactPropTypes                = React.PropTypes;
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var redirectWithParams            = require('../actions/RouteActions').redirectWithParams;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var getInfrastructurePrivateCloud = require('../actions/RequestActions').getInfrastructurePrivateCloud;
var getMonitored                  = require('../actions/RequestActions').getMonitored;
var getManaged                    = require('../actions/RequestActions').getManaged;
var stopOrder                     = require('../actions/RequestActions').stopOrder;
var deleteOrderCancelation        = require('../actions/RequestActions').deleteOrderCancelation;
var Preloader                     = require('./Preloader.react');
var Tooltip                       = require('react-bootstrap').Tooltip;
var OverlayTrigger                = require('react-bootstrap').OverlayTrigger;
var Modal                         = require('react-bootstrap').Modal;
var Button                        = require('react-bootstrap').Button;
var Link                          = require('react-router').Link;

module.exports = React.createClass({

  getInitialState: function () {
    var privateCloud = InfrastructureStore.getInfrastructurePrivateCloud();
    var arrayLength = privateCloud.length;
    var rows = [];
    return {
      privateCloud: privateCloud,
      rows: rows,
      totalItems: privateCloud.totalItems,
      totalpages:0,
      pageNo: 1,
      isLoading: false,
      modalType: '',
    };
  },

  componentWillReceiveProps: function (props) {
    if (props.page_no !== this.state.pageNo) {
      this.setState({
        pageNo: props.page_no,
      });
      this._newPage(props.page_no);
    }
  },

  componentDidMount: function () {
    InfrastructureStore.addChangeListener(this._onChange);
    getInfrastructurePrivateCloud(0);
  },

  componentWillUnmount: function () {
    InfrastructureStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var privateCloud = InfrastructureStore.getInfrastructurePrivateCloud();
      this.setState({
        privateCloud: privateCloud.member,
        totalItems: privateCloud.totalItems,
        totalPages: Math.ceil(parseInt(privateCloud.totalItems)/10),
        isLoading: false,
      });
    }
  },

  _updatePage: function (page) {
    if (0 < page && page <= this.state.totalPages) {
      this.props.callUpdateURL(page);
    }
  },

  _newPage: function (page) {
    this.setState({
      isLoading: true,
    });
    getInfrastructurePrivateCloud(page);
  },

  _managed: function (instance) {
    getManaged(instance.instance);
    this.setState({
      showModal: false,
    });
  },

  _stopOrder: function (orderCode) {
    stopOrder(orderCode);
    this.setState({
      showModal: false,
    });
  },

  _deleteOrderCancelation: function (orderCode) {
    deleteOrderCancelation(orderCode);
  },

  _warning: function (props) {
    switch (props) {
      case 'start':
        this.setState({
          modalType: 'start',
          showModal: true,
        });
      break;
      case 'stop':
        this.setState({
          modalType: 'stop',
          showModal: true,
        });
      break;
      case 'restart':
        this.setState({
          modalType: 'restart',
          showModal: true,
        });
      break;
      case 'monitoringStart':
        this.setState({
          modalType: 'monitoringStart',
          showModal: true,
        });
      break;
      case 'monitoringStop':
        this.setState({
          modalType: 'monitoringStop',
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
    var privateCloud = this.state.privateCloud;
    var totalItems = this.state.totalItems;
    var pages = this.state.totalPages;
    var content;

    var navpages = [];
    for (var key = 0 ; key < pages ; key++) {
      var page = key + 1;
      var send = page.toString();
      navpages[navpages.length] = <li className={this.props.page_no == page ? 'active' : ''}><a onClick={this._updatePage.bind(this, page)}>{page}</a></li>;
    }

    var paginatorClass;
    if (1 >= pages) {
      paginatorClass = 'hidden';
    }

    var rows = [];
    var state = '';
    var os = '';
    var tooltip = '';
    var num;
    for (var key in privateCloud) {
      state = '';
      if ('running' == privateCloud[key].status) {
        state = 'icon nb-cloud-private icon-state green-text';
      } else if ('stopped' == privateCloud[key].status) {
        state = 'icon nb-cloud-private red-text icon-state';
      } else {
        state = 'icon nb-cloud-private icon-state grey-text';
      }

      tooltip = '';
      os = '';
      if ('windows' == privateCloud[key].os) {
        os = 'icon nb-azure blue-text';
        if ('running' == privateCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Windows</Tooltip>);
        } else if ('unavailable' == privateCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Windows</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Windows</Tooltip>);
        }
      } else if ('linux' == privateCloud[key].os) {
        os = 'fa fa-linux';
        if ('running' == privateCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Linux</Tooltip>);
        } else if ('unavailable' == privateCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Linux</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Linux</Tooltip>);
        }
      } else {
        os = 'fa fa-question-circle light-grey-color';
        if ('running' == privateCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Unknown</Tooltip>);
        } else if ('unavailable' == privateCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Unknown</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Unknown</Tooltip>);
        }
      }

      var level = '';
      if ('critical' == privateCloud[key].health) {
        level = 'icon nb-critical icon-state red-text';
      } else if ('warning' == privateCloud[key].health) {
        level = 'icon nb-warning icon-state yellow-text';
      } else if ('info' == privateCloud[key].health) {
        level = 'icon nb-information icon-state blue-text';
      } else {
        level = 'icon nb-help icon-state grey-text';
      }

      var monitoringStatus = '';
      var monitoring = '';
      var monitoringCode = '';

      for (var count in privateCloud[key].product_orders) {
        if ('Monitoring' == privateCloud[key].product_orders[count].product_type) {
          monitoringStatus = privateCloud[key].product_orders[count].status;
          monitoringCode = privateCloud[key].product_orders[count].product_order;
          break;
        }
      }

      if ('pending-acceptation' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-grey no-button">Start</span>);
      } else if ('' == monitoringStatus) {
        if (undefined !== privateCloud[key].instance) {
          monitoring = (<Link className="action-button nubity-green" to="monitoring" params={{id: privateCloud[key].instance}}>Start</Link>);
        }
      } else if ('accepted' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-red" onClick={this._stopOrder.bind(this, monitoringCode)}>Stop</span>);
      } else if ('pending-cancellation' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-blue" onClick={this._deleteOrderCancelation.bind(this, managementCode)}>Dismiss</span>);
      } else {
        monitoring = (<span className="action-button nubity-blue no-button">Monitoring</span>);
      }

      var managementStatus = '';
      var management = '';
      var managementCode = '';

      for (var count in privateCloud[key].product_orders) {
        if ('Management' == privateCloud[key].product_orders[count].product_type) {
          managementStatus = privateCloud[key].product_orders[count].status;
          managementCode = privateCloud[key].product_orders[count].product_order;
          break;
        }
      }

      var monitoringStart = 'monitoringStart';
      var monitoringStop = 'monitoringStop';

      if ('pending-acceptation' == managementStatus) {
        management = (
          <span className="action-button nubity-grey no-button">Pending start</span>
        );
      } else if ('' == managementStatus) {
        management = (
          <span className="action-button nubity-green" onClick={this._warning.bind(this, monitoringStart)}>Start</span>
        );
      } else if ('accepted' == managementStatus) {
        management = (
          <span className="action-button nubity-red" onClick={this._warning.bind(this, monitoringStop)}>Stop</span>
        );
      } else if ('pending-cancellation' == managementStatus) {
        management = (
          <span className="action-button nubity-blue" onClick={this._deleteOrderCancelation.bind(this, managementCode)} >Dismiss stop</span>
        );
      } else {
        management = (
          <span className="action-button nubity-blue no-button">Management</span>
        );
      }

      num = privateCloud[key].memory/1024;
      num = num.toString();
      num = num.slice(0, (num.indexOf('.'))+2);

      var actionButtons;
      var start = 'start';
      var stop = 'stop';
      var restart = 'restart';

      if ('running' == privateCloud[key].status) {
        actionButtons = (
          <td className="icons hidden-xs hidden-sm">
            <span className="icon nb-start action-icon disabled"></span>
            <span className="icon nb-stop action-icon" onClick={this._warning.bind(this, stop)}></span>
            <span className="icon nb-restart action-icon" onClick={this._warning.bind(this, restart)}></span>
          </td>
        );
      } else if ('stopped' == privateCloud[key].status) {
        actionButtons = (
          <td className="icons hidden-xs hidden-sm">
            <span className="icon nb-start action-icon " onClick={this._warning.bind(this, start)} ></span>
            <span className="icon nb-stop action-icon disabled" ></span>
            <span className="icon nb-restart action-icon " onClick={this._warning.bind(this, restart)} ></span>
          </td>
        );
      } else {
        actionButtons = (
          <td className="icons hidden-xs hidden-sm">
            <span className="icon nb-start action-icon disabled"></span>
            <span className="icon nb-stop action-icon disabled"></span>
            <span className="icon nb-restart action-icon disabled"></span>
          </td>
        );
      }

      var notice;
      var warn;
      var confirmButtons;

      switch (this.state.modalType) {
        case 'start':
          warn = (
            <span><i className="icon nb-warning yellow-text large"></i> You're about to start an instance</span>
          );
          notice = 'The instance will start right after you click OK button';
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-green" onClick={this.close}>Cancel</span>
              <span className="action-button nubity-blue" onClick={this.close}>OK</span>
            </div>
          );
        break;
        case 'stop':
          warn = (
            <span><i className="icon nb-warning yellow-text large"></i> Are you sure?</span>
          );
          notice = 'If you stop this instance, it\'ll be unavailable until the next start';
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
              <span className="action-button nubity-red" onClick={this.close}>OK</span>
            </div>
          );
        break;
        case 'restart':
          warn = (
            <span><i className="icon nb-warning yellow-text large"></i> Are you sure to restart?</span>
          );
          notice = 'The instance will be unavailable for a few minutes';
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
              <span className="action-button nubity-red" onClick={this.close}>OK</span>
            </div>
          );
        break;
        case 'monitoringStart':
          warn = (
            <span><i className="icon nb-ninja-support yellow-text large"></i> Start Ninja Support</span>
          );
          notice = (
            <span>
              You are activating management services for device {privateCloud[key].hostname}.<br/>
              The server takeover process may take from 4 to 6 hours depending on the server complexity.<br/>
              This action will create a charge in the user's account.<br/><br/>
              By clicking the button "I Accept" you agree the <a>Nubity's Terms and Conditions & Privacy Policy</a>.
            </span>
          );
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-blue" onClick={this.close}>Close</span>
              <span className="action-button nubity-green" onClick={this._managed.bind(this, privateCloud[key])}>I Accept</span>
            </div>
          );
        break;
        case 'monitoringStop':
          warn = (
            <span><i className="icon nb-warning yellow-text large"></i> Are you sure?</span>
          );
          notice = (
            <span>
              Stopping the management services will be effective in billing as well as technical at the end of the 
              current billing cicle. In any moment during this period, you can dismiss the stop and the service will 
              continue normally.
            </span>
          );
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
              <span className="action-button nubity-red" onClick={this._stopOrder.bind(this, managementCode)}>OK</span>
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
                <p>{notice}</p>
                <div className="med"></div>
                {confirmButtons}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      );

      rows.push = (
        <tr>
          <td>
            <OverlayTrigger placement="top" overlay={tooltip}>
              <div className="status-container">
                <i className={state} data-toggle="tooltip" data-original-title="Running"></i>
                <div className="os">
                  <i className={os}></i>
                </div>
              </div>
            </OverlayTrigger>
          </td>
          <td>{privateCloud[key].hostname}</td>
          <td className="hidden-xs">{privateCloud[key].external_identifier}</td>
          {actionButtons}
          <td className="hidden-xs hidden-sm">{num} GB</td>
          <td className="icons"><i className={level} aria-hidden="true"></i></td>
          <td className="icons hidden-xs hidden-sm">
            {monitoring}
          </td>
          <td className="icons hidden-xs hidden-sm">
            {management}
          </td>
        </tr>
      );
    }

    if (this.state.isLoading) {
      content = (
        <div>
          <table className="privateCloud-table">
            <thead>
              <tr>
                <th className="column-icon">State</th>
                <th>Description</th>
                <th className="hidden-xs">Connection name</th>
                <th className="column-button hidden-xs hidden-sm">Actions</th>
                <th className="hidden-xs hidden-sm">Memory</th>
                <th className="column-icon">Health</th>
                <th className="column-button hidden-xs hidden-sm">Monitoring</th>
                <th className="column-button hidden-xs hidden-sm">Ninja Support</th>
              </tr>
            </thead>
          </table>
          <Preloader/>
        </div>
      );
    } else {
      if (0 == totalItems) {
        content = (
          <div className="empty-table">
            <i className="icon nb-connection x-large grey-text"></i>
            <h1 className="grey-text">There are no Private Cloud integrations yet.</h1>
          </div>
        );
      } else {
        content = (
          <table className="privateCloud-table">
            <thead>
              <tr>
                <th className="column-icon">State</th>
                <th>Description</th>
                <th className="hidden-xs">Connection name</th>
                <th className="column-button hidden-xs hidden-sm">Actions</th>
                <th className="hidden-xs hidden-sm">Memory</th>
                <th className="column-icon">Health</th>
                <th className="column-button hidden-xs hidden-sm">Monitoring</th>
                <th className="column-button hidden-xs hidden-sm">Ninja Support</th>
              </tr>
            </thead>
            <tbody>
            {rows}
            </tbody>
          </table>
        );
      }
    }

    return (
      <div id="infrastructureTable">
        {content}
        <nav aria-label="Page navigation" className={paginatorClass}>
          <ul className="pagination">
            <li>
              <a aria-label="Previous" onClick={this._updatePage.bind(this, this.state.pageNo-1)}>
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {navpages}
            <li>
              <a aria-label="Next" onClick={this._updatePage.bind(this, this.state.pageNo+1)}>
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
        {warning}
      </div>
    );
  },
});
