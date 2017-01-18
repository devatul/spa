var React                         = require('react');
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var InfrastructureOverview        = require('./Infrastructure_overview.react');
var InfrastructurePublicCloud     = require('./Infrastructure_public_cloud_section.react');
var InfrastructurePrivateCloud    = require('./Infrastructure_private_cloud_section.react');
var InfrastructureOnPremise       = require('./Infrastructure_on_premise_section.react');

module.exports = React.createClass({
  
  render: function () {
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Manage and monitor your infrastructure</h2>
        </div>
        <div>
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className="active">
              <a className="grey-color" data-toggle="tab" href="#infrastructureOverview">
                <i className="icon nb-eye small" aria-hidden="true"></i> Overview
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#infrastructurePublic">
                <i className="icon nb-cloud-public small" aria-hidden="true"></i> Public Cloud
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color" data-toggle="tab" href="#infrastructurePrivate">
                <i className="icon nb-cloud-private small" aria-hidden="true"></i> Private Cloud
              </a>
            </li>
            <li role="presentation">
              <a className="grey-color"data-toggle="tab" href="#infrastructureOnPremise">
                <i className="icon nb-servers small" aria-hidden="true"></i> On-premise servers
              </a>
            </li>
            <li role="presentation" className="disabled">
              <a className="grey-color">
                <i className="icon nb-network small" aria-hidden="true"></i> Network devices
              </a>
            </li>
            <li role="presentation" className="disabled">
              <a className="grey-color">
                <i className="icon nb-apps small" aria-hidden="true"></i> Business App
              </a>
            </li>
            <li role="presentation" className="disabled">
              <a className="grey-color">
                <i className="icon nb-container small" aria-hidden="true"></i> Containers
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="infrastructureOverview" className="tab-pane fade in active ">
            <InfrastructureOverview/>
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
  },
});
