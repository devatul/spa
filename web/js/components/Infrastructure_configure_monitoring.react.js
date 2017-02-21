var React                         = require('react');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var getInstanceConfiguration      = require('../actions/RequestActions').getInstanceConfiguration;
var PluginsTable                  = require('./PluginsTable.react');
var Databases                     = require('./Databases.react');
var SessionStore                  = require('../stores/SessionStore');
var redirect                      = require('../actions/RouteActions').redirect;

module.exports = React.createClass({

  getInitialState: function () {
    var instanceConfiguration = InfrastructureStore.instanceConfiguration();
    var url = window.location.href;
    var position = url.indexOf('configure') + 10;
    var id = url.slice(position);
    return {
      instanceConfiguration: instanceConfiguration,
      idInstance: id,
    };
  },

  componentWillMount: function () {
    if (!SessionStore.isLoggedIn()) {
      redirect('login');
    }
  },

  componentDidMount: function () {
    var url = window.location.href;
    var position = url.indexOf('configure') + 10;
    var id = url.slice(position);
    getInstanceConfiguration(id);
    InfrastructureStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    InfrastructureStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var instanceConfiguration = InfrastructureStore.instanceConfiguration();
      this.setState({
        instanceConfiguration: instanceConfiguration,
      });
    }
  },

  render: function () {
    if (!SessionStore.isLoggedIn()) {
      return(<div></div>)
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Configure monitoring</h2>
        </div>
        <div>
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className="active">
              <a className="grey-color" data-toggle="tab" href="#overview">
                <i className="icon nb-eye small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Overview</span>
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#databases">
                <span className="hidden-xs hidden-sm"> Databases</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="overview" className="tab-pane fade in active">
            <PluginsTable plugins={this.state.instanceConfiguration.templates} idInstance={this.state.idInstance}/>
          </div>
          <div id="databases" className="tab-pane fade">
            <Databases plugins={this.state.instanceConfiguration.templates} idInstance={this.state.idInstance}/>
          </div>
        </div>
      </div>
    );
  },
});
