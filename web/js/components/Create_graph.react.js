var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var GraphStore                 = require('../stores/GraphStore');
var CreateDashboardAction      = require('../actions/RequestActions').createDashboard;
var search                     = require('../actions/RequestActions').search;
var getAvailableGraphTypes     = require('../actions/RequestActions').getAvailableGraphTypes;
var Preloader                  = require('./Preloader.react');

class CreateGraph extends React.Component {
  constructor(props) {
    super(props);
    var search = SessionStore.search();
    this.state = {
      search:     search,
      instances:  search.instances,
      clouds:     search.clouds,
      graphTypes: '',
      loading:    'hidden',
      bloqued:    'true',
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
    this.setState({mounted: true});
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
    GraphStore.removeChangeListener(this._onChange);
    this.setState({mounted: false});
  }

  _onChange() {
    if (this.state.mounted) {
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
          bloqued: 'false',
        });
      }
    }
  }

  _selectInstance() {
    getAvailableGraphTypes(this.refs.server.value);
    this.setState({
      loading: 'widget-preloader-div',
    });
  }

  _onSubmit(e) {
    e.preventDefault();
    var server       = this.refs.server.value;
    var chartType    = this.refs.chartType.value;
    this.refs.server.value = '';
    this.refs.chartType.value = '';
    CreateDashboardAction('graph', server, chartType, localStorage.getItem('dashboardId'), this.props.position);
  }

  render() {
    var instances = this.state.instances;
    var rows = [];
    for (var key in instances) {
      rows.push(<option key={key} value={instances[key].instance} >{instances[key].hostname}</option>);
    }

    var graphTypes = this.state.graphTypes;
    var graphRows = [];
    for (key in graphTypes) {
      graphRows.push(<option key={key} value={graphTypes[key].graph} >{graphTypes[key].name}</option>);
    }

    return (
      <form onSubmit={this._onSubmit} className="valign">
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
          <select className="form-control select-margin" id="server" name="server" ref="server" onChange={this._selectInstance} required>
            <option>Select an instance</option>
            {rows}
          </select>
          <select className="form-control select-margin" id="chartType" name="chartType" ref="chartType" disabled required>
            <option>Select Chart Type</option>
            {graphRows}
          </select>
          <button type="submit" className="action-button nubity-blue">Create</button>
        </div>
      </form>
    );
  }
}

module.exports = CreateGraph;
