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
var Dropzone                   = require('react-dropzone');
var openAttachment             = require('../actions/RequestActions').openAttachment;

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
        files: [],
        dropzone: 'dropzone',
        button: (<button type="submit" className="margin-tops blue-button">Send</button>),
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
    if (this.isMounted() && NinjaStore.getViewTicket() != this.state.ticket) {
      this.setState({
        ticket: NinjaStore.getViewTicket(),
        files: [],
        button: (<button type="submit" className="margin-tops blue-button">Send</button>),
      });
    }
  },

  _onSubmit: function (e) {
    e.preventDefault();
    var id = this.state.ticket.ticket;
    var ticketReply = this.refs.content.getDOMNode().value;

    this.refs.content.getDOMNode().value = '';
    this.setState({
      button: (<Preloader size="mini" preloaderClass="custom-loader" />),
    });

    ReplyTicketAction(id, ticketReply, this.state.files);
    
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

  onDrop: function (acceptedFiles, rejectedFiles) {
    this.setState({
      files: acceptedFiles,
    });
  },

  showDropZone: function (e) {
    e.preventDefault();
    this.setState({
      dropzone: 'dropzone',
      ticket: NinjaStore.getViewTicket(),
    });
  },

  _openAttachment: function (ticketId, attachmentId, attachmentName) {
    openAttachment (ticketId, attachmentId, attachmentName);
  },

  render: function () {
    var subject       = '';
    var ticket        = '';
    var replies;
    var closeTicket   = '';

    //Form
    if (NinjaStore.isViewingTicket()) {
      ticket     = this.state.ticket;
      subject    = ticket.subject;
    }

    //Replies
    var message = '';
    var attachments = [];
    if (undefined === this.state.ticket.replies || 1 > (this.state.ticket.replies).length) {
      replies = (<Preloader/>);
      message = (<Preloader/>);
    } else {
      replies = this.state.ticket.replies;
      message = this.state.ticket.replies[(this.state.ticket.replies).length-1].content;
      message = $('<textarea />').html(message).text();
      var body = this.state.ticket.replies[(this.state.ticket.replies).length-1];
      for (var key in body.ticket_attachments) {
        attachments.push(<div className="attachments-link" onClick={this._openAttachment.bind(this, body.ticket_attachments[key].ticket_id, body.ticket_attachments[key].ticketAttachment, body.ticket_attachments[key].filename)}>{body.ticket_attachments[key].filename}</div>);
      }
      subject = this.state.ticket.subject;
      var index = replies.length-1;
      if (-1 < index) {
        replies.splice(index, 1);
      }

      var allReplies = [];
      for (var i in replies) {
        allReplies.push(<Reply reply={replies[i]}/>);
      }
    }

    var priority = '';
    if ('' != this.state.ticket && undefined !== this.state.ticket) {
      if ('closed' != this.state.ticket.status) {
        closeTicket = (<Button className="button-ticket-header" onClick={this._closeTicket} bsSize="small"><i className="icon nb-close-circle small"></i> <span className="hidden-md hidden-sm hidden-xs">Close ticket</span></Button>);
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

    var filesPreview = (<p>Try dropping some files here, or click to select files to upload.</p>);
    var preview = [];
    if (0 < this.state.files.length) {
      for (var cont in this.state.files) {
        preview.push(<div className="col-xs-2"><object className="preview" data={this.state.files[cont].preview}></object><p>{this.state.files[cont].name}</p></div>);
      }
      filesPreview = (
        <div>
          <p>Uploading {this.state.files.length} files...</p>
          <div>{preview}</div>
        </div>
      );
    } 

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Ticket - {this.state.ticket.name}</h2>
        </div>
        <div className="centered hidden">
          <a onClick={this._liveChat}>
            <button className="large-green-button hidden">Start Live Chat</button>
          </a>
        </div>
        <div className="ticket-header-container">
          <div className="col-xs-12">
            <div className="ticket-user-info">
              <i className="icon nb-user small"></i> <strong>{username}</strong>
            </div>
            <div className="ticket-date pull-right reply-date">
              <i className="icon nb-date-time small"></i> {from}
            </div>
          </div>
          <div className="ticket-header">
            <div className="col-xs-10">
              <span className={state}></span> <span className="ticket-title">{subject}</span>
            </div>
          </div>
          <div className="ticket-body">
            <div className="ticket-message">
              {message}
              <br/>
              {attachments}
            </div>
            <span className="ticket-attachment hidden">
              <i className="icon nb-attach small"></i> Attachment
            </span>
          </div>
          <div className="ticket-footer">
            <div className="col-xs-7">
              {priority}
            </div>
            <div className="col-xs-5">
              <div className="right">
                <ButtonToolbar>
                  <Dropdown id="dropdown-custom-1" className="button-ticket-header">
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
        </div>
        <div className="replies-container">
          {allReplies}
        </div>
        <div className="ticket-container">
          <div className="ticket-reply-header">
            <div className="col-md-6">
              <i className="icon nb-send small"></i> Add reply
            </div>
          </div>
          <form className="row" onSubmit={this._onSubmit}>
            <div className="col-xs-12">
              <textarea className="form-control" rows="8" placeholder={'Write your reply'} ref="content" required></textarea>
              <div>
                <Dropzone onDrop={this.onDrop} className={this.state.dropzone}>
                  {filesPreview}
                </Dropzone>
              </div>
              {this.state.button}
              <button className="attachmentFile hidden" onClick={this.showDropZone}><i className="fa fa-paperclip" aria-hidden="true"></i></button>
            </div>
          </form>
        </div>
      </div>
    );
  },
});
