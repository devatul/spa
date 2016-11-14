var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var NinjaDefaultContent        = require('./Ninja_default_content.react');

module.exports = React.createClass({

  _createTicket: function() {
    redirect('create_ticket');
  },

  _liveChat: function() {
    redirect('live_chat');
  },

  render: function() {
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Create your ticket</h2>
        </div>
        <div className="centered">
          <button className="button-shadow large-green-button">Create Ticket</button>
          <a onClick={this._liveChat}>
            <button className="large-green-button">Start Live Chat</button>
          </a>
        </div>
        <div className="margin-sides min-height-subsection">
          <div className="col-xs-3 centered">
            <select className="form-control">
              <option>Open</option>
            </select>
          </div>
          <div className="col-xs-3 centered">
            <select className="form-control">
              <option>Select Department</option>
            </select>
          </div>
          <div className="col-xs-3 centered">
            <select className="form-control">
              <option>Select Priority</option>
            </select>
          </div>
          <div className="col-xs-3 centered">
            <select className="form-control">
              <option>Select Server</option>
            </select>
          </div>
          <div className="col-xs-6 margin-tops">
            <input type="text" className="form-control" id="inputPassword" placeholder="Subject"/>
          </div>
          <div className="col-xs-12">
            <textarea className="form-control" rows="8" placeholder="Message"></textarea>
            <button className="margin-tops blue-button">Send</button>
          </div>
        </div>
      </div>
    );
  }
});
