var React                      = require('react');
var Router                     = require('../router');
var GraphStore                 = require('../stores/GraphStore');
var getCustomSlots             = require('../actions/RequestActions').getCustomSlots;
var removeDashboard            = require('../actions/RequestActions').removeDashboard;
var Graphs                     = require('./Custom_graphs.react');
var Modal                      = require('react-bootstrap').Modal;
var Preloader                  = require('./Preloader.react');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      slots:     '',
      showModal: false,
    };
  },

  close: function () {
    this.setState({
      showModal: false,
    });
  },

  execute: function () {
    this.setState({
      showModal: false,
    });
    removeDashboard(this.props.dashboard.dashboard);
  },

  componentDidMount: function () {
    getCustomSlots(this.props.dashboard.dashboard);
    GraphStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    GraphStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    getCustomSlots(this.props.dashboard.dashboard);
    if (this.isMounted()) {
      this.setState({
        slots: GraphStore.getCustomSlots(),
      });
    }
  },

  removeDashboard: function () {
    this.setState({showModal: true});

  },

  render: function () {
    if (!this.state.slots) {
      return (
        <Preloader/>
      );
    }
    return (
      <div className="default-dashboard centered">
        <Graphs dashboard={this.props.dashboard} slots={this.state.slots} />
        <a onClick={this.removeDashboard}>
          <i className="icon fa fa-trash-o red-text large"></i>
        </a>
        <Modal show={this.state.showModal} onHide={this.close} bsSize="small">
          <Modal.Body>
            <div className="row">
              <div className="col-xs-12 warn-message">
                <h1><span><i className="icon nb-warning yellow-text large"></i> Are you sure?</span></h1>
                <p>
                  <span> You are about to delete this dashboard</span>
                </p>
                <div className="med"></div>
                <div className="pull-right">
                  <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
                  <span className="action-button nubity-red" onClick={this.execute}>OK</span>
                </div>
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  },
});
