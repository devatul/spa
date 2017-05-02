var React                      = require('react');
var OnBoardingStore            = require('../stores/OnBoardingStore');
var SessionStore               = require('../stores/SessionStore');
var PublicCloudSection         = require('./Public_cloud_section.react');
var PrivateCloudSection        = require('./Private_cloud_section.react');
var OnPremiseCloudSection      = require('./On_premise_cloud_section.react');
var getProviders               = require('../actions/RequestActions').getProviders;
var saveURI                    = require('../actions/RequestActions').saveURI;
var redirect                   = require('../actions/RouteActions').redirect;
var _                          = require('lodash');

class OnboardingSection extends React.Component {
  constructor(props) {
    super(props);
    var providers = OnBoardingStore.getProviders();
    this.state = {
      providers:             providers,
      publicCloudProviders:  [],
      privateCloudProviders: [],
      onPremiseProviders:    [],
      title:                 'Manage your Public Cloud Connection',
    };
    this._onChange = this._onChange.bind(this);
    this.publicCloud = this.publicCloud.bind(this);
    this.privateCloud = this.privateCloud.bind(this);
    this.onPremise = this.onPremise.bind(this);
    this.updateURL = this.updateURL.bind(this);
    this._getURI = this._getURI.bind(this);
  }

  componentWillMount() {
    if (!SessionStore.isLoggedIn()) {
      saveURI();
      redirect('login');
    }
  }

  componentDidMount() {
    if (SessionStore.isLoggedIn()) {
      getProviders();
    } else {
      redirect('login');
    }
    OnBoardingStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    OnBoardingStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    var providers = OnBoardingStore.getProviders();
    this.setState({
      providers:             providers,
      publicCloudProviders:  _.filter(providers, function (o) { return 'public' === o.classification; }),
      privateCloudProviders: _.filter(providers, function (o) { return 'private' === o.classification; }),
      onPremiseProviders:    _.filter(providers, function (o) { return 'on-premise' === o.classification; }),
    });
  }

  publicCloud() {
    $('#public-cloud-content').removeClass('hidden');
    $('#private-cloud-content').addClass('hidden');
    this.setState({
      title: 'Manage your Public Cloud Connection',
    });
  }

  privateCloud() {
    $('#private-cloud-content').removeClass('hidden');
    $('#public-cloud-content').addClass('hidden');
    this.setState({
      title: 'Manage your Private Cloud Connection',
    });
  }

  onPremise() {
    this.setState({
      title: 'Manage your On-Premise server Connection',
    });
  }

  updateURL(sectionId, pageNo) {
    this.setState({
      pageNo: pageNo,
    });
    var hash = window.location.href.split('/onboarding');
    window.location.href = hash[0] + '/onboarding' + sectionId + '#page=' + pageNo;
  }

  _getURI() {
    var hash = window.location.href.split('/onboarding')[1] || '';
    var pageNo = 1;
    if ('' !== hash) {
      var arr = hash.split('#page=');
      hash = arr[0];
      pageNo = parseInt(arr[1]);
    }
    return {hash: hash, pageNo: pageNo};
  }

  render() {
    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
    }

    var _uri = this._getURI();
    var pageNo = _uri.pageNo;
    var hash = _uri.hash;
    var _SELF = this;

    return (
      <div className="main-section-cloud">
        <div className="section-title">
          <span className="item title">{this.state.title}</span>
        </div>
        <div role="navigation">
          <ul className="nav nav-tabs section-tabs">
            <li role="presentation" className={'#public' === hash || '' === hash ? 'active' : ''} onClick={this.publicCloud}>
              <a className="grey-color" data-toggle="tab" href="#public" onClick={function () { _SELF.updateURL('#public', 1); }}>
                <i className="fa fa-cloud" aria-hidden="true"></i> Public Cloud
              </a>
            </li>
            <li role="presentation" className={'#private' === hash ? 'active' : ''} onClick={this.privateCloud}>
              <a className="grey-color" data-toggle="tab" href="#private" onClick={function () { _SELF.updateURL('#private', 1); }}>
                <i className="fa fa-cloud" aria-hidden="true"></i> Private Cloud
              </a>
            </li>
            <li role="presentation" className={'#onPremise' === hash ? 'active' : ''} onClick={this.onPremise}>
              <a className="grey-color" data-toggle="tab" href="#onPremise" onClick={function () { _SELF.updateURL('#onPremise', 1); }}>
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
          <div id="public" className={'tab-pane fade ' + ('#public' === hash || '' === hash ? 'in active' : '')}>
            <PublicCloudSection
              allProviders={this.state.providers}
              providers={this.state.publicCloudProviders}
              page_no={pageNo}
              callUpdateURL={function (page) { _SELF.updateURL('#public', page); }} />
          </div>
          <div id="private" className={'tab-pane fade ' + ('#private' === hash ? 'in active' : '')}>
            <PrivateCloudSection allProviders={this.state.providers} providers={this.state.privateCloudProviders} page_no={pageNo} callUpdateURL={function (page) { _SELF.updateURL('#private', page); }} />
          </div>
          <div id="onPremise" className={'tab-pane fade ' + ('#onPremise' === hash ? 'in active' : '')}>
            <OnPremiseCloudSection allProviders={this.state.providers} providers={this.state.onPremiseProviders} page_no={pageNo} callUpdateURL={function (page) { _SELF.updateURL('#onPremise', page); }} />
          </div>
        </div>
      </div>
    );
  }
}

module.exports = OnboardingSection;
