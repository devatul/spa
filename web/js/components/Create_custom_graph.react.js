var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var GraphStore                 = require('../stores/GraphStore');
var CreateDashboardAction      = require('../actions/RequestActions').createDashboard;
var search                     = require('../actions/RequestActions').search;
var getAvailableGraphTypes     = require('../actions/RequestActions').getAvailableGraphTypes;

module.exports = React.createClass({
  getInitialState: function () {
    var search = SessionStore.search();
    return {
      search:    search,
      instances: search.instances,
      clouds:    search.clouds,
    };
  },

  componentDidMount: function () {
    if (SessionStore.isLoggedIn()) {
      search();
    } else {
      redirect('login');
    }
    SessionStore.addChangeListener(this._onChange);
    GraphStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
    GraphStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var search = SessionStore.search();
      var graphTypes = GraphStore.getGraphTypes();
      this.setState({
        search:     search,
        instances:  search.instances,
        clouds:     search.clouds,
        graphTypes: graphTypes.member,
      });
    }
  },

  _selectInstance: function () {
    getAvailableGraphTypes(this.refs.server.getDOMNode().value);
  },

  _onSubmit: function (e) {
    e.preventDefault();
    var server       = this.refs.server.getDOMNode().value;
    var chartType    = this.refs.chartType.getDOMNode().value;
    this.refs.server.getDOMNode().value = '';
    this.refs.chartType.getDOMNode().value = '';
    CreateDashboardAction('graph', server, chartType, this.props.dashboardId, this.props.position);
  },

  render: function () {
    var instances = this.state.instances;

    var instanceOptions = [];
    for (var key in instances) {
      instanceOptions.push(<option value={instances[key].instance} >{instances[key].hostname}</option>);
    }

    var graphTypes = this.state.graphTypes;
    var graphTypeOptions = [];
    for (key in graphTypes) {
      graphTypeOptions.push(<option value={graphTypes[key].graph} >{graphTypes[key].name}</option>);
    }

    return (
      <form onSubmit={this._onSubmit}>
        <div className="title-div">
          <p className="widget-p">Widget</p>
        </div>
        <select className="hide-it form-control select-margin" id="widgetType" name="widgetType" ref="widgetType">
          <option>Select Widget Type</option>
          <option>2</option>
        </select>
        <select className="form-control select-margin" id="server" name="server" ref="server" onChange={this._selectInstance}>
          <option>Select an instance</option>
          {instanceOptions}
        </select>
        <select className="form-control select-margin" id="chartType" name="chartType" ref="chartType">
          <option>Select Chart Type</option>
          {graphTypeOptions}
        </select>
        <button type="submit" className="action-button nubity-blue">Save</button>
      </form>
    );
  },
});
