var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var AlertsStore                = require('../stores/AlertsStore');
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
    var department = [];
    var type = [];
    var subject = '';
    var serverCheck = '';
    var priorityCheck = ''; 

    if (AlertsStore.isAlertTicket()) {
      var alert = AlertsStore.getAlertTicket();
      department = [
        <select className="form-control" ref="department" defaultValue="support" onChange={this._onChange}>
          <option value="billing">Billing</option>
          <option value="sales">Sales</option>
          <option value="support">Ninja Support</option>
        </select>,
      ];
      type = [
        <select className="form-control" ref="type" defaultValue="incident">
          <option value="" disabled ref="type">Select Type</option>
          <option value="incident">Incident</option>
          <option value="service-request">Service Request</option>
        </select>
      ];

      for (var key in instances) {
        if (instances[key].instance == alert.instance.id) {
          serverCheck = instances[key].hostname;
        }
      }

      switch (alert.level) {
        case 'critical':
          priorityCheck = 'high';
        break; 
        case 'warning':
          priorityCheck = 'medium';
        break; 
        case 'info':
          priorityCheck = 'low';
        break; 
      } 

      subject = alert.description;
      AlertsStore.resetAlertTicket();
    }else {
      
      department = [
        <select className="form-control" ref="department" onChange={this._onChange}>
          <option value="billing">Billing</option>
          <option value="sales">Sales</option>
          <option value="support">Ninja Support</option>
        </select>,
      ];

      type = [
        <select className="form-control" ref="type" defaultValue="">
          <option value="" disabled ref="type">Select Type</option>
          <option value="incident">Incident</option>
          <option value="service-request">Service Request</option>
        </select>
      ];
    }

    servers.push(<option value="" disabled>Select Server</option>);
    for (var key in instances) {
      servers.push(<option value={instances[key].hostname}>{instances[key].hostname}</option>);
    }
    
    var priority = [
      <select className="form-control" ref="priority" defaultValue={priorityCheck}>
        <option value="" disabled>Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>,
    ];

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Create your ticket</h2>
        </div>
        <div className="centered">
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
            <select className="form-control" ref="hostname" defaultValue={serverCheck}>
              {servers}
            </select>
          </div>
          <div className="col-xs-6 margin-tops">
            <input type="text" className="form-control" id="inputPassword" placeholder="Subject" ref="subject" defaultValue={subject}/>
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
