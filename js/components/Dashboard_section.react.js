var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');

module.exports = React.createClass({
  _goToAlerts: function() {
    redirect('alerts');
  },

  render: function() {
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Hi Delfina! Check your infrastructure and apps status</h2>
        </div>
        <div className="col-md-6 col-md-offset-3">
          <div className="col-xs-4 dashboard-icons blue">
            <i className="fa fa-info-circle dashboard-minus blue-color" aria-hidden="true"></i>
            Information
          </div>
          <div className="col-xs-4 dashboard-icons">
            <i className="fa fa-exclamation-triangle dashboard-minus yellow-color" aria-hidden="true"></i>
            Warning
          </div>
          <div className="col-xs-4 dashboard-icons">
            <i className="fa fa-minus-square dashboard-minus red-color" aria-hidden="true"></i>
            Critical
          </div>
        </div>
        <div className="margin-sides">
          <table className="table table-striped table-condensed">
            <tr>
              <th>State</th>
              <th>Alert description</th>
              <th>Server</th>
              <th>Connection name</th>
              <th>Priority</th>
              <th>Started on</th>
              <th>Acknowledge</th>
              <th>Report an issue</th>
            </tr>
            <tr>
              <td>Ok</td>
              <td>Ok</td>
              <td>Ok</td>
              <td>Ok</td>
              <td>Ok</td>
              <td>Front 1</td>
              <td>
                <time dateTime="">DD:MM:YYYY 00:00:00</time>
              </td>
              <td>
                <span className="icon-margin label label-primary">Edit</span>
                <span className="icon-margin label label-danger">Disable</span>
                <span className="icon-margin label label-danger">Delete</span>
              </td>
            </tr>
            <tr>
              <td>Ok</td>
              <td>Ok</td>
              <td>Ok</td>
              <td>Ok</td>
              <td>Failed</td>
              <td>Front 2</td>
              <td>DD:MM:YYYY 00:00:00</td>
              <td>
                <span className="icon-margin label label-primary">Edit</span>
                <span className="icon-margin label label-danger">Disable</span>
                <span className="icon-margin label label-danger">Delete</span>
              </td>
            </tr>
            <tr>
              <td>Ok</td>
              <td>Ok</td>
              <td>Ok</td>
              <td>Ok</td>
              <td>Disabled</td>
              <td>Front 1</td>
              <td>DD:MM:YYYY 00:00:00</td>
              <td>
                <span className="icon-margin label label-primary">Edit</span>
                <span className="icon-margin label label-default">Disable</span>
                <span className="icon-margin label label-danger">Delete</span>
              </td>
            </tr>
          </table>
        </div>
        <p className="margin-sides right-aligned">This are only the 5 alerts that needs your attention, se all <a onClick={this._goToAlerts}>here</a></p>
        <div className="margin-sides row">
          <div className="col-xs-6">
          </div>
          <div className="col-xs-6 right-div">
            <div className="title-div">
              <p className="widget-p">Widget</p>
            </div>
            <div className="inside-div">
              <select className="form-control select-margin" id="widgetType">
                <option>Select Widget Type</option>
                <option>2</option>
              </select>
              <select className="form-control select-margin" id="server">
                <option>Select Server</option>
                <option>2</option>
              </select>
              <select className="form-control select-margin" id="chartType">
                <option>Select Chart Type</option>
                <option>2</option>
              </select>
              <button className="green-button">Save</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
});
