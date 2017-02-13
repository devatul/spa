var React                      = require('react');
var CustomPerformance          = require('./Custom_performance.react');
var SessionStore               = require('../stores/SessionStore');
var redirect                   = require('../actions/RouteActions').redirect;

module.exports = React.createClass({
  componentWillMount: function () {
    if (!SessionStore.isLoggedIn()) {
      redirect('login');
    }
  },

  render: function () {
    if (!SessionStore.isLoggedIn()) {
      return(<div></div>)
    }
    
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center"><span>Customize your infrastructure&#39;s performance</span></h2>
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
  },
});
