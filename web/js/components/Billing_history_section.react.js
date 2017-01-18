var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');

module.exports = React.createClass({

  render: function () {
    return (
      <div>
        <div className="section-title">
          <h2>Billing history</h2>
        </div>
        <hr/>
        <div className="col-xs-12">
          <table className="table table-condensed">
            <thead>
              <tr>
                <th className="light-grey-background">Period</th>
                <th className="light-grey-background">Statement</th>
                <th className="light-grey-background">Payment</th>
                <th className="light-grey-background">Total</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>
                  <time>6/6/2015</time>
                  <span> - </span>
                  <time>7/7/2015</time>
                </th>
                <td>
                  <a>Download</a>
                </td>
                <td>
                  <a>Pagar</a>
                </td>
                <td>$2,85</td>
              </tr>
              <tr>
                <th>
                  <time>6/6/2015</time>
                  <span> - </span>
                  <time>7/7/2015</time>
                </th>
                <td>
                  <a>Download</a>
                </td>
                <td>
                  <a>Pagar</a>
                </td>
                <td>$2,85</td>
              </tr>
              <tr>
                <th>
                  <time>6/6/2015</time>
                  <span> - </span>
                  <time>7/7/2015</time>
                </th>
                <td>
                  <a>Download</a>
                </td>
                <td>
                  <a>Pagar</a>
                </td>
                <td>$2,85</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  },
});
