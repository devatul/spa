var React                         = require('react');
var ReactPropTypes                = React.PropTypes;
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var getInfrastructureOnPremise    = require('../actions/RequestActions').getInfrastructureOnPremise;
var getMonitored                  = require('../actions/RequestActions').getMonitored;
var getManaged                    = require('../actions/RequestActions').getManaged;
var Tooltip                       = require('react-bootstrap').Tooltip;
var OverlayTrigger                = require('react-bootstrap').OverlayTrigger;

module.exports = React.createClass({

  getInitialState: function () {
    var onPremise = InfrastructureStore.getInfrastructureOnPremise();
    var arrayLength = onPremise.length;
    var rows = [];
    return {
      onPremise: onPremise,
      rows: rows,
      totalItems: onPremise.totalItems,
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
    getInfrastructureOnPremise(0);
  },

  componentWillUnmount: function () {
    InfrastructureStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var onPremise = InfrastructureStore.getInfrastructureOnPremise();
      this.setState({
        onPremise: onPremise.member,
        totalItems: onPremise.totalItems,
        totalPages: Math.ceil(parseInt(onPremise.totalItems)/10),
      });
    }
  },

  _updatePage: function (page) {
    if (0 < page && page <= this.state.totalPages) {
      this.props.callUpdateURL(page);
    }
  },

  _newPage: function (page) {
    getInfrastructureOnPremise(page);
  },

  _monitoring: function (instance) {
    getMonitored(instance.instance);
  },

  _managed: function (instance) {
    getManaged(instance.instance);
  },

  render: function () {
    var onPremise = this.state.onPremise;
    var totalItems = this.state.totalItems;
    var pages = this.state.totalPages;

    var navpages = [];
    for (var key = 0 ; key < pages ; key++) {
      var page = key + 1;
      var send = page.toString();
      navpages[navpages.length] = <li className={this.props.page_no == page ? "active" : ""}><a onClick={this._updatePage.bind(this, page)}>{page}</a></li>;
    }

    var paginatorClass;
    if (totalItems <= 1) {
      paginatorClass = 'hidden';
    }

    var rows = [];
    var state = '';
    var os = '';
    var tooltip = '';
    for (var key in onPremise) {
      state = '';
      if ('running' == onPremise[key].status) {
        state = 'icon nb-servers icon-state green-text';
      } else if ('stopped' == onPremise[key].status) {
        state = 'icon nb-servers red-text icon-state';
      } else {
        state = 'icon nb-servers icon-state grey-text';
      }

      tooltip = '';
      os = '';
      if ('windows' == onPremise[key].os) {
        os = 'icon nb-azure blue-text';
        if ('running' == onPremise[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Windows</Tooltip>);
        } else if ('unavailable' == onPremise[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Windows</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Windows</Tooltip>);
        }
      } else if ('linux' == onPremise[key].os) {
        os = 'fa fa-linux';
        if ('running' == onPremise[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Linux</Tooltip>);
        } else if ('unavailable' == onPremise[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Linux</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Linux</Tooltip>);
        }
      } else {
        os = 'fa fa-question-circle light-grey-color'
        if ('running' == onPremise[key].status) {
          tooltip = (<Tooltip id="tooltip">Running, Unknown</Tooltip>);
        } else if ('unavailable' == onPremise[key].status) {
          tooltip = (<Tooltip id="tooltip">Unavailable, Unknown</Tooltip>);
        } else {
          tooltip = (<Tooltip id="tooltip">Stopped, Unknown</Tooltip>);
        }
      }

      var level = '';
      if ('critical' == onPremise[key].health) {
        level = 'icon nb-critical icon-state red-text';
      } else if ('warning' == onPremise[key].health) {
        level = 'icon nb-warning icon-state yellow-text';
      } else if ('info' == onPremise[key].health) {
        level = 'icon nb-information icon-state blue-text';
      } else {
        level = 'fa fa-question-circle light-grey-color';
      }

      var monitoringStatus = '';
      var monitoring = '';
      for (var count in onPremise[key].product_orders) {
        if ('Monitoring' == onPremise[key].product_orders[count].product_type) {
          monitoringStatus = onPremise[key].product_orders[count].status;
        }
      }

      if ('pending-acceptation' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-grey no-button">Start</span>);
      } else if ('' == monitoringStatus) {
        monitoring = (<span className="action-button nubity-green" onClick={this._monitoring.bind(this, onPremise[key])}>Start</span>);
      } else {
        monitoring = (<span className="action-button nubity-blue no-button">Monitoring</span>);
      }


      rows.push(
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
          <td>{onPremise[key].hostname}</td>
          <td>{onPremise[key].external_identifier}</td>
          <td className="icons">
            <i className="icon nb-start icon-margin" aria-hidden="true"></i>
            <i className="icon nb-stop icon-margin" aria-hidden="true"></i>
            <i className="icon nb-restart icon-margin" aria-hidden="true"></i>
          </td>
          <td>{onPremise[key].memory/1024} GB</td>
          <td className="icons"><i className={level} aria-hidden="true"></i></td>
          <td className="icons">
            {monitoring}
          </td>
          <td className="icons">
            <span className="action-button nubity-red" onClick={this._managed.bind(this, onPremise[key])}>Stop</span>
          </td>
        </tr>
        );
    }
    return (
      <div id="infrastructureTable">
        <table className="onPremise-table table table-striped table-condensed">
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
