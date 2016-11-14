var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');

module.exports = React.createClass({

  render: function() {
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Alerts</h2>
        </div>
        <div className="col-xs-12">
          <table className="table table-striped table-condensed">
            <tr>
              <th>State</th>
              <th>Server</th>
              <th>Integration name</th>
              <th>Alert description</th>
              <th>Priority</th>
              <th>Started on</th>
              <th>Resolved on</th>
              <th>Acknowledge</th>
              <th>Report a problem</th>
            </tr>
            <tr>
              <td>
                <i className="fa fa-exclamation-circle red-icon" aria-hidden="true"></i>
              </td>
              <td>server - bla bla</td>
              <td>front 2</td>
              <td>Free disk space is less than 10% on volume C</td>
              <td>
                <i className="fa fa-minus-square red-color" aria-hidden="true"></i>
              </td>
              <td>
                <time datetime="">DD/MM/YYYY 00:00:00</time>
              </td>
              <td>
                <time datetime="">DD/MM/YYYY 00:00:00</time>
              </td>
              <td>
                <span className="label label-danger">Stop Alerting</span>
              </td>
              <td>
                <span className="label label-success">Create Ticket</span>
              </td>
            </tr>
            <tr>
              <td>
                <i className="fa fa-exclamation-circle red-icon" aria-hidden="true"></i>
              </td>
              <td>server - bla bla</td>
              <td>front 1</td>
              <td>Server down. Nubity agent is unreachable</td>
              <td>
                <i className="fa fa-info-circle blue-color" aria-hidden="true"></i>
              </td>
              <td>
                <time datetime="">DD/MM/YYYY 00:00:00</time>
              </td>
              <td>
                <time datetime="">DD/MM/YYYY 00:00:00</time>
              </td>
              <td>
                <span className="label label-danger">Stop Alerting</span>
              </td>
              <td>
                <span className="label label-success">Create Ticket</span>
              </td>
            </tr>
            <tr>
              <td>
                <i className="fa fa-exclamation-circle red-icon" aria-hidden="true"></i>
              </td>
              <td>server - bla bla</td>
              <td>back 1</td>
              <td>Host information was changed</td>
              <td>
                <i className="fa fa-exclamation-triangle yellow-color" aria-hidden="true"></i>
              </td>
              <td>
                <time datetime="">DD/MM/YYYY 00:00:00</time>
              </td>
              <td>
                <time datetime="">DD/MM/YYYY 00:00:00</time>
              </td>
              <td>
                <span className="label label-default">Alerting Stopped</span>
              </td>
              <td>
                <span className="label label-success">Create Ticket</span>
              </td>
            </tr>
            <tr>
              <td>
                <i className="fa fa-check-circle green-icon" aria-hidden="true"></i>
              </td>
              <td>server - bla bla</td>
              <td>back 2</td>
              <td>Lack of free memory</td>
              <td>
                <i className="fa fa-exclamation-triangle yellow-color" aria-hidden="true"></i>
              </td>
              <td>
                <time datetime="">DD/MM/YYYY 00:00:00</time>
              </td>
              <td>
                <time datetime="">DD/MM/YYYY 00:00:00</time>
              </td>
              <td>
                <span>Resolved</span>
              </td>
              <td>
                <span className="label label-success">Create Ticket</span>
              </td>
            </tr>
          </table>
        </div>
      </div>
    );
  }
});
