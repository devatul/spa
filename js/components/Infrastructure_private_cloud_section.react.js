var React                         = require('react');
var ReactPropTypes                = React.PropTypes;
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var getInfrastructurePrivateCloud = require('../actions/RequestActions').getInfrastructurePrivateCloud;

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

    var rows = [];
    var state = '';
    for (var key in privateCloud) {
      state = '';
      if ('running' == privateCloud[key].status) {
        state = 'fa fa-cloud text-success';
      } else {
        state = 'fa fa-cloud light-grey-color';
      } 

      if ('critical' == privateCloud[key].level) {
        level = 'icon nb-critical icon-state red-text';
      } else if ('warning' == privateCloud[key].level) {
        level = 'icon nb-warning icon-state yellow-text';
      } else if ('info' == privateCloud[key].level) {
        level = 'icon nb-information icon-state blue-text';
      } else {
        level = 'fa fa-question-circle light-grey-color';
      }
      rows[rows.length] =
        <tr>
          <td>
            <div className="status-container">
              <i className={state} data-toggle="tooltip" data-original-title="Running"></i> 
              <div id="os" className="os">
                <i id="linux" className="sprites small os-ubuntu"></i>
              </div> 
            </div>
          </td>
          <td>{privateCloud[key].hostname}</td>
          <td>{privateCloud[key].external_identifier}</td>
          <td>
            <i className="fa fa-play icon-margin" aria-hidden="true"></i> 
            <i className="fa fa-stop icon-margin" aria-hidden="true"></i> 
            <i className="fa fa-retweet icon-margin" aria-hidden="true"></i>
          </td>
          <td>{privateCloud[key].memory/1024} GB</td>
          <td><i className={level} aria-hidden="true"></i></td>
          <td>
            <span className="label label-success">Start</span>
          </td>
          <td>
            <span className="label label-danger">Stop</span>
          </td>
        </tr>;
    }
    return (
      <div id="infrastructureTable">
        <table className="publicCloud-table table table-striped table-condensed">
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
        <nav aria-label="Page navigation">
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