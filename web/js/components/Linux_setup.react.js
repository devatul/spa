var React                         = require('react');
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var LinuxSetup                    = require('./Linux_setup.react');
var WindowsSetup                  = require('./Windows_setup.react');
var Preloader                     = require('./Preloader.react');

module.exports = React.createClass({
  render: function () {
    return (
      <ol className="rounded-list">
        <li>
          <p className="rounded-list-title"><span>Download the Installation Script and run it with Root privileges </span></p>
          <span className='action-button nubity-green col-sm-offset-1'>Download Installation Script</span>
        </li>
        <li>
          <p className="rounded-list-title"><span>Validation - Important!</span></p>
          <p className="col-sm-offset-1">During the installation enter the following Key to validate the agent:</p>
          <input className="col-sm-offset-1" type="text"/>
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
              <Preloader size="mini" /> <p className="notice">Waiting for the first Nubity Agent report.</p>
            </div>
          </div>
        </li>
      </ol>
    );
  },
});
