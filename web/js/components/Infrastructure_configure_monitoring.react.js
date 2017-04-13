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
    var url = window.location.href.split('#');
    var position = url[1].indexOf('configure') + 10;
    var id = url[1].slice(position);
    return {
      instanceConfiguration: instanceConfiguration,
      idInstance: id,
    };
  },

  componentDidMount: function () {
    if (SessionStore.isLoggedIn()) {
      var url = window.location.href.split('#');
      var position = url[1].indexOf('configure') + 10;
      var id = url[1].slice(position);
      getInstanceConfiguration(id);
    } else {
      redirect('login');
    }
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

  _updatePage: function (newSection) {
    var hash = window.location.href.split('/configure');
    var id = hash[1].split('#');
    window.location.href = hash[0] + '/configure' + id[0] + newSection;
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

    var hash = window.location.href.split('/configure');
    var id = hash[1].split('#');
    var section;

    if (undefined === id[1]) {
      section = '';
    } else {
      section = id[1];
    }
    var _SELF = this;

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Configure monitoring for {this.state.instanceConfiguration.hostname}</h2>
        </div>
        <div className="large-section-tabs">
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className={'overview' == section || '' == section ? 'active' : ''}>
              <a className="grey-color" data-toggle="tab" href="#overview" onClick={function () {_SELF._updatePage('#overview');}}>
                <i className="icon nb-eye small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Overview</span>
              </a>
            </li>
            <li role="presentation" className={'basic-systems' == section ? 'active' : ''}>
              <a className="grey-color" data-toggle="tab" href="#basicSystem" onClick={function () {_SELF._updatePage('#basic-systems');}}>
                <i className="icon nb-window small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Basic Systems</span>
              </a>
            </li>
            <li role="presentation" className={'web-servers' == section ? 'active' : ''}>
              <a className="grey-color" data-toggle="tab" href="#webServer" onClick={function () {_SELF._updatePage('#web-servers');}}>
                <i className="icon nb-servers small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Web servers</span>
              </a>
            </li>
            <li role="presentation" className={'app-servers' == section ? 'active' : ''}>
              <a className="grey-color" data-toggle="tab" href="#appServer" onClick={function () {_SELF._updatePage('#app-servers');}}>
                <i className="icon nb-servers-apps small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> App servers</span>
              </a>
            </li>
            <li role="presentation" className={'databases' == section ? 'active' : ''}>
              <a className="grey-color" data-toggle="tab" href="#databases" onClick={function () {_SELF._updatePage('#databases');}}>
                <i className="icon nb-databases small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Databases</span>
              </a>
            </li>
            <li role="presentation" className={'caching' == section ? 'active' : ''}>
              <a className="grey-color" data-toggle="tab" href="#caching" onClick={function () {_SELF._updatePage('#caching');}}>
                <i className="icon nb-code small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Caching</span>
              </a>
            </li>
            <li role="presentation" className={'websites' == section ? 'active' : ''}>
              <a className="grey-color" data-toggle="tab" href="#website" onClick={function () {_SELF._updatePage('#websites');}}>
                <i className="icon nb-code small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Websites</span>
              </a>
            </li>
            <li role="presentation" className={'services' == section ? 'active' : ''}>
              <a className="grey-color" data-toggle="tab" href="#service" onClick={function () {_SELF._updatePage('#services');}}>
                <i className="icon nb-code small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Services</span>
              </a>
            </li>
            <li role="presentation" className={'web-apps' == section ? 'active' : ''}>
              <a className="grey-color" data-toggle="tab" href="#webApp" onClick={function () {_SELF._updatePage('#web-apps');}}>
                <i className="icon nb-webapps small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Web apps</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="overview" className={'tab-pane fade ' + ('overview' == section || '' == section ? 'in active' : '')}>
            <PluginsTable plugins={installedTemplates} idInstance={this.state.idInstance}/>
          </div>
          <div id="basicSystem" className={'tab-pane fade ' + ('basic-systems' == section ? 'in active' : '')}>
            <GroupView templates={basicSystems} idInstance={this.state.idInstance}/>
          </div>
          <div id="webServer" className={'tab-pane fade ' + ('web-servers' == section ? 'in active' : '')}>
            <GroupView templates={webServers} idInstance={this.state.idInstance}/>
          </div>
          <div id="appServer" className={'tab-pane fade ' + ('app-servers' == section ? 'in active' : '')}>
            <GroupView templates={appServers} idInstance={this.state.idInstance}/>
          </div>
          <div id="databases" className={'tab-pane fade ' + ('databases' == section ? 'in active' : '')}>
            <GroupView templates={databases} idInstance={this.state.idInstance}/>
          </div>
          <div id="caching" className={'tab-pane fade ' + ('caching' == section ? 'in active' : '')}>
            <GroupView templates={cachings} idInstance={this.state.idInstance}/>
          </div>
          <div id="website" className={'tab-pane fade ' + ('websites' == section ? 'in active' : '')}>
            <GroupView templates={websites} idInstance={this.state.idInstance}/>
          </div>
          <div id="service" className={'tab-pane fade ' + ('services' == section ? 'in active' : '')}>
            <GroupView templates={services} idInstance={this.state.idInstance}/>
          </div>
          <div id="webApp" className={'tab-pane fade ' + ('web-apps' == section ? 'in active' : '')}>
            <GroupView templates={webApps} idInstance={this.state.idInstance}/>
          </div>
        </div>
      </div>
    );
  },
});
