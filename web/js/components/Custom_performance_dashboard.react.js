var React                      = require('react');
var Router                     = require('../router');
var GraphStore                 = require('../stores/GraphStore');
var getCustomSlots             = require('../actions/RequestActions').getCustomSlots;
var Graphs                     = require('./Custom_graphs.react');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      slots: '',
    };
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
  

  render: function () {
    return (
      <div className="default-dashboard">
        <Graphs dashboard={this.props.dashboard} slots={this.state.slots}/>
      </div>
    );
  },
});
