var React                         = require('react');
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var LinuxSetup                    = require('./Linux_setup.react');
var WindowsSetup                  = require('./Windows_setup.react');
var Preloader                     = require('./Preloader.react');
var getInstanceForMonitoring      = require('../actions/RequestActions').getInstanceForMonitoring;

module.exports = React.createClass({

  getInitialState: function () {
    var instanceForMonitoring = InfrastructureStore.instanceForMonitoring();
    var token = (
      <div id="loading-message" className="col-sm-offset-1">
        <div className="row centered"><Preloader size="mini"/></div>
      </div>
    );
    var report = (<div><Preloader size="mini" /> <p className="notice">Waiting for the first Nubity Agent report.</p></div>);
    if ('' != instanceForMonitoring && undefined !== instanceForMonitoring) {
      token = instanceForMonitoring.monitoring_agent.name;
    }
    return {
      instanceForMonitoring: instanceForMonitoring,
      token: token,
      report: report,
      tokenFlag: true,
      reportFlag: false,
      interval: true,
    };
  },

  componentDidMount: function () {
    var url = window.location.href;

    var position = url.indexOf('monitoring') + 11;
    var id = url.slice(position);
    if (-1 != url.indexOf('monitoring')) {
      getInstanceForMonitoring(id);
    }
    InfrastructureStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    for (var i = 1; 99999 > i; i++)
      window.clearInterval(i);
   
    InfrastructureStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      if (this.state.interval) {
        var loop = setInterval(function () {
          var url = window.location.href;
          var position = url.indexOf('monitoring') + 11;
          var id = url.slice(position);
          if (-1 != url.indexOf('monitoring')) {
            getInstanceForMonitoring(id);
          }
        }, 6000);
        this.setState({
          interval: false,
        });
      }
      
      var instanceForMonitoring = InfrastructureStore.instanceForMonitoring();

      if ('' != instanceForMonitoring && undefined !== instanceForMonitoring && this.state.tokenFlag) {
        token = instanceForMonitoring.monitoring_agent.name;
        this.setState({
          token: token,
          tokenFlag: false,
        });
      }

      if ('' != instanceForMonitoring && undefined !== instanceForMonitoring && !this.state.reportFlag) {
        if (instanceForMonitoring.monitoring_agent.is_active) {
          this.setState({
            reportFlag: true,
            report: 'Report done',
          });
          clearInterval(loop); 
        }
      }

      this.setState({
        instanceForMonitoring: instanceForMonitoring,
      });
    }
  },

  render: function () {
    return (
      <ol className="rounded-list">
        <li>
          <p className="rounded-list-title"><span>Download the Installation Script and run it with Root privileges </span></p>
          <a className="action-button nubity-green col-sm-offset-1" target="_blank" href="http://packages.nubity.com/installer/nubity-installer-last.sh">Download Installation Script</a>
        </li>
        <li>
          <p className="rounded-list-title"><span>Validation - Important!</span></p>
          <p className="col-sm-offset-1">During the installation enter the following Key to validate the agent:</p>
          <div className="col-sm-offset-1 centered">
            {this.state.token}
          </div>
        </li>
        <li>
          <p className="rounded-list-title"><span>Run it with root privileges</span></p>
          <p className="col-sm-offset-1">chmod +x nubity-installer.sh && ./nubity-installer.sh</p>
        </li>
        <li>
          <p className="rounded-list-title"><span>Monitor your server</span></p>
          <div className="col-sm-offset-1">
            <p className="notice">In a few minutes the Nubity Agent will send data to Nubity, and you can then create alerts and checks for your instance!</p>
            <div id="loading-message" className="col-sm-offset-1">
              {this.state.report}
            </div>
          </div>
        </li>
      </ol>
    );
  },
});
