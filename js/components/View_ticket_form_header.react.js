var React  = require('react');

module.exports = React.createClass({

  render: function () {
    servers = [];
    servers.push(<option value="" disabled>Select Server</option>);
    servers.push(<option value={this.props.server} disabled>{this.props.server}</option>);

    return (
      <div>
        <div className="col-xs-3 centered">
          <select className="form-control" ref="type" defaultValue="">
            <option value="" disabled ref="type">Select Type</option>
            <option value="incident">Incident</option>
            <option value="service-request">Service Request</option>
          </select>
        </div>
        <div className="col-xs-3 centered">
          <select className="form-control" ref="department" defaultValue={this.props.department} onChange={this._onChange}>
            <option value="billing">Billing</option>
            <option value="sales">Sales</option>
            <option value="support">Ninja Support</option>
          </select>
        </div>
        <div className="col-xs-3 centered">
          <select className="form-control" ref="priority" defaultValue={this.props.priority} disabled>
            <option value="" disabled>Select Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        <div className="col-xs-3 centered">
          <select className="form-control" ref="hostname" defaultValue={this.props.server} disabled>
            {servers}
          </select>
        </div>
        <div className="col-xs-6 margin-tops">
          <input type="text" className="form-control" id="subject" placeholder="Subject" ref="subject" value={this.props.subject} disabled/>
        </div>
      </div>
    );
  },
});
