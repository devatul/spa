var React                      = require('react');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var NinjaStore                 = require('../stores/NinjaStore');
var getTicket                  = require('../actions/RequestActions').getTicket;
var ReplyTicketAction          = require('../actions/RequestActions').replyTicket;
var Preloader                  = require('./Preloader.react');
var Reply                      = require('./Ticket_reply.react');
var FormHeader                 = require('./View_ticket_form_header.react');
var Moment                     = require('moment');
var Dropdown                   = require('react-bootstrap').Dropdown;
var Button                     = require('react-bootstrap').Button;
var ButtonToolbar              = require('react-bootstrap').ButtonToolbar;
var MenuItem                   = require('react-bootstrap').MenuItem;

module.exports = React.createClass({

  getInitialState: function () {
    NinjaStore.resetStore();

    var url = window.location.href;
    var position = url.indexOf('view-ticket') + 12;
    var id = url.slice(position);

    if ('' != id ) {
      getTicket(id);
      return {
        ticket: '',
      };
    }

    return {
      ticket: NinjaStore.getViewTicket(),
    };

  },

  componentWillMount: function () {
    if (!SessionStore.isLoggedIn()) {
      redirect('login');
    }
  },
  
  componentDidMount: function () {

    var url = window.location.href;
    var position = url.indexOf('view-ticket') + 12;
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
    NinjaStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      this.setState({
        ticket: NinjaStore.getViewTicket(),
      });
    }
  },

  _onSubmit: function (e) {
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
    var position = url.indexOf('view-ticket') + 12;
    var urlid    = url.slice(position);
    var ticketName    = '';
    var subject       = '';
    var ticket        = '';
    var replies;

    //Form
    if (NinjaStore.isViewingTicket()) {
      ticket        = this.state.ticket;
      formHeader = (<FormHeader priority={ticket.priority} department={ticket.department} server={ticket.hostname} subject={ticket.subject}/>);
      ticketName = ticket.name;
      subject = ticket.subject;
    } else if ('' != urlid) {
      if (!(undefined === this.state.ticket.priority || undefined === this.state.ticket.department || undefined === this.state.ticket.hostname || undefined === this.state.ticket.subject)) {
        formHeader = (<FormHeader priority={this.state.ticket.priority} department={this.state.ticket.department} server={this.state.ticket.hostname} subject={this.state.ticket.subject}/>);
      }
    }

    //Replies
    var message = '';
    if (undefined === this.state.ticket.replies) {
      replies = (<Preloader/>);
      message = (<Preloader/>);
    } else {
      replies = this.state.ticket.replies;
      message = this.state.ticket.replies[(this.state.ticket.replies).length-1].content;
      var index = replies.length-1;
      if (-1 < index) {
        replies.splice(index, 1);
      }

      var allReplies = [];

      for (var key in replies) {
        allReplies.push(<Reply reply={replies[key]}/>);
      }
    }

    var priority = '';
    if (undefined !== this.state.ticket) {

      switch (this.state.ticket.priority) {
        case 'low' :
          priority = (<p><span className="icon nb-level-low icon-state green-text"></span> Low</p>);
          break;
        case 'medium' :
          priority = (<p><span className="icon nb-level-medium icon-state yellow-text"></span> Medium</p>);
          break;
        case 'high' :
          priority = (<p><span className="icon nb-level-high icon-state red-text"></span> High</p>);
          break;
        default :
          priority = '';
      }

      var department = '';
      switch (this.state.ticket.department) {
        case 'support' :
          department = 'icon nb-ninja-support small';
          break;
        case 'billing' :
          department = 'icon nb-billing small';
          break;
        case 'sales' :
          department = 'icon nb-sales small';
          break;
      }

      var username = '';
      if (undefined !== this.state.ticket.user) {
        username = this.state.ticket.user.firstname;
      } else {
        username = '';
      }

      var state = '';
      if ('open' == this.state.ticket.status) {
        state = 'icon nb-ticket small blue-text';
      } else {
        state = 'icon nb-ticket small green-text';
      }

      var from = Moment(this.state.ticket.created_at).format('lll');
    }

    if (!SessionStore.isLoggedIn()) {
      return(<div></div>)
    }
    
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">View your ticket {ticketName}</h2>
        </div>
        <div className="centered hidden">
          <a onClick={this._liveChat}>
            <button className="large-green-button hidden">Start Live Chat</button>
          </a>
        </div>
        <div className="ticket-container">
          <div className="ticket-header">
            <div className="col-md-6">
              <span className={state}></span> <span className="ticket-title">{subject}</span>
            </div>
            <div className="col-md-6">
              <div className="pull-right">
                {priority}
              </div>
            </div>
          </div>
          <div className="ticket-body">
            <div className="ticket-message">
              {message}
            </div>
            <span className="ticket-attachment">
              <i className="icon nb-attach small"></i> Attachment
            </span>
          </div>
          <div className="ticket-footer">
            <div className="col-md-6">
              <div className="ticket-date">
                <i className="icon nb-date-time small"></i> {from}
              </div>
              <div className="ticket-user-info">
                <i className="icon nb-user small"></i> <strong>{username}</strong> | Service Request
              </div>
            </div>
            <div className="col-md-6">
              <div className="pull-right">
                <ButtonToolbar>
                  <Dropdown id="dropdown-custom-1">
                    <Dropdown.Toggle bsSize="small">
                      <i className={department}></i> Change Department
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <MenuItem eventKey="1"><i className="icon nb-billing small"></i> Billing</MenuItem>
                      <MenuItem eventKey="2"><i className="icon nb-sales small"></i> Sales</MenuItem>
                      <MenuItem eventKey="3"><i className="icon nb-ninja-support small"></i> Ninja Support</MenuItem>
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button bsSize="small"><i className="icon nb-close-circle small"></i> Close ticket</Button>
                </ButtonToolbar>
              </div>
            </div>
          </div>
          <div className="ticket-replies-container">
            {allReplies}
            <div className="ticket-reply add-reply">
              <div className="ticket-reply-header">
                <div className="col-md-6">
                  <i className="icon nb-send small"></i> Add reply
                </div>
              </div>
              <form onSubmit={this._onSubmit}>
                <div className="col-xs-12">
                  <textarea className="form-control" rows="8" placeholder={'Write your reply'} ref="content" required></textarea>
                  <button type="submit" className="margin-tops blue-button">Send</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
