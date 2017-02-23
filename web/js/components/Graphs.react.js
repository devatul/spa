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

    allGraphs[0] = (
      <div className="col-md-6 col-sm-12 col-xs-12">
        <div className="widget">
          <CreateGraph position={1}/>
        </div>
      </div>
    );
    allGraphs[1] = (
      <div className="col-md-6 col-sm-12 col-xs-12">
        <div className="widget">
          <CreateGraph position={2}/>
        </div>
      </div>
    );
    allGraphs[2] = (
      <div className="col-md-6 col-sm-12 col-xs-12">
        <div className="widget">
          <CreateGraph position={3}/>
        </div>
      </div>
    );
    allGraphs[3] = (
      <div className="col-md-6 col-sm-12 col-xs-12">
        <div className="widget">
          <CreateGraph position={4}/>
        </div>
      </div>
    );

    if (undefined != dashboard) {
      var name = '';

      for (var key in dashboard) {
        name = 'container' + key;
        allGraphs[parseInt(dashboard[key].position) - 1] = (
          <div className="col-md-6 col-sm-12 col-xs-12">
            <div className="widget" id="widget">
              <button type="button" className="modal-close" aria-label="Close" onClick={this._deleteGraph.bind(this, dashboard[key])}>
                <span aria-hidden="true">&times;</span>
              </button>
              <div className="valign-wrapper allHeight">
                <Graph graph={dashboard[key]} name={name} dashboardId={localStorage.getItem('dashboardId')}/>
              </div>
            </div>
          </div>
        );
      }
    }

    return (
      <div className="row">
        {allGraphs} 
      </div>
    );
  },
});
