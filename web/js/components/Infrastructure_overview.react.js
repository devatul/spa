var React                      = require('react');
var ReactPropTypes             = React.PropTypes;
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var redirectWithParams         = require('../actions/RouteActions').redirectWithParams;
var SessionStore               = require('../stores/SessionStore');
var InfrastructureStore        = require('../stores/InfrastructureStore');
var getInfrastructureOverview  = require('../actions/RequestActions').getInfrastructureOverview;
var getMonitored               = require('../actions/RequestActions').getMonitored;
var getManaged                 = require('../actions/RequestActions').getManaged;
var stopOrder                  = require('../actions/RequestActions').stopOrder;
var deleteOrderCancelation     = require('../actions/RequestActions').deleteOrderCancelation;
var Preloader                  = require('./Preloader.react');
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;
var Modal                      = require('react-bootstrap').Modal;
var Button                     = require('react-bootstrap').Button;
var Link                       = require('react-router').Link;

module.exports = React.createClass({

  getInitialState: function () {
    var overview = InfrastructureStore.getInfrastructureOverview();
    var arrayLength = overview.length;
    var rows = [];
    var loaded = false;
    return {
      overview: overview,
      rows: rows,
      loaded: loaded,
      totalItems: overview.totalItems,
      totalPages:0,
      pageNo: 1,
      isLoading: false,
      showModal: false,
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
    getInfrastructureOverview(0);
  },

  componentWillUnmount: function () {
    InfrastructureStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var overview = InfrastructureStore.getInfrastructureOverview();
      var loaded = true;
      this.setState({
        overview: overview.member,
        loaded: loaded,
        totalItems: overview.totalItems,
        totalPages: Math.ceil(parseInt(overview.totalItems)/10),
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
    getInfrastructureOverview(page);
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
    var overview = this.state.overview;
    var totalItems = this.state.totalItems;
    var pages = this.state.totalPages;
    var loaded = this.state.loaded;
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
    if (loaded) {
      for (var key in overview) {
        state = '';
        if ('public' == overview[key].classification) {
          if ('running' == overview[key].status) {
            state = 'icon nb-cloud-public green-text icon-state';
          } else if ('stopped' == overview[key].status) {
            state = 'icon nb-cloud-public red-text icon-state';
          } else {
            state = 'icon nb-cloud-public grey-text icon-state';
          }
        } else if ('private' == overview[key].classification) {
          if ('running' == overview[key].status) {
            state = 'icon nb-cloud-private green-text icon-state';
          } else if ('stopped' == overview[key].status) {
            state = 'icon nb-cloud-private red-text icon-state';
          } else {
            state = 'icon nb-cloud-private grey-text icon-state';
          }
        } else if ('on-premise' == overview[key].classification) {
          if ('running' == overview[key].status) {
            state = 'icon nb-servers green-text icon-state';
          } else if ('stopped' == overview[key].status) {
            state = 'icon nb-servers red-text icon-state';
          } else {
            state = 'icon nb-servers grey-text icon-state';
          }
        } else {
          if ('running' == overview[key].status) {
            state = 'icon nb-eye green-text icon-state';
          } else if ('stopped' == overview[key].status) {
            state = 'icon nb-eye red-text icon-state';
          } else {
            state = 'icon nb-eye grey-text icon-state';
          }
        }

        tooltip = '';
        os = '';
        if ('windows' == overview[key].os) {
          os = 'icon nb-azure blue-text';
          if ('running' == overview[key].status) {
            tooltip = (<Tooltip id="tooltip">Running, Windows</Tooltip>);
          } else if ('unavailable' == overview[key].status) {
            tooltip = (<Tooltip id="tooltip">Unavailable, Windows</Tooltip>);
          } else {
            tooltip = (<Tooltip id="tooltip">Stopped, Windows</Tooltip>);
          }
        } else if ('linux' == overview[key].os) {
          os = 'fa fa-linux';
          if ('running' == overview[key].status) {
            tooltip = (<Tooltip id="tooltip">Running, Linux</Tooltip>);
          } else if ('unavailable' == overview[key].status) {
            tooltip = (<Tooltip id="tooltip">Unavailable, Linux</Tooltip>);
          } else {
            tooltip = (<Tooltip id="tooltip">Stopped, Linux</Tooltip>);
          }
        } else {
          os = 'icon nb-help grey-text';
          if ('running' == overview[key].status) {
            tooltip = (<Tooltip id="tooltip">Running, Unknown</Tooltip>);
          } else if ('unavailable' == overview[key].status) {
            tooltip = (<Tooltip id="tooltip">Unavailable, Unknown</Tooltip>);
          } else {
            tooltip = (<Tooltip id="tooltip">Stopped, Unknown</Tooltip>);
          }
        }

        var monitoringStatus = '';
        var monitoring = '';
        var monitoringCode = '';

        for (var count in overview[key].product_orders) {
          if ('Monitoring' == overview[key].product_orders[count].product_type) {
            monitoringStatus = overview[key].product_orders[count].status;
            monitoringCode = overview[key].product_orders[count].product_order;
            break;
          }
        }

        if ('pending-acceptation' == monitoringStatus) {
          monitoring = (<span className="action-button nubity-grey no-button">Start</span>);
        } else if ('' == monitoringStatus) {
          if (undefined !== overview[key].instance) {
            monitoring = (<Link className="action-button nubity-green" to="monitoring" params={{id: overview[key].instance}}>Start</Link>);
          }

        } else if ('accepted' == monitoringStatus) {
          monitoring = (<span className="action-button nubity-red" onClick={this._stopOrder.bind(this, monitoringCode)}>Stop</span>);
        } else if ('pending-cancellation' == monitoringStatus) {
          monitoring = (<span className="action-button nubity-blue"  onClick={this._deleteOrderCancelation.bind(this, managementCode)}>Dismiss</span>);
        } else {
          monitoring = (<span className="action-button nubity-blue no-button">Monitoring</span>);
        }

        var managementStatus = '';
        var management = '';
        var managementCode = '';
        for (var count in overview[key].product_orders) {
          if ('Management' == overview[key].product_orders[count].product_type) {
            managementStatus = overview[key].product_orders[count].status;
            managementCode = overview[key].product_orders[count].product_order;
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

        var level = '';
        if ('critical' == overview[key].health) {
          level = 'icon nb-critical icon-state red-text';
        } else if ('warning' == overview[key].health) {
          level = 'icon nb-warning icon-state yellow-text';
        } else if ('info' == overview[key].health) {
          level = 'icon nb-information icon-state blue-text';
        } else {
          level = 'icon nb-help icon-state grey-text';
        }

        num = overview[key].memory/1024;
        num = num.toString();
        num = num.slice(0, (num.indexOf('.'))+2);

        var actionButtons;
        var start = 'start';
        var stop = 'stop';
        var restart = 'restart';

        if ('running' == overview[key].status) {
          actionButtons = (
            <td className="icons hidden-xs hidden-sm">
              <span className="icon nb-start action-icon disabled"></span>
              <span className="icon nb-stop action-icon" onClick={this._warning.bind(this, stop)}></span>
              <span className="icon nb-restart action-icon" onClick={this._warning.bind(this, restart)}></span>
            </td>
          );
        } else if ('stopped' == overview[key].status) {
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
                You are activating management services for device {overview[key].hostname}.<br/>
                The server takeover process may take from 4 to 6 hours depending on the server complexity.<br/>
                This action will create a charge in the user's account.<br/><br/>
                By clicking the button "I Accept" you agree the <a>Nubity's Terms and Conditions & Privacy Policy</a>.
              </span>
            );
            confirmButtons = (
              <div className="pull-right">
                <span className="action-button nubity-blue" onClick={this.close}>Close</span>
                <span className="action-button nubity-green" onClick={this._managed.bind(this, overview[key])}>I Accept</span>
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

        rows.push(
          <tr key={key}>
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
            <td>{overview[key].hostname}</td>
            <td className="hidden-xs">{overview[key].external_identifier}</td>
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
    } else {
      overview = false;
    }

    if (this.state.isLoading) {
      content = (
        <div>
          <table className="overview-table">
            <thead>
              <tr>
                <th className="column-icon">State</th>
                <th>Description</th>
                <th className="hidden-xs">Integration</th>
                <th className="column-button hidden-xs hidden-sm">Actions</th>
                <th className="hidden-xs hidden-sm">Memory</th>
                <th className="column-icon">Health</th>
                <th className="column-button hidden-xs hidden-sm">Monitoring</th>
                <th className="column-button hidden-xs hidden-sm">Ninja Support</th>
              </tr>
            </thead>
          </table>
          <Preloader />
        </div>
      );
    } else {
      if (0 == totalItems) {
        content = (
          <div className="empty-table">
            <i className="icon nb-connection x-large grey-text"></i>
            <h1 className="grey-text">There are no integrations yet.</h1>
          </div>
        );
      } else {
        content = (
          <table className="overview-table">
            <thead>
              <tr>
                <th className="column-icon">State</th>
                <th>Description</th>
                <th className="hidden-xs">Integration</th>
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

    if (!overview) {
      return (
        <Preloader />
      );
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
