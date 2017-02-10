var React                         = require('react');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var Preloader                     = require('./Preloader.react');

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
    };
  },

  componentDidMount: function () {
    InfrastructureStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    InfrastructureStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var instanceForMonitoring = InfrastructureStore.instanceForMonitoring();
      if ('' != instanceForMonitoring && undefined !== instanceForMonitoring && this.state.tokenFlag) {
        token = instanceForMonitoring.monitoring_agent.name;
        this.setState({
          token: token,
          tokenFlag: false,
        });
      }

      if ('' != instanceForMonitoring && undefined !== instanceForMonitoring && !this.state.reportFlag) {
        if (instanceForMonitoring.monitoring_agent.isActive) {
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
          <a className="action-button nubity-green col-sm-offset-1" target="_blank" href="http://packages.nubity.com/windows/x64/nubity-agent-x64-last.exe">Download Installation Script 64 bits</a>
          <a className="action-button nubity-green col-sm-offset-1" target="_blank" href="http://packages.nubity.com/windows/x86/nubity-agent-x86-last.exe">Download Installation Script 32 bits</a>
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
