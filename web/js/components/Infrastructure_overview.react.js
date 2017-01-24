var React                      = require('react');
var ReactPropTypes             = React.PropTypes;
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
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

module.exports = React.createClass({

  getInitialState: function () {
    var overview = InfrastructureStore.getInfrastructureOverview();
    var arrayLength = overview.length;
    var rows = [];
    return {
      overview: overview,
      rows: rows,
      totalItems: overview.totalItems,
    };
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
      this.setState({
        overview: overview.member,
        totalItems: overview.totalItems,
      });
    }
  },
  _newPage: function (page) {
    getInfrastructureOverview(page);
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
    var overview = this.state.overview;
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
    for (var key in overview) {
      state = '';
      if ('public' == overview[key].classification) {
        if ('running' == overview[key].status) {
          state = 'icon nb-cloud-public green-text icon-state';
        } else {
          state = 'icon nb-cloud-public grey-text icon-state';
        } 
      } else if ('private' == overview[key].classification) {
        if ('running' == overview[key].status) {
          state = 'icon nb-cloud-private green-text icon-state';
        } else {
          state = 'icon nb-cloud-private grey-text icon-state';
        }
      } else if ('on-premise' == overview[key].classification) {
        if ('running' == overview[key].status) {
          state = 'icon nb-servers green-text icon-state';
        } else {
          state = 'icon nb-servers grey-text icon-state';
        }
      } else {
        if ('running' == overview[key].status) {
          state = 'icon nb-eye green-text icon-state';
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
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Windows</Tooltip>);
        }
      } else if ('linux' == overview[key].os) {
        os = 'fa fa-linux';
        if ('running' == overview[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Linux</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Linux</Tooltip>);
        }
      } else {
        os = 'fa fa-question-circle light-grey-color'
        if ('running' == overview[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Unknown</Tooltip>);
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
        }
      }

      if ('pending-acceptation' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-grey no-button">Start</span>);
      } else if ('' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-green" onClick={this._monitoring.bind(this, overview[key])}>Start</span>);
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

      for (var count in overview[key].product_orders) {
        if ('Management' == overview[key].product_orders[count].product_type) {
          managementStatus = overview[key].product_orders[count].status;
          managementCode = overview[key].product_orders[count].product_order;
        }
      }

      if ('pending-acceptation' == managementStatus) {
        management = (<span className="action-button nubity-grey no-button">Start</span>);
      } else if ('' == managementStatus) {
        management = (<span className="action-button nubity-green" onClick={this._management.bind(this, overview[key])}>Start</span>);
      } else if ('accepted' == managementStatus) {
        management = (<span className="action-button nubity-red"   onClick={this._stopOrder.bind(this, managementCode)}>Stop</span>);
      } else if ('pending-cancellation' == managementStatus) {
        management = (<span className="action-button nubity-blue"  onClick={this._deleteOrderCancelation.bind(this, managementCode)}>Dismiss</span>);
      } else {
        management = (<span className="action-button nubity-blue no-button">management</span>);
      }

      var level = '';
      if ('critical' == overview[key].health) {
        level = 'icon nb-critical icon-state red-text';
      } else if ('warning' == overview[key].health) {
        level = 'icon nb-warning icon-state yellow-text';
      } else if ('info' == overview[key].health) {
        level = 'icon nb-information icon-state blue-text';
      } else {
        level = 'fa fa-question-circle light-grey-color';
      }
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
          <td>{overview[key].external_identifier}</td>
          <td className="icons">
            <i className="icon nb-start icon-margin" aria-hidden="true"></i> 
            <i className="icon nb-stop icon-margin" aria-hidden="true"></i> 
            <i className="icon nb-restart icon-margin" aria-hidden="true"></i>
          </td>
          <td>{overview[key].memory/1024} GB</td>
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

    if (!overview) {
      return (
        <Preloader />
      );
    }
    return (
      <div id="infrastructureTable">
        <table className="overview-table table table-striped table-condensed">
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
