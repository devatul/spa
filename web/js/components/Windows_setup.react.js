var React                         = require('react');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var Preloader                     = require('./Preloader.react');
var OneLiner                      = require('./One_liner.react');

class WindowsSetup extends React.Component {
  constructor(props) {
    super(props);
    var instanceForMonitoring = InfrastructureStore.instanceForMonitoring();
    var token = (
      <div id="loading-message" className="col-sm-offset-1">
        <div className="row centered"><Preloader size="mini" /></div>
      </div>
    );
    var report = (
      <div className="report-div">
        <p className="notice">Wait for the first Nubity agent report</p>
        <Preloader size="white-medium" />
      </div>
    );
    if ('' != instanceForMonitoring && undefined !== instanceForMonitoring) {
      token = instanceForMonitoring.monitoring_agent.name;
    }
    this.state = {
      instanceForMonitoring: instanceForMonitoring,
      token:                 token,
      report:                report,
      tokenFlag:             true,
      reportFlag:            false,
    };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    InfrastructureStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    InfrastructureStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    var instanceForMonitoring = InfrastructureStore.instanceForMonitoring();
    if ('' != instanceForMonitoring && undefined !== instanceForMonitoring && this.state.tokenFlag) {
      var token = instanceForMonitoring.monitoring_agent.name;
      this.setState({
        token:     token,
        tokenFlag: false,
      });
    }

    if ('' != instanceForMonitoring && undefined !== instanceForMonitoring && !this.state.reportFlag) {
      if (instanceForMonitoring.monitoring_agent.isActive) {
        var url      = window.location.href;
        var position = url.split('#');
        var url2     = position[1].split('/');
        var id       = url2[2];
        var report = (
          <div className="report-div report-success-div">
            <p className="notice report-success-p">Nubity agent has been successfully installed at your instance, now is time to <Link className="action-button nubity-blue" to={`/infrastructure/${id}/monitoring/configure`}>Configure it</Link> under your own needs.</p>
            <i className="icon nb-thick-circle medium light-green-text" aria-hidden="true"></i>
          </div>
        );
        this.setState({
          reportFlag: true,
          report:     report,
        });
      }
    }

    this.setState({
      instanceForMonitoring: instanceForMonitoring,
    });
  }

  render() {
    return (
      <ol className="rounded-list">
        <li className="li100">
          <p className="rounded-list-title margin-li"><span>In order to start the health check on your instance, donwload the installer that matches your architecture and execute it with elevated privlegies at the instance you want to monitor:</span></p>
          <a className="action-button nubity-blue windows-buttons" target="_blank" href="http://packages.nubity.com/windows/x64/nubity-agent-x64-last.exe">Download installer for 64 bits</a>
          <a className="action-button nubity-blue windows-buttons" target="_blank" href="http://packages.nubity.com/windows/x86/nubity-agent-x86-last.exe">Download installer for 32 bits</a>
        </li>
        <li className="li100">
          <p className="rounded-list-title"><span>During the installation enter the following Key to validate the agent:</span></p>
          <div className="centered">
            <OneLiner text={this.state.token} clickToken={this.clickToken} />
          </div>
        </li>
        <li>
          <p className="rounded-list-title"><span>When the Nubity agent is installed, in a few minutes it will start sending data and you will be able to configure alerts and checks for your instance:</span></p>
          <div id="loading-message">
            {this.state.report}
          </div>
        </li>
      </ol>
    );
  }
}

module.exports = WindowsSetup;
