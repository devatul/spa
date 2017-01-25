var React                         = require('react');
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var LinuxSetup                    = require('./Linux_setup.react');
var WindowsSetup                  = require('./Windows_setup.react');

module.exports = React.createClass({
  
  render: function () {
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Start monitoring now!</h2>
        </div>
        <div className="section-tabs">Select OS for agent installation</div>
        <div>
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className="active">
              <a className="grey-color" data-toggle="tab" href="#linux">
                <i className="icon nb-eye small" aria-hidden="true"></i> Linux
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#windows">
                <i className="icon nb-cloud-public small" aria-hidden="true"></i> Windows
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="linux" className="tab-pane fade in active ">
            <LinuxSetup/>
          </div>
          <div id="windows" className="tab-pane fade">
            <WindowsSetup/>
          </div>
        </div>
      </div>
    );
  },
});
