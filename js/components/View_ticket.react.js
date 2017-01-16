var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var AlertsStore                = require('../stores/AlertsStore');
var NinjaStore                 = require('../stores/NinjaStore');
var getTicket                  = require('../actions/RequestActions').getTicket;
var NinjaDefaultContent        = require('./Ninja_default_content.react');
var search                     = require('../actions/RequestActions').search;
var ReplyTicketAction          = require('../actions/RequestActions').replyTicket;
var Preloader                  = require('./Preloader.react');
var Reply                      = require('./Ticket_reply.react');

module.exports = React.createClass({

  getInitialState: function () {
    NinjaStore.resetStore();
    var search = SessionStore.search();
    return {
      search: search,
      instances: search.instances,
      clouds: search.clouds,
      ticket: NinjaStore.getViewTicket()
    };
  },

  componentDidMount: function () {
    search();
    getTicket(NinjaStore.getViewTicket().ticket);
    SessionStore.addChangeListener(this._onChange);
    NinjaStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
    NinjaStore.addChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var search = SessionStore.search();
      this.setState({
        search: search,
        instances: search.instances,
        clouds: search.clouds,
        ticket: NinjaStore.getViewTicket()
      });
    }
  },

  _onSubmit: function(e) {
    e.preventDefault();
    var id = this.state.ticket.ticket;
    var ticketReply = this.refs.content.getDOMNode().value;
    
    ReplyTicketAction(id, ticketReply);
  },

  _createTicket: function () {
    redirect('create_ticket');
  },

  _liveChat: function () {
    redirect('live_chat');
  },

  render: function () {
    var search     = this.state.search;
    var instances  = this.state.instances;
    var servers    = [];
    var subject       = '';
    var serverCheck   = '';
    
    if (NinjaStore.isViewingTicket()) {
      var ticket = this.state.ticket;
      for (var key in instances) {
        if (instances[key].hostname == ticket.hostname) {
          serverCheck = instances[key].hostname;
        }
      }
      subject = ticket.subject;
      NinjaStore.resetViewingTicket();
    } else {
      
      var ticket = '';
    }

    if (undefined === this.state.ticket.replies) {
      var replies = (<Preloader/>);
    } else {
      var replies = [];
      for (var key in this.state.ticket.replies) {
        replies.push(<Reply reply={this.state.ticket.replies[key]}/>);
      }
    }

    servers.push(<option value="" disabled>Select Server</option>);
    for (var key in instances) {
      servers.push(<option value={instances[key].hostname}>{instances[key].hostname}</option>);
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Ninja Support</h2>
        </div>
        <div className="centered">
          <a onClick={this._liveChat}>
            <button className="large-green-button">Start Live Chat</button>
          </a>
        </div>
        <form onSubmit={this._onSubmit}>
          <div className="margin-sides min-height-subsection">
            <div className="col-xs-3 centered">
              <select className="form-control" ref="type" defaultValue="">
                <option value="" disabled ref="type">Select Type</option>
                <option value="incident">Incident</option>
                <option value="service-request">Service Request</option>
              </select>
            </div>
            <div className="col-xs-3 centered">
              <select className="form-control" ref="department" defaultValue={ticket.department} onChange={this._onChange}>
                <option value="billing">Billing</option>
                <option value="sales">Sales</option>
                <option value="support">Ninja Support</option>
              </select>
            </div>
            <div className="col-xs-3 centered">
              <select className="form-control" ref="priority" defaultValue={ticket.priority} disabled>
                <option value="" disabled>Select Priority</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div className="col-xs-3 centered">
              <select className="form-control" ref="hostname" defaultValue={serverCheck} disabled>
                {servers}
              </select>
            </div>
            <div className="col-xs-6 margin-tops">
              <input type="text" className="form-control" id="inputPassword" placeholder="Subject" ref="subject" defaultValue={subject} disabled/>
            </div>
            <div className="col-xs-12">
              {replies}
            </div>
            <div className="col-xs-12">
              <textarea className="form-control" rows="8" placeholder={"Reply"} ref="content" required></textarea>
              <button type="submit" className="margin-tops blue-button">Send</button>
            </div>
          </div>
        </form>
      </div>
    );
  },
});
