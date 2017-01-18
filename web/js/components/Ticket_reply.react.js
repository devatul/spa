var React  = require('react');
var moment = require('moment');
        
module.exports = React.createClass({
  render: function () {
    var from = moment(this.props.reply.created_at).format('lll');
    return (
      <div className="ticket-reply">
        <div className="ticket-reply-header">
          <div className="col-md-6">
            <i className="icon nb-ninja-support small"></i> <strong>{this.props.reply.user.firstname}&nbsp;</strong>
            <i className="icon nb-calendar small"></i> {from}
          </div>
        </div>
        <div className="ticket-body">
          <div className="ticket-message">
            <div className="col-xs-12">
            </div>
            {this.props.reply.content}
          </div>
        </div>
      </div>
    );
  },
});
