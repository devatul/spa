var React                      = require('react');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var NinjaStore                 = require('../stores/NinjaStore');
var getTicket                  = require('../actions/RequestActions').getTicket;
var ReplyTicketAction          = require('../actions/RequestActions').replyTicket;
var closeTicket                = require('../actions/RequestActions').closeTicket;
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

    if (undefined !== id && id) {
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

  _closeTicket: function () {
    closeTicket(this.state.ticket.ticket);
  },

  _createTicket: function () {
    redirect('create_ticket');
  },

  _liveChat: function () {
    redirect('live_chat');
  },

  render: function () {
    var ticketName    = '';
    var subject       = '';
    var ticket        = '';
    var replies;
    var closeTicket   = '';

    //Form
    if (NinjaStore.isViewingTicket()) {
      ticket     = this.state.ticket;
      ticketName = ticket.name;
      subject    = ticket.subject;
    }

    //Replies
    var message = '';
    if (undefined === this.state.ticket.replies || 1 > (this.state.ticket.replies).length) {
      replies = (<Preloader/>);
      message = (<Preloader/>);
    } else {
      replies = this.state.ticket.replies;
      message = this.state.ticket.replies[(this.state.ticket.replies).length-1].content;
      message = $('<textarea />').html(message).text();
      subject = this.state.ticket.subject;
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
    if ('' != this.state.ticket && undefined !== this.state.ticket) {
      if ('closed' != this.state.ticket.status) {
        closeTicket = (<Button onClick={this._closeTicket} bsSize="small"><i className="icon nb-close-circle small"></i> <span className="hidden-md hidden-sm hidden-xs">Close ticket</span></Button>);
      }
      switch (this.state.ticket.priority) {
        case 'low' :
          priority = (<p><span className="icon nb-level-low icon-state reset  green-text"></span> <span className="hidden-xs">Low</span></p>);
          break;
        case 'medium' :
          priority = (<p><span className="icon nb-level-medium icon-state reset yellow-text"></span> <span className="hidden-xs">Medium</span></p>);
          break;
        case 'high' :
          priority = (<p><span className="icon nb-level-high icon-state reset red-text"></span> <span className="hidden-xs">High</span></p>);
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
      if ('' != this.state.ticket && undefined !== this.state.ticket.user) {
        username = this.state.ticket.user.firstname;
      } else {
        username = '';
      }

      var state = '';
      if ('open' == this.state.ticket.status) {
        state = 'icon nb-ticket icon-state reset blue-text';
      } else {
        state = 'icon nb-ticket icon-state reset green-text';
      }

      var from = Moment(this.state.ticket.created_at).format('lll');
    }

    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
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
            <div className="col-xs-10">
              <span className={state}></span> <span className="ticket-title">{subject}</span>
            </div>
            <div className="col-xs-2">
              <div className="pull-right">
                {priority}
              </div>
            </div>
          </div>
          <div className="ticket-body">
            <div className="ticket-message">
              {message}
            </div>
            <span className="ticket-attachment hidden">
              <i className="icon nb-attach small"></i> Attachment
            </span>
          </div>
          <div className="ticket-footer">
            <div className="col-xs-7">
              <div className="ticket-date">
                <i className="icon nb-date-time small"></i> {from}
              </div>
              <div className="ticket-user-info">
                <i className="icon nb-user small"></i> <strong>{username}</strong> | Service Request
              </div>
            </div>
            <div className="col-xs-5">
              <div className="right">
                <ButtonToolbar>
                  <Dropdown id="dropdown-custom-1">
                    <Dropdown.Toggle bsSize="small">
                      <i className={department}></i> <span className="hidden-md hidden-sm hidden-xs">Change Department</span>
                    </Dropdown.Toggle>
                    <Dropdown.Menu>
                      <MenuItem eventKey="1"><i className="icon nb-billing small"></i> Billing</MenuItem>
                      <MenuItem eventKey="2"><i className="icon nb-sales small"></i> Sales</MenuItem>
                      <MenuItem eventKey="3"><i className="icon nb-ninja-support small"></i> Ninja Support</MenuItem>
                    </Dropdown.Menu>
                  </Dropdown>
                  {closeTicket}
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
