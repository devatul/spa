var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var getDashboard               = require('../actions/RequestActions').getDashboard;
var deleteSlot                 = require('../actions/RequestActions').deleteSlot;
var SessionStore               = require('../stores/SessionStore');
var GraphStore                 = require('../stores/GraphStore');
var CreateGraph                = require('./Create_custom_graph.react');
var Graph                      = require('./Graph.react');
var Modal                      = require('react-bootstrap').Modal;
var moment                     = require('moment');

module.exports = React.createClass({
  getInitialState: function () {
    var allGraphs = [];
    for (var i = 0 ; 9 > i ; i++) {
      allGraphs.push(
        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <div className="widget create">
            <CreateGraph position={i + 1} dashboardId={this.props.dashboard.dashboard} />
          </div>
        </div>
      );
    }
    return {
      allGraphs: allGraphs,
      showModal: false,
    };
  },

  componentDidMount: function () {
    var allGraphs = [];
    for (var i = 0 ; 9 > i ; i++) {
      allGraphs.push(
        <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
          <div className="widget create">
            <CreateGraph position={i + 1} dashboardId={this.props.dashboard.dashboard} />
          </div>
        </div>
      );
    }
    if (this.props.slots) {
      var name = '';
      for (var key in this.props.slots) {
        name = 'container' + key;
        allGraphs[parseInt(this.props.slots[key].position) - 1] = (
          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div className="widget" id="widget">
              <button type="button" className="modal-close" aria-label="Close" onClick={this._deleteGraph.bind(this, this.props.slots[key])}>
                <span aria-hidden="true">&times;</span>
              </button>
              <button type="button" className="pull-right open-modal-graph" onClick={this._modalGraph.bind(this, this.props.slots[key])}>
                <i className="fa fa-arrows-alt" aria-hidden="true"></i>
              </button>
              <div className="valign-wrapper allHeight">
                <Graph graph={this.props.slots[key]} name={name} dashboardId={this.props.dashboard.dashboard} />
              </div>
            </div>
          </div>
        );
      }
    }
    this.setState({allGraphs: allGraphs});
  },

  componentWillReceiveProps: function (nextProps) {
    var allGraphs;
    var i;
    if (nextProps.slots && 0 < nextProps.slots.length) {
      var name = '';
      allGraphs = [];
      for (i = 0 ; 9 > i ; i++) {
        allGraphs.push(
          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div className="widget create">
              <CreateGraph position={i + 1} dashboardId={this.props.dashboard.dashboard} />
            </div>
          </div>
        );
      }
      for (var key in nextProps.slots) {
        name = 'container' + key;
        allGraphs[parseInt(nextProps.slots[key].position) - 1] = (
          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div className="widget" id="widget">
              <button type="button" className="modal-close" aria-label="Close" onClick={this._deleteGraph.bind(this, nextProps.slots[key])}>
                <span aria-hidden="true">&times;</span>
              </button>
              <button type="button" className="pull-right open-modal-graph" onClick={this._modalGraph.bind(this, nextProps.slots[key])}>
                <i className="fa fa-arrows-alt" aria-hidden="true"></i>
              </button>
              <div className="valign-wrapper allHeight">
                <Graph graph={nextProps.slots[key]} name={name} dashboardId={nextProps.dashboard.dashboard} />
              </div>
            </div>
          </div>
        );
      }
      this.setState({allGraphs: allGraphs});
    } else {
      allGraphs = [];
      for (i = 0 ; 9 > i ; i++) {
        allGraphs.push(
          <div className="col-lg-4 col-md-4 col-sm-12 col-xs-12">
            <div className="widget create">
              <CreateGraph position={i + 1} dashboardId={this.props.dashboard.dashboard} />
            </div>
          </div>
        );
      }
      this.setState({allGraphs: allGraphs});
    }
  },

  _deleteGraph: function (dashboard) {
    deleteSlot(dashboard.slot);
  },

  _modalGraph: function (dashboard) {
    var name = 'container' + moment().format('MMMMDoYYYYh:mm:ss');
    var graph = (<Graph graph={dashboard} name={name} dashboardId={dashboard.dashboard} />);
    this.setState({
      showModal:          true,
      graphToShowInModal: graph,
    });
  },

  close: function () {
    this.setState({
      showModal: false,
    });
  },

  render: function () {

    return (
      <div className="container">
        <div className="row">
          {this.state.allGraphs}
          <Modal show={this.state.showModal} onHide={this.close} bsSize="large">
            <Modal.Header closeButton>
              {this.state.graphToShowInModal}
            </Modal.Header>
          </Modal>
        </div>
      </div>
    );
  },
});
