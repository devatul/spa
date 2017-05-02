var React                      = require('react');
var ReactPropTypes             = require('prop-types');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var redirectWithParams         = require('../actions/RouteActions').redirectWithParams;
var SessionStore               = require('../stores/SessionStore');
var InfrastructureStore        = require('../stores/InfrastructureStore');
var getInfrastructureOverview  = require('../actions/RequestActions').getInfrastructureOverview;
var getInfrastructureOnPremise = require('../actions/RequestActions').getInfrastructureOnPremise;
var getInfrastructurePrivateCloud = require('../actions/RequestActions').getInfrastructurePrivateCloud;
var getInfrastructurePublicCloud  = require('../actions/RequestActions').getInfrastructurePublicCloud;
var getMonitored               = require('../actions/RequestActions').getMonitored;
var getManaged                 = require('../actions/RequestActions').getManaged;
var stopOrder                  = require('../actions/RequestActions').stopOrder;
var startInstance              = require('../actions/RequestActions').startInstance;
var stopInstance               = require('../actions/RequestActions').stopInstance;
var restartInstance            = require('../actions/RequestActions').restartInstance;
var deleteOrderCancelation     = require('../actions/RequestActions').deleteOrderCancelation;
var Preloader                  = require('./Preloader.react');
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;
var Button                     = require('react-bootstrap').Button;
var Link                       = require('react-router').Link;
var Warning                    = require('./Warning.react');

class Infrastructure extends React.Component {
  constructor(props) {
    super(props);
    var infrastructure = '';
    switch (this.props.infrastructureType) {
      case 'public':
        infrastructure = InfrastructureStore.getInfrastructurePublicCloud();
        break;
      case 'private':
        infrastructure = InfrastructureStore.getInfrastructurePrivateCloud();
        break;
      case 'onPremise':
        infrastructure = InfrastructureStore.getInfrastructureOnPremise();
        break;
      default:
        infrastructure = InfrastructureStore.getInfrastructureOverview();
        break;
    }

    var rows = [];
    var loaded = false;
    this.state = {
      infrastructure: infrastructure,
      rows:           rows,
      loaded:         loaded,
      totalItems:     infrastructure.totalItems,
      totalPages:     0,
      pageNo:         1,
      isLoading:      false,
      showModal:      false,
      warning:        (<Warning modalType='' />),
    };
    this._onChange = this._onChange.bind(this);
    this._updatePage = this._updatePage.bind(this);
    this._newPage = this._newPage.bind(this);
    this._warning = this._warning.bind(this);
  }

  componentWillReceiveProps(props) {
    if (props.page_no !== this.state.pageNo) {
      this.setState({
        pageNo: props.page_no,
      });
      this._newPage(props.page_no);
    }
  }

  componentDidMount() {
    InfrastructureStore.addChangeListener(this._onChange);
    var pageNo  = 0;
    var hash = window.location.href.split('/infrastructure')[1] || '';
    if ('' !== hash) {
      var arr = hash.split('#page=');
      if (1 < hash.length) {
        pageNo = parseInt(arr[1]);
      }
    }

    switch (this.props.infrastructureType) {
      case 'public':
        getInfrastructurePublicCloud(pageNo);
        break;
      case 'private':
        getInfrastructurePrivateCloud(pageNo);
        break;
      case 'onPremise':
        getInfrastructureOnPremise(pageNo);
        break;
      default:
        getInfrastructureOverview(pageNo);
        break;
    }
  }

