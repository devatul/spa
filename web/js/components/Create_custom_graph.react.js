var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var GraphStore                 = require('../stores/GraphStore');
var CreateDashboardAction      = require('../actions/RequestActions').createDashboard;
var search                     = require('../actions/RequestActions').search;
var getAvailableGraphTypes     = require('../actions/RequestActions').getAvailableGraphTypes;
var Preloader                  = require('./Preloader.react');

class CreateCustomGraph extends React.Component {
  constructor(props) {
    super(props);
    var search = SessionStore.search();
    this.state = {
      search:     search,
      instances:  search.instances,
      clouds:     search.clouds,
      graphTypes: '',
      loading:    'hidden',
    };
    this._onChange = this._onChange.bind(this);
    this._selectInstance = this._selectInstance.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    if (SessionStore.isLoggedIn()) {
      search();
    } else {
      redirect('login');
    }
    SessionStore.addChangeListener(this._onChange);
    GraphStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
    GraphStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    var search = SessionStore.search();
    var graphTypes = GraphStore.getGraphTypes();
    this.setState({
      search:     search,
      instances:  search.instances,
      clouds:     search.clouds,
      graphTypes: graphTypes.member,
    });
    if (graphTypes) {
      $('#chartType').removeAttr('disabled');
      this.setState({
        loading: 'hidden',
      });
    }
  }

  _selectInstance() {
    getAvailableGraphTypes(this.refs.server.getDOMNode().value);
    this.setState({
      loading: 'widget-preloader-div',
    });
  }

  _onSubmit(e) {
    e.preventDefault();
    var server       = this.refs.server.getDOMNode().value;
    var chartType    = this.refs.chartType.getDOMNode().value;
    this.refs.server.getDOMNode().value = '';
    this.refs.chartType.getDOMNode().value = '';
    CreateDashboardAction('graph', server, chartType, this.props.dashboardId, this.props.position);
  }

  render() {
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
        <div className={this.state.loading}>
          <Preloader preloaderClass="widget-preloader" />
        </div>
        <div>
          <div className="title-div">
            <p className="widget-p">Create a graph</p>
          </div>
          <select className="hide-it form-control select-margin" id="widgetType" name="widgetType" ref="widgetType">
            <option>Select Widget Type</option>
            <option>2</option>
          </select>
          <select className="form-control select-margin" id="server" name="server" ref="server" onChange={this._selectInstance}>
            <option>Select an instance</option>
            {instanceOptions}
          </select>
          <select className="form-control select-margin" id="chartType" name="chartType" ref="chartType" disabled required>
            <option>Select Chart Type</option>
            {graphTypeOptions}
          </select>
          <button type="submit" className="action-button nubity-blue">Create</button>
        </div>
      </form>
    );
  }
}

module.exports = CreateCustomGraph;
