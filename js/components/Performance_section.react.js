var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var CustomPerformance          = require('./Custom_performance.react');

module.exports = React.createClass({

  render: function() {
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center"><span>Customize your infrastructure's performance</span></h2>
        </div>
        <div>
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className="active">
              <a className="grey-color" href="#">Infrastructure Performance</a>
            </li>
            <li role="presentation">
              <a className="grey-color" href="#">Custom Performance Dashboards</a>
            </li>
          </ul>
        </div>
        <div className="section-content">
          <CustomPerformance/>
        </div>
        <div className="col-xs-6"></div>
        <div className="col-xs-6"></div>
      </div>
    );
  }
});
