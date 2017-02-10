var React                         = require('react');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var getInstanceConfiguration      = require('../actions/RequestActions').getInstanceConfiguration;
var PluginsTable                  = require('./PluginsTable.react');

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
              <a className="grey-color" data-toggle="tab" href="#windows">
                <span className="hidden-xs hidden-sm"> Databases</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="overview" className="tab-pane fade in active">
            <PluginsTable plugins={this.state.instanceConfiguration.templates} idInstance={this.state.idInstance}/>
          </div>
          <div id="windows" className="tab-pane fade">
          </div>
        </div>
      </div>
    );
  },
});
