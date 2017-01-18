var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var AlertsStore                = require('../stores/AlertsStore');
var NinjaStore                 = require('../stores/NinjaStore');
var getTicket                  = require('../actions/RequestActions').getTicket;
var NinjaDefaultContent        = require('./Ninja_default_content.react');
var ReplyTicketAction          = require('../actions/RequestActions').replyTicket;
var Preloader                  = require('./Preloader.react');
var Reply                      = require('./Ticket_reply.react');
var FormHeader                 = require('./View_ticket_form_header.react');

module.exports = React.createClass({

  getInitialState: function () {
    NinjaStore.resetStore();

    var url = window.location.href;
    var position = url.indexOf("view-ticket") + 12;
    var id = url.slice(position);

    if ('' != id ) {
      getTicket(id);
      return {
        ticket: '',
      };
    } 

    return {
      ticket: NinjaStore.getViewTicket()
    };
   
  },

  componentDidMount: function () {

    var url = window.location.href;
    var position = url.indexOf("view-ticket") + 12;
    var id = url.slice(position);

    if ('' != id ) {
      getTicket(id);
    } else {
      getTicket(NinjaStore.getViewTicket().ticket);
    }
    
    SessionStore.addChangeListener(this._onChange);
    NinjaStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    NinjaStore.resetViewingTicket();
    SessionStore.removeChangeListener(this._onChange);
    NinjaStore.addChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      this.setState({
        ticket: NinjaStore.getViewTicket()
      });
    }
  },

  _onSubmit: function(e) {
    e.preventDefault();
    var id = this.state.ticket.ticket;
    var ticketReply = this.refs.content.getDOMNode().value;

    this.refs.content.getDOMNode().value = '';    
    
    ReplyTicketAction(id, ticketReply);
  },

  _createTicket: function () {
    redirect('create_ticket');
  },

  _liveChat: function () {
    redirect('live_chat');
  },

  render: function () {
    var formHeader    = {};
    var url      = window.location.href;
    var position = url.indexOf("view-ticket") + 12;
    var urlid    = url.slice(position);

    //Form
    if (NinjaStore.isViewingTicket()) {
      var ticket        = this.state.ticket;
      formHeader = (<FormHeader priority={ticket.priority} department={ticket.department} server={ticket.hostname} subject={ticket.subject}/>);
      
    } else if ('' != urlid) {
      if (!(undefined === this.state.ticket.priority || undefined === this.state.ticket.department || undefined === this.state.ticket.hostname || undefined === this.state.ticket.subject)) {
        formHeader = (<FormHeader priority={this.state.ticket.priority} department={this.state.ticket.department} server={this.state.ticket.hostname} subject={this.state.ticket.subject}/>);
      }
    } else {
      var ticket = '';
    }

    //Replies
    if (undefined === this.state.ticket.replies) {
      var replies = (<Preloader/>);
    } else {
      var replies = [];
      for (var key in this.state.ticket.replies) {
        replies.push(<Reply reply={this.state.ticket.replies[key]}/>);
      }
      
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Ninja Support</h2>
        </div>
        <div className="centered hidden">
          <a onClick={this._liveChat}>
            <button className="large-green-button hidden">Start Live Chat</button>
          </a>
        </div>
        <form onSubmit={this._onSubmit}>
          <div className="margin-sides min-height-subsection">
            {formHeader}
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
