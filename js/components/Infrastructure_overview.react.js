var React                      = require('react');
var ReactPropTypes             = React.PropTypes;
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var InfrastructureStore        = require('../stores/InfrastructureStore');

module.exports = React.createClass({

  getInitialState: function() {
    var overview = InfrastructureStore.getInfrastructureOverview();
    var arrayLength = overview.length;
    var rows = [];
    return {
      overview: overview,
      rows: rows,
    };
  },
  
  componentDidMount: function() {
    InfrastructureStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    InfrastructureStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    if (this.isMounted()) {
      var overview = InfrastructureStore.getInfrastructureOverview();
      this.setState({
        overview: overview.member,
      });
    }
  },

  render: function() {
    overview = this.state.overview;
    var rows = [];
    for (var key in overview) {
      rows.push(
        <tr>
          <td>
            <div className='status-container'>
              <i className='fa fa-server text-success' data-toggle='tooltip' data-original-title='Running'></i> 
              <div id='os' className='os'>
                <i id='linux' className='sprites small os-ubuntu'></i>
              </div> 
            </div>
          </td>
          <td>{overview[key].hostname}</td>
          <td>{overview[key].external_identifier}</td>
          <td>
            <i className='fa fa-play icon-margin' aria-hidden='true'></i> 
            <i className='fa fa-stop icon-margin' aria-hidden='true'></i> 
            <i className='fa fa-retweet icon-margin' aria-hidden='true'></i>
          </td>
          <td>{overview[key].memory} GB</td>
          <td>Ok</td>
          <td>
            <span className='label label-primary'>Configure</span>
          </td>
          <td>
            <span className='label label-danger'>Stop</span>
          </td>
        </tr>
      );
    }
    return (
      <div id="infrastructureTable">
        <table className='overview-table table table-striped table-condensed'>
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
      </div>
    );
  }
});
