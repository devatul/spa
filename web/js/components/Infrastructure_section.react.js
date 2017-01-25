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

module.exports = React.createClass({
  getInitialState: function () {
    return {
      pageNo: 1,
    };
  },
  updateURL: function (sectionId, pageNo) {
    this.setState({
      pageNo: pageNo,
    });
    var hash = window.location.href.split('/infrastructure');
    window.location.href = hash[0]+'/infrastructure'+sectionId+'#page='+pageNo;
  },
  render: function () {
    var hash = window.location.href.split('/infrastructure')[1] || '';
    var pageNo  = 1;
    if ('' !== hash) {
      var arr = hash.split('#page=');
      hash = arr[0];
      pageNo = parseInt(arr[1]);
    }
    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Manage and monitor your infrastructure</h2>
        </div>
        <div>
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className={(hash == '#overview' || hash == '')? "active" : ""}>
              <Link to="/infrastructure#overview" className="grey-color" data-toggle="tab" onClick={function () {_SELF.updateURL('#overview', 1)}}>
                <i className="icon nb-eye small" aria-hidden="true"></i> Overview
              </Link>
            </li>
            <li role="presentation" className={hash == '#public' ? "active" : ""}>
              <Link to="/infrastructure#public" className="grey-color" data-toggle="tab" onClick={function () {_SELF.updateURL('#public', 1)}}>
                <i className="icon nb-cloud-public small" aria-hidden="true"></i> Public Cloud
              </Link>
            </li>
            <li role="presentation" className={hash == '#private' ? "active" : ""}>
              <Link to="/infrastructure#private" className="grey-color" data-toggle="tab" onClick={function () {_SELF.updateURL('#private', 1)}}>
                <i className="icon nb-cloud-private small" aria-hidden="true"></i> Private Cloud
              </Link>
            </li>
            <li role="presentation" className={hash == '#on-premise' ? "active" : ""}>
              <Link to="/infrastructure#on-premise" className="grey-color" data-toggle="tab" onClick={function () {_SELF.updateURL('#on-premise', 1)}}>
                <i className="icon nb-servers small" aria-hidden="true"></i> On-premise servers
              </Link>
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
          <div id="overview" className={"tab-pane fade " + (hash == '#overview' || hash == '' ? "in active" : "")}>
            <InfrastructureOverview page_no={pageNo} callUpdateURL={function (page) {_SELF.updateURL('#overview', page)}}/>
          </div>
          <div id="public" className={"tab-pane fade " + (hash == '#public' ? "in active" : "")}>
            <InfrastructurePublicCloud page_no={pageNo} callUpdateURL={function (page) {_SELF.updateURL('#public', page)}}/>
          </div>
          <div id="private" className={"tab-pane fade " + (hash == '#private' ? "in active" : "")}>
            <InfrastructurePrivateCloud page_no={pageNo} callUpdateURL={function (page) {_SELF.updateURL('#private', page)}}/>
          </div>
          <div id="on-premise" className={"tab-pane fade " + (hash == '#on-premise' ? "in active" : "")}>
            <InfrastructureOnPremise page_no={pageNo} callUpdateURL={function (page) {_SELF.updateURL('#on-premise', page)}}/>
          </div>
        </div>
      </div>
    );
  },
});
