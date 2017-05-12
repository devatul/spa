var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var getDashboard               = require('../actions/RequestActions').getDashboard;
var deleteSlot                 = require('../actions/RequestActions').deleteSlot;
var SessionStore               = require('../stores/SessionStore');
var Preloader                  = require('./Preloader.react');
var GraphStore                 = require('../stores/GraphStore');
var CreateGraph                = require('./Create_graph.react');
var Graph                      = require('./Graph.react');
var Modal                      = require('react-bootstrap').Modal;
var moment                     = require('moment');

class Graphs extends React.Component {
  constructor(props) {
    super(props);
    var dashboard = GraphStore.getDashboard();
    this.state = {
      dashboard:          dashboard,
      showModal:          false,
      graphToShowInModal: '',
    };
    this._onChange = this._onChange.bind(this);
    this.close = this.close.bind(this);
    this._deleteGraph = this._deleteGraph.bind(this);
    this._modalGraph = this._modalGraph.bind(this);
  }

  componentDidMount() {
    GraphStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    GraphStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    var dashboard = GraphStore.getDashboard();
    this.setState({
      dashboard: dashboard,
    });
  }

  _deleteGraph(dashboard) {
    deleteSlot(dashboard.slot);
  }

  _modalGraph(dashboard) {
    var name = 'container' + moment().format('MMMMDoYYYYh:mm:ss');
    var graph = (<Graph graph={dashboard} name={name} dashboardId={localStorage.getItem('dashboardId')} />);
    this.setState({
      showModal:          true,
      graphToShowInModal: graph,
    });
  }

  close() {
    this.setState({
      showModal: false,
    });
  }

  render() {
    var dashboard = this.state.dashboard;
    var allGraphs = [];

    allGraphs[0] = (
      <div key={0} className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <div className="widget create valign-wrapper">
          <CreateGraph position={1} />
        </div>
      </div>
    );
    allGraphs[1] = (
      <div key={1} className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <div className="widget create valign-wrapper">
          <CreateGraph position={2} />
        </div>
      </div>
    );
    allGraphs[2] = (
      <div key={2} className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
        <div className="widget create valign-wrapper">
          <CreateGraph position={3} />
        </div>
      </div>
    );

    if (undefined != dashboard) {
      var name = '';

      for (var key in dashboard) {
        name = 'container' + key;
        allGraphs[parseInt(dashboard[key].position) - 1] = (
          <div key={parseInt(dashboard[key].position) - 1} className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div className="widget" id="widget">
              <button type="button" className="pull-left open-modal-graph" onClick={this._deleteGraph.bind(this, dashboard[key])}>
                <i className="icon nb-close-circle light-grey-text" aria-hidden="true" ></i>
              </button>
              <button type="button" className="pull-right open-modal-graph" onClick={this._modalGraph.bind(this, dashboard[key])}>
                <i className="icon nb-width-circle light-grey-text" aria-hidden="true"></i>
              </button>
              <div className="valign-wrapper allHeight">
                <Graph graph={dashboard[key]} name={name} dashboardId={localStorage.getItem('dashboardId')} />
              </div>
            </div>
          </div>
        );
      }
      allGraphs = allGraphs.slice(0, 3);
    }
    if (!dashboard) {
      return (<Preloader />);
    }
    return (
      <div className="row">
        {allGraphs}
        <Modal show={this.state.showModal} onHide={this.close} bsSize="large">
          <Modal.Header closeButton>
            {this.state.graphToShowInModal}
          </Modal.Header>
        </Modal>
      </div>
    );
  }
}

module.exports = Graphs;
