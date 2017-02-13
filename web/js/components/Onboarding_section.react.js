var React                      = require('react');
var OnBoardingStore            = require('../stores/OnBoardingStore');
var SessionStore               = require('../stores/SessionStore');
var PublicCloudSection         = require('./Public_cloud_section.react');
var PrivateCloudSection        = require('./Private_cloud_section.react');
var OnPremiseCloudSection      = require('./On_premise_cloud_section.react');
var getProviders               = require('../actions/RequestActions').getProviders;
var _                          = require('lodash');

module.exports = React.createClass({
  getInitialState: function () {
    var providers = OnBoardingStore.getProviders();
    return {
      providers: providers,
      publicCloudProviders: [],
      privateCloudProviders: [],
      onPremiseProviders: [],
      title: 'Manage your Public Cloud Connection',
    };
  },

  componentWillMount: function () {
    if (!SessionStore.isLoggedIn()) {
      redirect('login');
    }
  },

  componentDidMount: function () {
    getProviders();
    OnBoardingStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    OnBoardingStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var providers = OnBoardingStore.getProviders();
      this.setState({
        providers: providers,
        publicCloudProviders: _.filter(providers, function (o) {return "public" == o.classification}),
        privateCloudProviders: _.filter(providers, function (o) {return "private" == o.classification}),
        onPremiseProviders: _.filter(providers, function (o) {return "on-premise" == o.classification}),
      });
    }
  },

  publicCloud: function () {
    $('#public-cloud-content').removeClass('hidden');
    $('#private-cloud-content').addClass('hidden');
    this.setState({
      title: 'Manage your Public Cloud Connection',
    });
  },

  privateCloud: function () {
    $('#private-cloud-content').removeClass('hidden');
    $('#public-cloud-content').addClass('hidden');
    this.setState({
      title: 'Manage your Private Cloud Connection',
    });
  },

  onPremise: function () {
    this.setState({
      title: 'Manage your On-Premise server Connection',
    });
  },

  render: function () {
    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">{this.state.title}</h2>
        </div>
        <div role="navigation">
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className="active" onClick={this.publicCloud}>
              <a className="grey-color" data-toggle="tab" href="#public">
                <i className="fa fa-cloud" aria-hidden="true"></i> Public Cloud
              </a>
            </li>
            <li role="presentation" onClick={this.privateCloud}>
              <a className="grey-color" data-toggle="tab" href="#private">
                <i className="fa fa-cloud" aria-hidden="true"></i> Private Cloud
              </a>
            </li>
            <li role="presentation" onClick={this.onPremise}>
              <a className="grey-color" data-toggle="tab" href="#onPremise">
                <i className="fa fa-server" aria-hidden="true"></i> On-premise servers
              </a>
            </li>
            <li role="presentation" className="hidden">
              <a className="grey-color" data-toggle="tab" href="#onPremise">
                <i className="fa fa-sitemap" aria-hidden="true"></i> Network devices
              </a>
            </li>
            <li role="presentation" className="hidden">
              <a className="grey-color" data-toggle="tab" href="#onPremise">
                <i className="fa fa-th" aria-hidden="true"></i> Business App
              </a>
            </li>
            <li role="presentation" className="hidden">
              <a className="grey-color" data-toggle="tab" href="#onPremise">
                <i className="fa fa-cube" aria-hidden="true"></i> Containers
              </a>
            </li>
          </ul>
        </div>
        <div className="tab-content section-content">
          <div id="public" className="tab-pane fade in active">
            <PublicCloudSection allProviders={this.state.providers} providers={this.state.publicCloudProviders}/>
          </div>
          <div id="private" className="tab-pane fade">
            <PrivateCloudSection allProviders={this.state.providers} providers={this.state.privateCloudProviders}/>
          </div>
          <div id="menu2" className="tab-pane fade">
            <OnPremiseCloudSection allProviders={this.state.providers} providers={this.state.onPremiseProviders}/>
          </div>
        </div>
      </div>
    );
  },
});
