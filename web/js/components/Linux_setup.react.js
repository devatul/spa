var React                         = require('react');
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var Preloader                     = require('./Preloader.react');
var getInstanceForMonitoring      = require('../actions/RequestActions').getInstanceForMonitoring;
var OneLiner                      = require('./One_liner.react');
var Link                          = require('react-router').Link;

class LinuxSetup extends React.Component {
  constructor(props) {
    super(props);
    var instanceForMonitoring = InfrastructureStore.instanceForMonitoring();
    var token = (
      <div id="loading-message">
        <div className="row centered"><Preloader size="mini" /></div>
      </div>
    );
    if ('' != instanceForMonitoring && undefined !== instanceForMonitoring) {
      token = instanceForMonitoring.monitoring_agent.name;
    }
    this.state = {
      instanceForMonitoring: instanceForMonitoring,
      token:                 token,
      report:                '',
      tokenFlag:             true,
      reportFlag:            false,
      interval:              true,
    };
    this._onChange = this._onChange.bind(this);
    this.componentWillUnmount = this.componentWillUnmount.bind(this);
    this.clickToken = this.clickToken.bind(this);
  }

  componentDidMount() {
    var url      = window.location.href;
    var position = url.split('#');
    var url2     = position[1].split('/');
    var id       = url2[2];
    getInstanceForMonitoring(id);
    InfrastructureStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    for (var i = 1; 99999 > i; i++) {
      window.clearInterval(i);
    }
    this.setState({
      token: '',
    });

    InfrastructureStore.removeChangeListener(this._onChange);
  }

  clickToken() {
    var report = (
      <div className="report-div">
        <p className="notice">Wait for the first Nubity agent report</p>
        <Preloader size="white-medium" />
      </div>
    );
    this.setState({
      report: report,
    });
  }

  _onChange() {
    if (this.state.interval) {
      var loop       = setInterval(function () {
        var url      = window.location.href;
        var position = url.split('#');
        var url2     = position[1].split('/');
        var id       = url2[2];
        getInstanceForMonitoring(id);
      }, 6000);
      this.setState({
        interval: false,
      });
    }

    var instanceForMonitoring = InfrastructureStore.instanceForMonitoring();

    if ('' != instanceForMonitoring && undefined !== instanceForMonitoring && this.state.tokenFlag) {
      var token = instanceForMonitoring.monitoring_agent.name;
      this.setState({
        token:     token,
        tokenFlag: false,
      });
    }

    if ('' != instanceForMonitoring && undefined !== instanceForMonitoring && !this.state.reportFlag) {
      if (instanceForMonitoring.monitoring_agent.is_active) {
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
        clearInterval(loop);
      }
    }

    this.setState({
      instanceForMonitoring: instanceForMonitoring,
    });
  }

  render() {
    var script = 'NUBITY_TOKEN=' + this.state.token + ' bash -c "$(curl https://packages.nubity.com/installer/nubity-installer.sh)"';
    return (
      <ol className="rounded-list">
        <li className="first-step">
          <div className="row">
            <p className="rounded-list-title"><span>In order to start the health check on your instance, copy this script and execute it with root privlegies in a terminal at the instance you want to monitor:</span></p>
            <OneLiner text={script} clickToken={this.clickToken} />
          </div>
          <br />
        </li>
        <li>
          <p className="rounded-list-title"><span>When the <strong>Nubity agent</strong> is installed, in a few minutes it will start sending data and you will be able to configure alerts and checks for your instance:</span></p>
        </li>
        <li>
          <br />
          <div id="loading-message">
            {this.state.report}
          </div>
        </li>
      </ol>
    );
  }
}

module.exports = LinuxSetup;
