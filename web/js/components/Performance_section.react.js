var React                      = require('react');
var CustomPerformance          = require('./Custom_performance.react');
var SessionStore               = require('../stores/SessionStore');
var redirect                   = require('../actions/RouteActions').redirect;
var saveURI                    = require('../actions/RequestActions').saveURI;

module.exports = React.createClass({
  componentWillMount: function () {
    if (!SessionStore.isLoggedIn()) {
      saveURI();
      redirect('login');
    }
  },

  render: function () {
    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center"><span>Customize your infrastructure&#39;s performance</span></h2>
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
