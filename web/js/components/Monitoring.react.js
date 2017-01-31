var React                         = require('react');
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var Link                          = require('react-router').Link;
var OverlayTrigger                = require('react-bootstrap').OverlayTrigger;
var Linux                         = require('./Linux_setup.react');
var Windows                       = require('./Windows_setup.react');

module.exports = React.createClass({
  getInitialState: function () {
    return {
    };
  },
  updateURL: function (sectionId) {
    var hash = window.location.href.split('/monitoring');
    window.location.href = hash[0]+'/monitoring'+sectionId;
  },
  render: function () {
    var hash = window.location.href.split('/monitoring')[1] || '';
    _SELF = this;
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Start monitoring now!</h2>
        </div>
        <div className="section-tabs">Select OS for agent installation</div>
        <div>
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className={(hash == '#linux' || hash == '')? "active" : ""}>
              <Link to="/monitoring#linux" className="grey-color" data-toggle="tab" onClick={function () {_SELF.updateURL('#linux', 1)}}>
                <span className="hidden-xs hidden-sm"> Linux</span>
              </Link>
            </li>
            <li role="presentation" className={hash == '#windows' ? "active" : ""}>
              <Link to="/monitoring#windows" className="grey-color" data-toggle="tab" onClick={function () {_SELF.updateURL('#windows', 1)}}>
                <span className="hidden-xs hidden-sm"> Windows</span>
              </Link>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="linux" className={"tab-pane fade " + (hash == '#linux' || hash == '' ? "in active" : "")}>
            <Linux callUpdateURL={function (page) {_SELF.updateURL('#linux', page)}}/>
          </div>
          <div id="windows" className={"tab-pane fade " + (hash == '#windows' ? "in active" : "")}>
            <Windows callUpdateURL={function (page) {_SELF.updateURL('#windows', page)}}/>
          </div>
        </div>
      </div>
    );
  },
});
