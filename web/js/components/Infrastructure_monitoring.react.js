var React                         = require('react');
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var saveURI                       = require('../actions/RequestActions').saveURI;
var SessionStore                  = require('../stores/SessionStore');
var Link                          = require('react-router').Link;
var OverlayTrigger                = require('react-bootstrap').OverlayTrigger;
var Linux                         = require('./Linux_setup.react');
var Windows                       = require('./Windows_setup.react');
var InfrastructureStore           = require('../stores/InfrastructureStore');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      title: 'Start monitoring now!',
    };
  },

  componentWillMount: function () {
    if (!SessionStore.isLoggedIn()) {
      saveURI();
      redirect('login');
    }
  },

  componentDidMount: function () {
    InfrastructureStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    InfrastructureStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      if (InfrastructureStore.instanceForMonitoring()) {
        this.setState({
          title: 'Start monitoring for ' + InfrastructureStore.instanceForMonitoring().hostname,
        });
      }

    }
  },

  render: function () {

    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <span className="item title">{this.state.title}</span>
        </div>
        <div className="section-tabs">Select OS for agent installation</div>
        <div>
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className="active">
              <a className="grey-color" data-toggle="tab" href="#linux">
                <span className="hidden-xs hidden-sm"> Linux</span>
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#windows">
                <span className="hidden-xs hidden-sm"> Windows</span>
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="linux" className="tab-pane fade in active">
            <Linux />
          </div>
          <div id="windows" className="tab-pane fade">
            <Windows />
          </div>
        </div>
      </div>
    );
  },
});
