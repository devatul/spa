var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');

module.exports = React.createClass({

  render: function() {
    return (
      <div>
        <table className="table table-striped table-condensed">
          <tr>
            <th>Status</th>
            <th>Department</th>
            <th>Priority</th>
            <th>Server</th>
            <th>Date</th>
            <th>Ticket Id</th>
            <th>View Ticket</th>
          </tr>
          <tr>
            <td><span className="sprites ticket-min-blue"></span></td>
            <td>
              <i className="fa fa-credit-card-alt billing" aria-hidden="true"></i>  Billing
            </td>
            <td>
              <span className="sprites priority-1"></span>
            </td>
            <td>Servername - front 123</td>
            <td>
              <time datetime="">YYYY/MM/DD 00:00:00 am</time>
            </td>
            <td>LFS-753-67510</td>
            <td>
              <span className="label label-primary">View Ticket</span>
            </td>
          </tr>
          <tr>
            <td><span className="sprites ticket-min-grey"></span></td>
            <td>
              <span className="sprites ninja-icon"></span>  Ninja Support
            </td>
            <td>
              <span className="sprites priority-2"></span>
            </td>
            <td>Servername - front 123</td>
            <td>
              <time datetime="">YYYY/MM/DD 00:00:00 am</time>
            </td>
            <td>LFS-753-67510</td>
            <td>
              <span className="label label-primary">View Ticket</span>
            </td>
          </tr>
          <tr>
            <td><span className="sprites ticket-min-red"></span></td>
            <td>
              <span className="sprites sales"></span>  Sales
            </td>
            <td>
              <span className="sprites priority-3"></span>
            </td>
            <td>Servername - front 123</td>
            <td>
              <time datetime="">YYYY/MM/DD 00:00:00 am</time>
            </td>
            <td>LFS-753-67510</td>
            <td>
              <span className="label label-primary">View Ticket</span>
            </td>
          </tr>
          <tr>
            <td><span className="sprites ticket-min-black"></span></td>
            <td>
              <i className="fa fa-credit-card-alt billing" aria-hidden="true"></i>  Billing
            </td>
            <td>
              <span className="sprites priority-1"></span>
            </td>
            <td>Servername - front 123</td>
            <td>
              <time datetime="">YYYY/MM/DD 00:00:00 am</time>
            </td>
            <td>LFS-753-67510</td>
            <td>
              <span className="label label-primary">View Ticket</span>
            </td>
          </tr>
          <tr>
            <td><span className="sprites ticket-min-green"></span></td>
            <td>
              <span className="sprites ninja-icon"></span>  Ninja Support
            </td>
            <td>
              <span className="sprites priority-2"></span>
            </td>
            <td>Servername - front 123</td>
            <td>
              <time datetime="">YYYY/MM/DD 00:00:00 am</time>
            </td>
            <td>LFS-753-67510</td>
            <td>
              <span className="label label-primary">View Ticket</span>
            </td>
          </tr>
          <tr>
            <td><span className="sprites ticket-min-red"></span></td>
            <td>
              <span className="sprites sales"></span>  Sales
            </td>
            <td>
              <span className="sprites priority-3"></span>
            </td>
            <td>Servername - front 123</td>
            <td>
              <time datetime="">YYYY/MM/DD 00:00:00 am</time>
            </td>
            <td>LFS-753-67510</td>
            <td>
              <span className="label label-primary">View Ticket</span>
            </td>
          </tr>
          <tr>
            <td><span className="sprites ticket-min-red"></span></td>
            <td>
              <i className="fa fa-credit-card-alt billing" aria-hidden="true"></i>  Billing
            </td>
            <td>
              <span className="sprites priority-2"></span>
            </td>
            <td>Servername - front 123</td>
            <td>
              <time datetime="">YYYY/MM/DD 00:00:00 am</time>
            </td>
            <td>LFS-753-67510</td>
            <td>
              <span className="label label-primary">View Ticket</span>
            </td>
          </tr>
          <tr>
            <td><span className="sprites ticket-min-red"></span></td>
            <td>
              <span className="sprites ninja-icon"></span>  Ninja Support
            </td>
            <td>
              <span className="sprites priority-2"></span>
            </td>
            <td>Servername - front 123</td>
            <td>
              <time datetime="">YYYY/MM/DD 00:00:00 am</time>
            </td>
            <td>LFS-753-67510</td>
            <td>
              <span className="label label-primary">View Ticket</span>
            </td>
          </tr>
          <tr>
            <td><span className="sprites ticket-min-red"></span></td>
            <td>
              <span className="sprites sales"></span>  Sales
            </td>
            <td>
              <span className="sprites priority-2"></span>
            </td>
            <td>Servername - front 123</td>
            <td>
              <time datetime="">YYYY/MM/DD 00:00:00 am</time>
            </td>
            <td>LFS-753-67510</td>
            <td>
              <span className="label label-primary">View Ticket</span>
            </td>
          </tr>
        </table>
      </div>
    );
  }
});
