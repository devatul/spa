var React                         = require('react');
var ReactPropTypes                = React.PropTypes;
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var getInfrastructurePrivateCloud = require('../actions/RequestActions').getInfrastructurePrivateCloud;
var getMonitored                  = require('../actions/RequestActions').getMonitored;
var getManaged                    = require('../actions/RequestActions').getManaged;
var stopOrder                     = require('../actions/RequestActions').stopOrder;
var deleteOrderCancelation        = require('../actions/RequestActions').deleteOrderCancelation;
var Tooltip                       = require('react-bootstrap').Tooltip;
var OverlayTrigger                = require('react-bootstrap').OverlayTrigger;

module.exports = React.createClass({

  getInitialState: function () {
    var privateCloud = InfrastructureStore.getInfrastructurePrivateCloud();
    var arrayLength = privateCloud.length;
    var rows = [];
    return {
      privateCloud: privateCloud,
      rows: rows,
      totalItems: privateCloud.totalItems,
    };
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
      });
    }
  },

  _newPage: function (page) {
    getInfrastructurePrivateCloud(page);
  },

  _monitoring: function (instance) {
    getMonitored(instance.instance);
  },

  _management: function (instance) {
    getManaged(instance.instance);
  },

  _stopOrder: function (orderCode) {
    stopOrder(orderCode);
  },

  _deleteOrderCancelation: function (orderCode) {
    deleteOrderCancelation(orderCode);
  },

  render: function () {
    var privateCloud = this.state.privateCloud;
    var totalItems = this.state.totalItems;
    var pages = Math.ceil(parseInt(totalItems)/10);

    var navpages = [];
    for (var key = 0 ; key < pages ; key++) {
      var page = key + 1;
      var send = page.toString();
      navpages[navpages.length] = <li><a onClick={this._newPage.bind(this, page)}>{page}</a></li>;
    }

    var paginatorClass;
    if (pages <= 1) {
      paginatorClass = 'hidden';
    }

    var rows = [];
    var state = '';
    var os = '';
    var tooltip = '';
    for (var key in privateCloud) {
      state = '';
      if ('running' == privateCloud[key].status) {
        state = 'icon nb-cloud-private icon-state green-text';
      } else {
        state = 'icon nb-cloud-private icon-state grey-text';
      } 

      tooltip = '';
      os = '';
      if ('windows' == privateCloud[key].os) {
        os = 'icon nb-azure blue-text';
        if ('running' == privateCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Windows</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Windows</Tooltip>);
        }
      } else if ('linux' == privateCloud[key].os) {
        os = 'fa fa-linux';
        if ('running' == privateCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Linux</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Linux</Tooltip>);
        }
      } else {
        os = 'fa fa-question-circle light-grey-color'
        if ('running' == privateCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Unknown</Tooltip>);
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
        level = 'fa fa-question-circle light-grey-color';
      }

      var monitoringStatus = '';
      var monitoring = '';
      var monitoringCode = '';

      for (var count in privateCloud[key].product_orders) {
        if ('Monitoring' == privateCloud[key].product_orders[count].product_type) {
          monitoringStatus = privateCloud[key].product_orders[count].status;
          monitoringCode = privateCloud[key].product_orders[count].product_order;
        }
      }

      if ('pending-acceptation' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-grey no-button">Start</span>);
      } else if ('' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-green" onClick={this._monitoring.bind(this, privateCloud[key])}>Start</span>);
      } else if ('accepted' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-red"   onClick={this._stopOrder.bind(this, monitoringCode)}>Stop</span>);
      } else if ('pending-cancellation' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-blue"  onClick={this._deleteOrderCancelation.bind(this, managementCode)}>Dismiss</span>);
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
        }
      }

      if ('pending-acceptation' == managementStatus) {
        management = (<span className="action-button nubity-grey no-button">Start</span>);
      } else if ('' == managementStatus) {
        management = (<span className="action-button nubity-green" onClick={this._management.bind(this, privateCloud[key])}>Start</span>);
      } else if ('accepted' == managementStatus) {
        management = (<span className="action-button nubity-red"   onClick={this._stopOrder.bind(this, managementCode)}>Stop</span>);
      } else if ('pending-cancellation' == managementStatus) {
        management = (<span className="action-button nubity-blue"  onClick={this._deleteOrderCancelation.bind(this, managementCode)}>Dismiss</span>);
      } else {
        management = (<span className="action-button nubity-blue no-button">management</span>);
      }

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
          <td>{privateCloud[key].external_identifier}</td>
          <td className="icons">
            <i className="icon nb-start icon-margin" aria-hidden="true"></i> 
            <i className="icon nb-stop icon-margin" aria-hidden="true"></i> 
            <i className="icon nb-restart icon-margin" aria-hidden="true"></i>
          </td>
          <td>{privateCloud[key].memory/1024} GB</td>
          <td className="icons"><i className={level} aria-hidden="true"></i></td>
          <td className="icons">
            {monitoring}
          </td>
          <td className="icons">
            {management}
          </td>
        </tr>
        );
    }
    return (
      <div id="infrastructureTable">
        <table className="privateCloud-table table table-striped table-condensed">
          <thead>
          <tr>
            <th>State</th>
            <th>Description</th>
            <th>Connection name</th>
            <th>Actions</th><th>Memory</th>
            <th>Health</th><th>Monitoring</th>
            <th>Ninja Support</th>
          </tr>
          </thead>
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
      </div>
    );
  },
});
