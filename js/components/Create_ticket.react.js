var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var NinjaDefaultContent        = require('./Ninja_default_content.react');
var search                     = require('../actions/RequestActions').search;
var CreateTicketAction         = require('../actions/RequestActions').createTicket;

module.exports = React.createClass({

  getInitialState: function () {
    var search = SessionStore.search();
    return {
      search: search,
      instances: search.instances,
      clouds: search.clouds,
    };
  },

  componentDidMount: function () {
    search();
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var search = SessionStore.search();
      this.setState({
        search: search,
        instances: search.instances,
        clouds: search.clouds,
      });
    }
  },

  _onSubmit: function(e) {
    e.preventDefault();
    var ticket = {};
    ticket.department = this.refs.department.getDOMNode().value;
    ticket.priority   = this.refs.priority.getDOMNode().value;
    ticket.type       = this.refs.type.getDOMNode().value;
    ticket.subject    = this.refs.subject.getDOMNode().value;
    ticket.content    = this.refs.subject.getDOMNode().value;
    ticket.hostname   = this.refs.hostname.getDOMNode().value;
    CreateTicketAction(ticket);
  },

  _createTicket: function () {
    redirect('create_ticket');
  },

  _liveChat: function () {
    redirect('live_chat');
  },

  render: function () {
    var search = this.state.search;
    var instances = this.state.instances;

    var servers = [];
    for (var key in instances) {
      servers[servers.length] = <option value={instances[key].hostname} >{instances[key].hostname}</option>;
    }

    var department = [
      <select className="form-control" ref="department" onChange={this._onChange}>
        <option value="billing">Billing</option>
        <option value="sales">Sales</option>
        <option value="support">Ninja Support</option>
      </select>,
    ];

    var priority = [
      <select className="form-control" ref="priority">
        <option value="" disabled selected>Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>,
    ];

    var type = [
      <select className="form-control" ref="type">
        <option value="" disabled selected ref="type">Select Type</option>
        <option value="incident">incident</option>
        <option value="service-request">service-request</option>
      </select>
    ];

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
            {type}
          </div>
          <div className="col-xs-3 centered">
            {department}
          </div>
          <div className="col-xs-3 centered">
            {priority}
          </div>
          <div className="col-xs-3 centered">
            <select className="form-control" ref="hostname">
              <option value="" disabled selected>Select Server</option>
              {servers}
            </select>
          </div>
          <div className="col-xs-6 margin-tops">
            <input type="text" className="form-control" id="inputPassword" placeholder="Subject" ref="subject"/>
          </div>
          <div className="col-xs-12">
            <textarea className="form-control" rows="8" placeholder="Message" ref="content"></textarea>
            <button className="margin-tops blue-button" onClick={this._onSubmit}>Send</button>
          </div>
        </div>
      </div>
    );
  },
});
