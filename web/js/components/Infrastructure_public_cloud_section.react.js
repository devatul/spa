var React                         = require('react');
var ReactPropTypes                = React.PropTypes;
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var getInfrastructurePublicCloud  = require('../actions/RequestActions').getInfrastructurePublicCloud;
var getMonitored                  = require('../actions/RequestActions').getMonitored;
var getManaged                    = require('../actions/RequestActions').getManaged;
var Tooltip                       = require('react-bootstrap').Tooltip;
var OverlayTrigger                = require('react-bootstrap').OverlayTrigger;

module.exports = React.createClass({

  getInitialState: function () {
    var publicCloud = InfrastructureStore.getInfrastructurePublicCloud();
    var arrayLength = publicCloud.length;
    var rows = [];
    return {
      publicCloud: publicCloud,
      rows: rows,
      totalItems: publicCloud.totalItems,
      totalpages:0,
      pageNo: 1,
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
    getInfrastructurePublicCloud(0);
  },

  componentWillUnmount: function () {
    InfrastructureStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var publicCloud = InfrastructureStore.getInfrastructurePublicCloud();
      this.setState({
        publicCloud: publicCloud.member,
        totalItems: publicCloud.totalItems,
        totalPages: Math.ceil(parseInt(publicCloud.totalItems)/10),
      });
    }
  },

  _updatePage: function (page) {
    if (0 < page && page <= this.state.totalPages) {
      this.props.callUpdateURL(page);
    }
  },

  _newPage: function (page) {
    getInfrastructurePublicCloud(page);
  },

  _monitoring: function (instance) {
    redirect('monitoring');
  },

  _managed: function (instance) {
    getManaged(instance.instance);
  },

  render: function () {
    var publicCloud = this.state.publicCloud;
    var totalItems = this.state.totalItems;
    var pages = this.state.totalPages;

    var navpages = [];
    for (var key = 0 ; key < pages ; key++) {
      var page = key + 1;
      var send = page.toString();
      navpages[navpages.length] = <li className={this.props.page_no == page ? "active" : ""}><a onClick={this._updatePage.bind(this, page)}>{page}</a></li>;
    }

    var paginatorClass;
    if (pages <= 1) {
      paginatorClass = 'hidden';
    }

    var rows = [];
    var state = '';
    var os = '';
    var tooltip = '';
    for (var key in publicCloud) {
      state = '';
      if ('running' == publicCloud[key].status) {
        state = 'icon nb-cloud-public icon-state green-text';
      } else if ('stopped' == publicCloud[key].status) {
        state = 'icon nb-cloud-public red-text icon-state';
      } else {
        state = 'icon nb-cloud-public icon-state grey-text';
      }

      tooltip = '';
      os = '';
      if ('windows' == publicCloud[key].os) {
        os = 'icon nb-azure blue-text';
        if ('running' == publicCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Windows</Tooltip>);
        } else if ('unavailable' == publicCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Windows</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Windows</Tooltip>);
        }
      } else if ('linux' == publicCloud[key].os) {
        os = 'fa fa-linux';
        if ('running' == publicCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Linux</Tooltip>);
        } else if ('unavailable' == publicCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Linux</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Linux</Tooltip>);
        }
      } else {
        os = 'fa fa-question-circle light-grey-color'
        if ('running' == publicCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Unknown</Tooltip>);
        } else if ('unavailable' == publicCloud[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Unknown</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Unknown</Tooltip>);
        }
      }

      var level = '';
      if ('critical' == publicCloud[key].health) {
        level = 'icon nb-critical icon-state red-text';
      } else if ('warning' == publicCloud[key].health) {
        level = 'icon nb-warning icon-state yellow-text';
      } else if ('info' == publicCloud[key].health) {
        level = 'icon nb-information icon-state blue-text';
      } else {
        level = 'icon nb-help icon-state grey-text';
      }

      var monitoringStatus = '';
      var monitoring = '';
      for (var count in publicCloud[key].product_orders) {
        if ('Monitoring' == publicCloud[key].product_orders[count].product_type) {
          monitoringStatus = publicCloud[key].product_orders[count].status;
        }
      }

      if ('pending-acceptation' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-grey no-button">Start</span>);
      } else if ('' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-green" onClick={this._monitoring.bind(this, publicCloud[key])}>Start</span>);
      } else {
        monitoring = (<span className="action-button nubity-blue no-button">Monitoring</span>);
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
          <td>{publicCloud[key].hostname}</td>
          <td className="hidden-xs">{publicCloud[key].external_identifier}</td>
          <td className="icons hidden-xs hidden-sm hidden">
            <i className="icon nb-start icon-margin" aria-hidden="true"></i>
            <i className="icon nb-stop icon-margin" aria-hidden="true"></i>
            <i className="icon nb-restart icon-margin" aria-hidden="true"></i>
          </td>
          <td className="hidden-xs hidden-sm">{publicCloud[key].memory/1024} GB</td>
          <td className="icons"><i className={level} aria-hidden="true"></i></td>
          <td className="icons hidden-xs hidden-sm hidden">
            {monitoring}
          </td>
          <td className="icons hidden-xs hidden-sm">
            <span className="action-button nubity-red" onClick={this._managed.bind(this, publicCloud[key])}>Stop</span>
          </td>
        </tr>
      );
    }
    return (
      <div id="infrastructureTable">
        <table className="publicCloud-table">
          <thead>
          <tr>
            <th className="column-icon">State</th>
            <th>Description</th>
            <th className="hidden-xs">Connection name</th>
            <th className="column-button hidden-xs hidden-sm hidden">Actions</th>
            <th className="hidden-xs hidden-sm">Memory</th>
            <th className="column-icon">Health</th>
            <th className="column-button hidden-xs hidden-sm hidden">Monitoring</th>
            <th className="column-button hidden-xs hidden-sm">Ninja Support</th>
          </tr>
          </thead>
          <tbody>
          {rows}
          </tbody>
        </table>
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
      </div>
    );
  },
});
