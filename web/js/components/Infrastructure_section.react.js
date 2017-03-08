var React                         = require('react');
var Router                        = require('../router');
var redirect                      = require('../actions/RouteActions').redirect;
var SessionStore                  = require('../stores/SessionStore');
var InfrastructureStore           = require('../stores/InfrastructureStore');
var InfrastructureOverview        = require('./Infrastructure_overview.react');
var InfrastructurePublicCloud     = require('./Infrastructure_public_cloud_section.react');
var InfrastructurePrivateCloud    = require('./Infrastructure_private_cloud_section.react');
var InfrastructureOnPremise       = require('./Infrastructure_on_premise_section.react');
var Link                          = require('react-router').Link;
var Tooltip                       = require('react-bootstrap').Tooltip;
var OverlayTrigger                = require('react-bootstrap').OverlayTrigger;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      pageNo: 1,
    };
  },

  componentWillMount: function () {
    if (!SessionStore.isLoggedIn()) {
      redirect('login');
    }
  },

  updateURL: function (sectionId, pageNo) {
    this.setState({
      pageNo: pageNo,
    });
    var hash = window.location.href.split('/infrastructure');
    window.location.href = hash[0]+'/infrastructure'+sectionId+'#page='+pageNo;
  },
  render: function () {
    var overviewTooltip = (<Tooltip id="tooltip">Overview</Tooltip>);
    var publicTooltip = (<Tooltip id="tooltip">Public Cloud</Tooltip>);
    var privateTooltip = (<Tooltip id="tooltip">Private Cloud</Tooltip>);
    var onPremiseTooltip = (<Tooltip id="tooltip">On-premise servers</Tooltip>);
    var networkTooltip = (<Tooltip id="tooltip">Network devices</Tooltip>);
    var businessTooltip = (<Tooltip id="tooltip">Business App</Tooltip>);
    var containerTooltip = (<Tooltip id="tooltip">Containers</Tooltip>);
    var hash = window.location.href.split('/infrastructure')[1] || '';
    var pageNo  = 1;
    if ('' !== hash) {
      var arr = hash.split('#page=');
      hash = arr[0];
      pageNo = parseInt(arr[1]);
    }
    var _SELF=this;

    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Manage and monitor your infrastructure</h2>
        </div>
        <div>
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className={('#overview' == hash || '' == hash)? 'active' : ''}>
              <OverlayTrigger placement="top" overlay={overviewTooltip}>
                <Link to="/infrastructure#overview" className="grey-color" data-toggle="tab" onClick={function () {_SELF.updateURL('#overview', 1);}}>
                  <i className="icon nb-eye small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Overview</span>
                </Link>
              </OverlayTrigger>
            </li>
            <li role="presentation" className={'#public' == hash ? 'active' : ''}>
              <OverlayTrigger placement="top" overlay={publicTooltip}>
                <Link to="/infrastructure#public" className="grey-color" data-toggle="tab" onClick={function () {_SELF.updateURL('#public', 1);}}>
                  <i className="icon nb-cloud-public small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Public Cloud</span>
                </Link>
              </OverlayTrigger>
            </li>
            <li role="presentation" className={'#private' == hash ? 'active' : ''}>
              <OverlayTrigger placement="top" overlay={privateTooltip}>
                <Link to="/infrastructure#private" className="grey-color" data-toggle="tab" onClick={function () {_SELF.updateURL('#private', 1);}}>
                  <i className="icon nb-cloud-private small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Private Cloud</span>
                </Link>
              </OverlayTrigger>
            </li>
            <li role="presentation" className={'#onPremise' == hash ? 'active' : ''}>
              <OverlayTrigger placement="top" overlay={onPremiseTooltip}>
                <Link to="/infrastructure#onPremise" className="grey-color" data-toggle="tab" onClick={function () {_SELF.updateURL('#onPremise', 1);}}>
                  <i className="icon nb-servers small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> On-premise servers</span>
                </Link>
              </OverlayTrigger>
            </li>
            <li role="presentation" className="disabled hidden-xs hidden-sm hidden">
              <OverlayTrigger placement="top" overlay={networkTooltip}>
                <a className="grey-color">
                  <i className="icon nb-network small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Network devices</span>
                </a>
              </OverlayTrigger>
            </li>
            <li role="presentation" className="disabled hidden-xs hidden-sm hidden">
              <OverlayTrigger placement="top" overlay={businessTooltip}>
                <a className="grey-color">
                  <i className="icon nb-apps small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Business App</span>
                </a>
              </OverlayTrigger>
            </li>
            <li role="presentation" className="disabled hidden-xs hidden-sm hidden">
              <OverlayTrigger placement="top" overlay={containerTooltip}>
                <a className="grey-color">
                  <i className="icon nb-container small" aria-hidden="true"></i><span className="hidden-xs hidden-sm"> Containers</span>
                </a>
              </OverlayTrigger>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="overview" className={'tab-pane fade ' + ('#overview' == hash || '' == hash ? 'in active' : '')}>
            <InfrastructureOverview page_no={pageNo} callUpdateURL={function (page) {_SELF.updateURL('#overview', page);}}/>
          </div>
          <div id="public" className={'tab-pane fade ' + ('#public' == hash ? 'in active' : '')}>
            <InfrastructurePublicCloud page_no={pageNo} callUpdateURL={function (page) {_SELF.updateURL('#public', page);}}/>
          </div>
          <div id="private" className={'tab-pane fade ' + ('#private' == hash ? 'in active' : '')}>
            <InfrastructurePrivateCloud page_no={pageNo} callUpdateURL={function (page) {_SELF.updateURL('#private', page);}}/>
          </div>
          <div id="onPremise" className={'tab-pane fade ' + ('#onPremise' == hash ? 'in active' : '')}>
            <InfrastructureOnPremise page_no={pageNo} callUpdateURL={function (page) {_SELF.updateURL('#onPremise', page);}}/>
          </div>
        </div>
      </div>
    );
  },
});