  componentWillUnmount() {
    InfrastructureStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    var infrastructure = '';
    switch (this.props.infrastructureType) {
      case 'public':
        infrastructure = InfrastructureStore.getInfrastructurePublicCloud();
        break;
      case 'private':
        infrastructure = InfrastructureStore.getInfrastructurePrivateCloud();
        break;
      case 'onPremise':
        infrastructure = InfrastructureStore.getInfrastructureOnPremise();
        break;
      default:
        infrastructure = InfrastructureStore.getInfrastructureOverview();
        break;
    }

    if (infrastructure && this.state.infrastructure !== infrastructure.member) {
      this.setState({
        infrastructure: infrastructure.member,
        totalItems:     infrastructure.totalItems,
        totalPages:     Math.ceil(parseInt(infrastructure.totalItems) / 10),
        loaded:         true,
        isLoading:      false,
      });
    }
  }

  _updatePage(page) {
    if (0 < page && page <= this.state.totalPages) {
      this.props.callUpdateURL(page);
    }
  }

  _newPage(page) {
    this.setState({
      isLoading: true,
    });
    switch (this.props.infrastructureType) {
      case 'public':
        getInfrastructurePublicCloud(page);
        break;
      case 'private':
        getInfrastructurePrivateCloud(page);
        break;
      case 'onPremise':
        getInfrastructureOnPremise(page);
        break;
      default:
        getInfrastructureOverview(page);
        break;
    }
  }

  _startInstance(instance) {
    startInstance(instance.instance);
  }

  _stopInstance(instance) {
    stopInstance(instance.instance);
  }

  _restartInstance(instance) {
    restartInstance(instance.instance);
  }

  _managed(instance) {
    getManaged(instance.instance);
  }

  _stopOrder(orderCode) {
    stopOrder(orderCode);
  }

  _deleteOrderCancelation(orderCode) {
    deleteOrderCancelation(orderCode);
  }

  _warning(props, instance, functionParam) {
    switch (props) {
      case 'start':
        this.setState({
          warning: (<Warning modalType={props} hostname={instance.hostname} functionParam={functionParam} okAction={this._startInstance.bind(this)} />),
        });
        break;
      case 'stop':
        this.setState({
          warning: (<Warning modalType={props} hostname={instance.hostname} functionParam={functionParam} okAction={this._stopInstance.bind(this)} />),
        });
        break;
      case 'restart':
        this.setState({
          warning: (<Warning modalType={props} hostname={instance.hostname} functionParam={functionParam} okAction={this._restartInstance.bind(this)} />),
        });
        break;
      case 'managementStart':
        this.setState({
          warning: (<Warning modalType={props} hostname={instance.hostname} functionParam={functionParam} okAction={this._managed.bind(this)} />),
        });
        break;
      case 'managementStop':
        this.setState({
          warning: (<Warning modalType={props} hostname={instance.hostname} functionParam={functionParam} okAction={this._stopOrder.bind(this)} />),
        });
        break;
      case 'monitoringStop':
        this.setState({
          warning: (<Warning modalType={props} hostname={instance.hostname} functionParam={functionParam} okAction={this._stopOrder.bind(this)} />),
        });
        break;
    }
  }

