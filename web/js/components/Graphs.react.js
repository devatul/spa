var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var getDashboard               = require('../actions/RequestActions').getDashboard;
var deleteSlot                 = require('../actions/RequestActions').deleteSlot;
var SessionStore               = require('../stores/SessionStore');
var GraphStore                 = require('../stores/GraphStore');
var CreateGraph                = require('./Create_graph.react');
var Graph                      = require('./Graph.react');

module.exports = React.createClass({

  getInitialState: function () {
    var dashboard = GraphStore.getDashboard();
    return {
      dashboard: dashboard,
    };
  },

  componentDidMount: function () {
    GraphStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    GraphStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var dashboard = GraphStore.getDashboard();
      this.setState({
        dashboard: dashboard,
      });
    }
  },

  _deleteGraph: function (dashboard) {
    deleteSlot(dashboard.slot);
  },

  render: function () {
    var dashboard = this.state.dashboard;
    var allGraphs = [];
    var position  = 1;

    if (undefined != dashboard) {
      var name = '';

      for (var key in dashboard) {
        name = 'container' + key;
        allGraphs.push(
          <div clasName="col-xs-12 col-md-6 col-lg-6 nubity-blue">
            <button type="button" className="close" aria-label="Close" onClick={this._deleteGraph.bind(this, dashboard[key])}>
              <span aria-hidden="true">&times;</span>
            </button>
            <Graph graph={dashboard[key]} name={name} dashboardId={localStorage.getItem('dashboardId')}/>
          </div>
        );
        position = key + 2; 
      }
    }

    return (
      <div clasName="row">
        {allGraphs}
        <div clasName="col-xs-12 col-md-6 col-lg-6">
          <CreateGraph position={position}/>
        </div>
      </div> 
    );
  }
    
});
