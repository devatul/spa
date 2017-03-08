var React                         = require('react');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var getInstanceConfiguration      = require('../actions/RequestActions').getInstanceConfiguration;
var PluginsTable                  = require('./PluginsTable.react');
var GroupView                     = require('./Databases_tabs.react');
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
      return (<div></div>);
    }
    var installedTemplates = [];
    var basicSystems = [];
    var webServers = [];
    var appServers = [];
    var databases = [];
    var cachings = [];
    var websites = [];
    var services = [];
    var webApps = [];

    if (this.state.instanceConfiguration) {
      for (var key in this.state.instanceConfiguration.templates) {
        if (this.state.instanceConfiguration.templates[key].is_installed) {
          installedTemplates.push(this.state.instanceConfiguration.templates[key]);
        }
        switch (this.state.instanceConfiguration.templates[key].classification) {
          case 'basic_system':
            basicSystems.push(this.state.instanceConfiguration.templates[key]);
            break;
          case 'web_server':
            webServers.push(this.state.instanceConfiguration.templates[key]);
            break;
          case 'app_server':
            appServers.push(this.state.instanceConfiguration.templates[key]);
            break;
          case 'database':
            databases.push(this.state.instanceConfiguration.templates[key]);
            break;
          case 'caching':
            cachings.push(this.state.instanceConfiguration.templates[key]);
            break;
          case 'website':
            websites.push(this.state.instanceConfiguration.templates[key]);
            break;
          case 'service':
            services.push(this.state.instanceConfiguration.templates[key]);
            break;
          case 'web_app':
            webApps.push(this.state.instanceConfiguration.templates[key]);
            break;
        }
      }
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
              <a className="grey-color" data-toggle="tab" href="#basicSystem">
                <span className="hidden-xs hidden-sm"> Basic Systems</span>
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#webServer">
                <span className="hidden-xs hidden-sm"> Web servers</span>
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#appServer">
                <span className="hidden-xs hidden-sm"> App servers</span>
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#databases">
                <span className="hidden-xs hidden-sm"> Databases</span>
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#caching">
                <span className="hidden-xs hidden-sm"> Caching</span>
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#website">
                <span className="hidden-xs hidden-sm"> Websites</span>
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#service">
                <span className="hidden-xs hidden-sm"> Services</span>
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#webApp">
                <span className="hidden-xs hidden-sm"> Web apps</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="overview" className="tab-pane fade in active">
            <PluginsTable plugins={installedTemplates} idInstance={this.state.idInstance}/>
          </div>
          <div id="basicSystem" className="tab-pane fade">
            <GroupView templates={basicSystems} idInstance={this.state.idInstance}/>
          </div>
          <div id="webServer" className="tab-pane fade">
            <GroupView templates={webServers} idInstance={this.state.idInstance}/>
          </div>
          <div id="appServer" className="tab-pane fade">
            <GroupView templates={appServers} idInstance={this.state.idInstance}/>
          </div>
          <div id="databases" className="tab-pane fade">
            <GroupView templates={databases} idInstance={this.state.idInstance}/>
          </div>
          <div id="caching" className="tab-pane fade">
            <GroupView templates={cachings} idInstance={this.state.idInstance}/>
          </div>
          <div id="website" className="tab-pane fade">
            <GroupView templates={websites} idInstance={this.state.idInstance}/>
          </div>
          <div id="service" className="tab-pane fade">
            <GroupView templates={services} idInstance={this.state.idInstance}/>
          </div>
          <div id="webApp" className="tab-pane fade">
            <GroupView templates={webApps} idInstance={this.state.idInstance}/>
          </div>
        </div>
      </div>
    );
  },
});
