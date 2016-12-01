var React                         = require('react');
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var getInfrastructureOverview     = require('../actions/RequestActions').getInfrastructureOverview;
var getInfrastructurePublicCloud  = require('../actions/RequestActions').getInfrastructurePublicCloud;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var InfrastructureOverview        = require('./Infrastructure_overview.react');
var InfrastructurePublicCloud     = require('./Infrastructure_public_cloud_section.react');
var InfrastructurePrivateCloud    = require('./Infrastructure_overview.react');
var InfrastructureOnPremise       = require('./Infrastructure_overview.react');

module.exports = React.createClass({
  getInitialState: function() {
    return {
      overview: '',
    };
  },

  componentDidMount: function() {
    getInfrastructureOverview(0);
    getInfrastructurePublicCloud();
    InfrastructureStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    InfrastructureStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    if (this.isMounted()) {
      var overview = InfrastructureStore.getInfrastructureOverview();
      this.setState({
        overview: overview.member,
      });
    }
  },

  render: function() {
    overview = this.state.overview;
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Manage and monitor your infrastructure</h2>
        </div>
        <div>
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className="active">
              <a className="grey-color" data-toggle="tab" href="#infrastructureOverview">
                <i className="fa fa-eye" aria-hidden="true"></i> Overview
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#infrastructurePublic">
                <i className="fa fa-cloud" aria-hidden="true"></i> Public Cloud
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#infrastructurePrivate">
                <i className="fa fa-cloud" aria-hidden="true"></i> Private Cloud
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color"data-toggle="tab" href="#infrastructureOnPremise">
                <i className="fa fa-server" aria-hidden="true"></i> On-premise servers
              </a>
            </li>
            <li role="presentation" className="disabled">
              <a className="grey-color">
                <i className="fa fa-sitemap" aria-hidden="true"></i> Network devices
              </a>
            </li>
            <li role="presentation" className="disabled">
              <a className="grey-color">
                <i className="fa fa-th" aria-hidden="true"></i> Business App
              </a>
            </li>
            <li role="presentation" className="disabled">
              <a className="grey-color">
                <i className="fa fa-cube" aria-hidden="true"></i> Containers
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="infrastructureOverview" className="tab-pane fade in active ">
            <InfrastructureOverview overview={overview}/>
          </div>
          <div id="infrastructurePublic" className="tab-pane fade">
            <InfrastructurePublicCloud/>
          </div>
          <div id="infrastructurePrivate" className="tab-pane fade">
            <InfrastructurePrivateCloud/>
          </div>
          <div id="infrastructureOnPremise" className="tab-pane fade">
            <InfrastructureOnPremise/>
          </div>
        </div>
      </div>
    );
  }
});
