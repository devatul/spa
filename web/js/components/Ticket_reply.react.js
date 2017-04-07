var React          = require('react');
var moment         = require('moment');
var openAttachment = require('../actions/RequestActions').openAttachment;
        
module.exports = React.createClass({
  _openAttachment: function (ticketId, attachmentId, attachmentName) {
    openAttachment (ticketId, attachmentId, attachmentName);
  },

  render: function () {
    var firstname = ''; 
    var from = '';

    if (undefined !== this.props.reply.created_at && this.props.reply.created_at) {
      from = moment(this.props.reply.created_at).format('lll');
    } 

    if (undefined !== this.props.reply.user && this.props.reply.user) {
      firstname = this.props.reply.user.firstname;
    } 
    var message = $('<textarea />').html(this.props.reply.content).text();
    var attachments = [];
    for (var key in this.props.reply.ticket_attachments) {
      attachments.push(<div className="attachments-link" onClick={this._openAttachment.bind(this, this.props.reply.ticket_attachments[key].ticket_id, this.props.reply.ticket_attachments[key].ticketAttachment, this.props.reply.ticket_attachments[key].filename)}>{this.props.reply.ticket_attachments[key].filename}</div>);
    }
    return (
      <div className="ticket-reply">
        <div className="ticket-reply-header">
          <div className="col-md-6">
            <i className="icon nb-ninja-support small"></i> <strong>{firstname}&nbsp;</strong>
            <i className="icon nb-calendar small"></i> {from}
          </div>
        </div>
        <div className="ticket-body">
          <div className="ticket-message">
            <div className="col-xs-12">
            </div>
            {message}
          </div>
          <div className="ticket-message">
            {attachments}
          </div>
        </div>
      </div>
    );
  },
});
