var React                         = require('react');
var ReactPropTypes                = React.PropTypes;
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var getInfrastructurePublicCloud  = require('../actions/RequestActions').getInfrastructurePublicCloud;

module.exports = React.createClass({

  getInitialState: function () {
    var publicCloud = InfrastructureStore.getInfrastructurePublicCloud();
    var arrayLength = publicCloud.length;
    var rows = [];
    return {
      publicCloud: publicCloud,
      rows: rows,
      totalItems: publicCloud.totalItems,
    };
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
      });
    }
  },

  _newPage: function (page) {
    getInfrastructurePublicCloud(page);
  },

  render: function () {
    var publicCloud = this.state.publicCloud;
    var totalItems = this.state.totalItems;
    var pages = Math.ceil(parseInt(totalItems)/10);

    var navpages = [];
    for (var key = 0 ; key < pages ; key++) {
      var page = key + 1;
      var send = page.toString();
      navpages[navpages.length] = <li><a onClick={this._newPage.bind(this, page)}>{page}</a></li>;
    }

    var rows = [];
    for (var key in publicCloud) {
      rows.push(
        <tr key={key}>
          <td>
            <div className="status-container">
              <i className="fa fa-server text-success" data-toggle="tooltip" data-original-title="Running"></i> 
              <div id="os" className="os">
                <i id="linux" className="sprites small os-ubuntu"></i>
              </div> 
            </div>
          </td>
          <td>{publicCloud[key].hostname}</td>
          <td>{publicCloud[key].external_identifier}</td>
          <td>
            <i className="fa fa-play icon-margin" aria-hidden="true"></i> 
            <i className="fa fa-stop icon-margin" aria-hidden="true"></i> 
            <i className="fa fa-retweet icon-margin" aria-hidden="true"></i>
          </td>
          <td>{publicCloud[key].memory/1024} GB</td>
          <td>Ok</td>
          <td>
            <span className="label label-primary">Configure</span>
          </td>
          <td>
            <span className="label label-danger">Stop</span>
          </td>
        </tr>
      );
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