  render() {
    var infrastructure   = this.state.infrastructure;
    var totalItems = this.state.totalItems;
    var pages      = this.state.totalPages;
    var content;

    if (!this.state.loaded) {
      return (
        <Preloader />
      );
    }

    var navpages = [];
    for (var key = 0 ; key < pages ; key++) {
      var page = key + 1;
      navpages[navpages.length] = <li key={key} className={this.props.page_no == page ? 'active' : ''}><a onClick={this._updatePage.bind(this, page)}>{page}</a></li>;
    }

    var paginatorClass;
    if (1 >= pages) {
      paginatorClass = 'hidden';
    } else {
      paginatorClass = 'pull-right';
    }

    var rows = [];
    var state = '';
    var os = '';
    var tooltip = '';
    var num;
    for (key in infrastructure) {
      state = '';
      if ('public' == infrastructure[key].classification) {
        if ('running' == infrastructure[key].status) {
          state = 'icon nb-cloud-public green-text icon-state';
        } else if ('stopped' == infrastructure[key].status) {
          state = 'icon nb-cloud-public red-text icon-state';
        } else {
          state = 'icon nb-cloud-public grey-text icon-state';
        }
      } else if ('private' == infrastructure[key].classification) {
        if ('running' == infrastructure[key].status) {
          state = 'icon nb-cloud-private green-text icon-state';
        } else if ('stopped' == infrastructure[key].status) {
          state = 'icon nb-cloud-private red-text icon-state';
        } else {
          state = 'icon nb-cloud-private grey-text icon-state';
        }
      } else if ('on-premise' == infrastructure[key].classification) {
        if ('running' == infrastructure[key].status) {
          state = 'icon nb-servers green-text icon-state';
        } else if ('stopped' == infrastructure[key].status) {
          state = 'icon nb-servers red-text icon-state';
        } else {
          state = 'icon nb-servers grey-text icon-state';
        }
      } else if ('running' == infrastructure[key].status) {
        state = 'icon nb-eye green-text icon-state';
      } else if ('stopped' == infrastructure[key].status) {
        state = 'icon nb-eye red-text icon-state';
      } else {
        state = 'icon nb-eye grey-text icon-state';
      }

      tooltip = '';
      os = '';
      if ('windows' == infrastructure[key].os) {
        os = 'icon nb-azure blue-text';
        if ('running' == infrastructure[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Windows</Tooltip>);
        } else if ('unavailable' == infrastructure[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Windows</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Windows</Tooltip>);
        }
      } else if ('linux' == infrastructure[key].os) {
        os = 'fa fa-linux';
        if ('running' == infrastructure[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Linux</Tooltip>);
        } else if ('unavailable' == infrastructure[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Linux</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Linux</Tooltip>);
        }
      } else {
        os = 'icon nb-help grey-text';
        if ('running' == infrastructure[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Unknown</Tooltip>);
        } else if ('unavailable' == infrastructure[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Unknown</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Unknown</Tooltip>);
        }
      }

      var monitoringStatus = '';
      var monitoring = '';
      var monitoringCode = '';

      for (var count in infrastructure[key].product_orders) {
        if ('Monitoring' == infrastructure[key].product_orders[count].product_type) {
          monitoringStatus = infrastructure[key].product_orders[count].status;
          monitoringCode = infrastructure[key].product_orders[count].product_order;
          break;
        }
      }

      if ('pending-acceptation' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-grey no-button">Start</span>);
      } else if ('' == monitoringStatus) {
        if (undefined !== infrastructure[key].instance) {
          monitoring = (<Link className="action-button nubity-green" to={`/infrastructure/monitoring/${infrastructure[key].instance}`} >Start</Link>);
        }
      } else if ('accepted' == monitoringStatus) {
        monitoring = (
          <div>
            <span className="action-button config nubity-red" onClick={this._warning.bind(this, 'monitoringStop', infrastructure[key], monitoringCode)}>Stop</span>
            <Link className="action-button config-right nubity-grey" to={`/infrastructure/configure/${infrastructure[key].instance}`} >
              <i className="icon nb-config small dark-grey-text" aria-hidden="true"></i>
            </Link>
          </div>
        );
      } else if ('pending-cancellation' == monitoringStatus) {
        monitoring = (
          <div>
            <span className="action-button config nubity-blue" onClick={this._deleteOrderCancelation.bind(this, monitoringCode)}>Dismiss</span>
            <Link className="action-button config-right nubity-grey" to="configure" to={`/infrastructure/configure/${infrastructure[key].instance}`} >
              <i className="icon nb-config small dark-grey-text" aria-hidden="true"></i>
            </Link>
          </div>
        );
      } else {
        monitoring = (<span className="action-button nubity-blue no-button">Monitoring</span>);
      }


      var managementStatus = '';
      var management = '';
      var managementCode = '';
      for (count in infrastructure[key].product_orders) {
        if ('Management' == infrastructure[key].product_orders[count].product_type) {
          managementStatus = infrastructure[key].product_orders[count].status;
          managementCode = infrastructure[key].product_orders[count].product_order;
          break;
        }
      }

      var managementStart = 'managementStart';
      var managementStop = 'managementStop';

      if ('pending-acceptation' == managementStatus) {
        management = (
          <span className="action-button nubity-grey no-button">Pending start</span>
        );
      } else if ('' == managementStatus) {
        management = (
          <span className="action-button nubity-green" onClick={this._warning.bind(this, managementStart, infrastructure[key], infrastructure[key])}>Start</span>
        );
      } else if ('accepted' == managementStatus) {
        management = (
          <span className="action-button nubity-red" onClick={this._warning.bind(this, managementStop, infrastructure[key], managementCode)}>Stop</span>
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

      num = infrastructure[key].memory / 1024;
      if (0 !== num % 1) {
        num = num.toFixed(2);
      } else {
        num = num.toString();
      }

      var level = '';
      if ('critical' == infrastructure[key].health) {
        level = 'icon nb-critical icon-state red-text';
      } else if ('warning' == infrastructure[key].health) {
        level = 'icon nb-warning icon-state yellow-text';
      } else if ('info' == infrastructure[key].health) {
        level = 'icon nb-information icon-state blue-text';
      } else if ('accepted' == monitoringStatus || 'pending-cancellation' == monitoringStatus) {
        level = 'icon nb-thick-circle icon-state green-text';
      } else {
        level = 'icon nb-help icon-state grey-text';
      }

      var actionButtons;

      if ('running' == infrastructure[key].status) {
        actionButtons = (
          <td className="icons hidden-xs hidden-sm">
            <span className="icon nb-start action-icon disabled"></span>
            <span className="icon nb-stop action-icon" onClick={this._warning.bind(this, 'stop', infrastructure[key], infrastructure[key])}></span>
            <span className="icon nb-restart action-icon" onClick={this._warning.bind(this, 'restart', infrastructure[key], infrastructure[key])}></span>
          </td>
        );
      } else if ('stopped' == infrastructure[key].status) {
        actionButtons = (
          <td className="icons hidden-xs hidden-sm">
            <span className="icon nb-start action-icon " onClick={this._warning.bind(this, 'start', infrastructure[key], infrastructure[key])} ></span>
            <span className="icon nb-stop action-icon disabled"></span>
            <span className="icon nb-restart action-icon " onClick={this._warning.bind(this, 'restart', infrastructure[key], infrastructure[key])} ></span>
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

      rows.push(
        <tr key={key} className="content">
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
          <td>{infrastructure[key].hostname}</td>
          <td className="hidden-xs">
            <div className="integration">
              <div className="provider-logo">
                {null !== infrastructure[key].provider_logo ? <img src={infrastructure[key].provider_logo} className="logo-max-size m-l-10 m-t-15" /> : <span className="fa fa-ban label-inline default-logo-size"></span>}
              </div>
              <div className="credential-name">
                <span className="label-inline">
                  <strong>{infrastructure[key].provider_credential_name}</strong><br />
                  {infrastructure[key].external_identifier}
                </span>
              </div>
            </div>
          </td>
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
                <th className="column-button hidden-xs hidden-sm">Support</th>
              </tr>
            </thead>
          </table>
          <Preloader />
        </div>
      );
    } else if (0 == totalItems) {
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
              <th className="column-button hidden-xs hidden-sm">Support</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
        );
    }

    return (
      <div id="infrastructureTable">
        {content}
        <nav aria-label="Page navigation" className={paginatorClass}>
          <ul className="pagination">
            <li>
              <a aria-label="Previous" onClick={this._updatePage.bind(this, this.state.pageNo - 1)}>
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {navpages}
            <li>
              <a aria-label="Next" onClick={this._updatePage.bind(this, this.state.pageNo + 1)}>
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
        {this.state.warning}
      </div>
    );
  }
}

module.exports = Infrastructure;
