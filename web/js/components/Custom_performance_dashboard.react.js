var React                      = require('react');
var GraphStore                 = require('../stores/GraphStore');
var getCustomSlots             = require('../actions/RequestActions').getCustomSlots;
var removeDashboard            = require('../actions/RequestActions').removeDashboard;
var Graphs                     = require('./Custom_graphs.react');
var Modal                      = require('react-bootstrap').Modal;
var Preloader                  = require('./Preloader.react');

class CustomPerformanceDashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      slots:     '',
      showModal: false,
    };
    this._onChange = this._onChange.bind(this);
    this.close = this.close.bind(this);
    this.execute = this.execute.bind(this);
    this.removeDashboard = this.removeDashboard.bind(this);
  }

  close() {
    this.setState({
      showModal: false,
    });
  }

  execute() {
    this.setState({
      showModal: false,
    });
    removeDashboard(this.props.dashboard.dashboard);
  }

  componentDidMount() {
    getCustomSlots(this.props.dashboard.dashboard);
    GraphStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    GraphStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      slots: GraphStore.getCustomSlots(),
    });
  }

  removeDashboard() {
    this.setState({showModal: true});

  }

  render() {
    if (!this.state.slots) {
      return (
        <Preloader />
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
  }
}

module.exports = CustomPerformanceDashboard;
