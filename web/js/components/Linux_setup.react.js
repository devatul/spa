var React                         = require('react');
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var Preloader                     = require('./Preloader.react');
var getInstanceForMonitoring      = require('../actions/RequestActions').getInstanceForMonitoring;
var ClipboardButton               = require('react-clipboard.js');

class LinuxSetup extends React.Component {
  constructor(props) {
    super(props);
    var instanceForMonitoring = InfrastructureStore.instanceForMonitoring();
    var token = (
      <div id="loading-message" className="col-sm-offset-1">
        <div className="row centered"><Preloader size="mini" /></div>
      </div>
    );
    var report = (<div><Preloader size="mini" /> <p className="notice">Waiting for the first Nubity Agent report.</p></div>);
    if ('' != instanceForMonitoring && undefined !== instanceForMonitoring) {
      token = instanceForMonitoring.monitoring_agent.name;
    }
    this.state = {
      instanceForMonitoring: instanceForMonitoring,
      token:                 token,
      report:                report,
      tokenFlag:             true,
      reportFlag:            false,
      interval:              true,
    };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    var url = window.location.href;

    var position = url.indexOf('monitoring') + 11;
    var id = url.slice(position);
    if (-1 != url.indexOf('monitoring')) {
      getInstanceForMonitoring(id);
    }
    InfrastructureStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    for (var i = 1; 99999 > i; i++) {
      window.clearInterval(i);
    }

    InfrastructureStore.removeChangeListener(this._onChange);
  }

  _onChange() {
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
      var token = instanceForMonitoring.monitoring_agent.name;
      this.setState({
        token:     token,
        tokenFlag: false,
      });
    }

    if ('' != instanceForMonitoring && undefined !== instanceForMonitoring && !this.state.reportFlag) {
      if (instanceForMonitoring.monitoring_agent.is_active) {
        this.setState({
          reportFlag: true,
          report:     'Report done',
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
            <p className="rounded-list-title"><span>Run this script</span></p>
            <p className="col-sm-offset-1 col-sm-10 notice">{script}</p>
            <div className="col-sm-1 clipboard-div">
              <ClipboardButton className="clipboard-button" data-clipboard-text={script}><img className="clippy" src="./images/clippy.png" width="17" alt="Copy to clipboard" /></ClipboardButton>
            </div>
          </div>
          <br />
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
  }
}

module.exports = LinuxSetup;
