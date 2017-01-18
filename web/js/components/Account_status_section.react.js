var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');

module.exports = React.createClass({

  render: function () {
    return (
      <div>
        <div className="section-title">
          <h2>Account Status</h2>
        </div>
        <hr/>
        <div className="col-xs-12">
          <table className="table table-condensed">
            <tr>
              <th className="light-grey-background">Cloud Name</th>
              <th className="light-grey-background">Server</th>
              <th className="light-grey-background">Memory</th>
              <th className="light-grey-background">Monitoring</th>
              <th className="light-grey-background">Ninja Support</th>
              <th className="light-grey-background">Monthly price</th>
            </tr>
            <tr>
              <td>front 2</td>
              <td>server - bla bla</td>
              <td>GB</td>
              <td>
                <i className="fa fa-check-circle green-icon" aria-hidden="true"></i>
              </td>
              <td>
                <i className="fa fa-check-circle green-icon" aria-hidden="true"></i>
              </td>
              <td>$00,00</td>
            </tr>
            <tr>
              <td>front 1</td>
              <td>server - bla bla</td>
              <td>GB</td>
              <td>
                <i className="fa fa-check-circle green-icon" aria-hidden="true"></i>
              </td>
              <td>
                <i className="fa fa-check-circle green-icon" aria-hidden="true"></i>
              </td>
              <td>$00,00</td>
            </tr>
            <tr>
              <td>back 1</td>
              <td>server - bla bla</td>
              <td>GB</td>
              <td>
                <i className="fa fa-check-circle green-icon" aria-hidden="true"></i>
              </td>
              <td>
                <i className="fa fa-check-circle green-icon" aria-hidden="true"></i>
              </td>
              <td>$00,00</td>
            </tr>
            <tr>
              <td>back 2</td>
              <td>server - bla bla</td>
              <td>GB</td>
              <td>
                <i className="fa fa-check-circle green-icon" aria-hidden="true"></i>
              </td>
              <td>
                <i className="fa fa-check-circle green-icon" aria-hidden="true"></i>
              </td>
              <td>$00,00</td>
            </tr>
          </table>
        </div>
        <div className="col-sm-12">
          <button type="button" className="btn btn-success pull-right public-cloud-button">Save</button>
        </div>
      </div>
    );
  },
});
