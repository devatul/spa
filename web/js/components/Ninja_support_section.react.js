var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var saveURI                    = require('../actions/RequestActions').saveURI;
var SessionStore               = require('../stores/SessionStore');
var NinjaDefaultContent        = require('./Ninja_default_content.react');

module.exports = React.createClass({

  _createTicket: function () {
    redirect('create_ticket');
  },

  _liveChat: function () {
    redirect('live_chat');
  },

  componentWillMount: function () {
    if (!SessionStore.isLoggedIn()) {
      saveURI();
      redirect('login');
    }
  },

  render: function () {
    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <span className="item title">Ninja Support</span>
        </div>
        <div className="centered">
          <a onClick={this._createTicket}>
            <button className="action-button nubity-blue">Create Ticket</button>
          </a>
          <a onClick={this._liveChat}>
            <button className="large-green-button hidden">Start Live Chat</button>
          </a>
        </div>
        <div className="margin-sides min-height-subsection">
          <NinjaDefaultContent/>
        </div>
      </div>
    );
  },
});
