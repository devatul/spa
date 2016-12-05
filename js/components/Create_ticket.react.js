var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var NinjaDefaultContent        = require('./Ninja_default_content.react');
var search                     = require('../actions/RequestActions').search;

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
      servers[servers.length] = <option value={instances[key].instance} >{instances[key].hostname}</option>;
    }

    var department = [
      <select className="form-control">
        <option value="" disabled selected>Select Department</option>
        <option value="billing">Billing</option>
        <option value="sales">Sales</option>
        <option value="support">Ninja Support</option>
      </select>,
    ];

    var priority = [
      <select className="form-control">
        <option value="" disabled selected>Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>,
    ];

    var status = [
      <select className="form-control">
        <option value="" disabled selected>Select Status</option>
        <option value="open">Open</option>
        <option value="close">Close</option>
      </select>,
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
            {status}
          </div>
          <div className="col-xs-3 centered">
            {department}
          </div>
          <div className="col-xs-3 centered">
            {priority}
          </div>
          <div className="col-xs-3 centered">
            <select className="form-control">
              <option value="" disabled selected>Select Server</option>
              {servers}
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
  },
});
