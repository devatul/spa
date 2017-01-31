var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var PublicCloudSection         = require('./Public_cloud_section.react');
var PrivateCloudSection        = require('./Private_cloud_section.react');
var getCloudInputField         = require('./function').getCloudInputField;
var _                          = require('lodash');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      credentialType: false,
    };
  },

  _goToAlerts: function () {
    redirect('alerts');
  },

  revealFirstStepOfPrivateCloud: function () {
    $('#onPremise1StepTitle').removeClass('hidden');
    $('#onPremise1StepContent').removeClass('hidden');
    $('#onPremiseCancelButton').removeClass('hidden');
    $('#onPremiseAddButton').addClass('hidden');
  },

  revealSecondStepOfPrivateCloud: function () {
    $('#onPremise2StepTitle').removeClass('hidden');
    $('#onPremise2StepContent').removeClass('hidden');
  },

  revertPrivateSteps: function () {
    $('#onPremise1StepTitle').addClass('hidden');
    $('#onPremise1StepContent').addClass('hidden');
    $('#onPremise2StepTitle').addClass('hidden');
    $('#onPremise2StepContent').addClass('hidden');
    $('#onPremiseCancelButton').addClass('hidden');
    $('#onPremiseAddButton').removeClass('hidden');
    this.setState({
      credentialType: false,
    });
  },

  exploreOnPremiseStep2: function (provider) {
    var credetials = this.state.credentialType;
    if (!credetials) {
      this.revealSecondStepOfPrivateCloud();
    }
    this.setState({
      credentialType: provider.requirements,
    });
  },

  render: function () {
    var providers = this.props.providers;
    var _SELF = this;
    var rows = [];
    _.map(providers, function (provider) {
      if (null != provider.logo) {
        rows.push(
          <div className="col-md-2 clouds-icons-button" onClick={function () {_SELF.exploreOnPremiseStep2(provider)}}>
            <img src={provider.logo.public_path} ></img>
            <p className="aws-text">{provider.name}</p>
          </div>
        );
      } else {
        rows.push(
          <div className="col-md-2 clouds-icons-button" onClick={function () {_SELF.exploreOnPremiseStep2(provider)}}>
            <div className="clouds-icons aws"></div>
            <p className="aws-text">{provider.name}</p>
          </div>
        );
      }
    });
    return (
      <div>
        <button className="transparent-button" onClick={this.revealFirstStepOfPrivateCloud} id="onPremiseAddButton">
          <i className="fa fa-plus-circle big-green-circle" aria-hidden="true"></i>
          <span> Add New Private Cloud Connection</span>
        </button>
        <button className="transparent-button hidden" onClick={this.revertPrivateSteps} id="onPremiseCancelButton">
          <i  className="fa fa-minus-circle big-red-circle" aria-hidden="true"></i>
          <span>  Cancel Public Cloud Connection</span>
        </button>
        <div className="hidden" id="onPremise1StepTitle">
          <div className="round-number number-1">1</div>
          <span>Select your Private Cloud</span>
        </div>
        <div className="row hidden" id="onPremise1StepContent">
          <div className="col-lg-8 col-lg-offset-2 public-cloud-selector-div">
            {rows}
          </div>
        </div>
        <div className="hidden" id="onPremise2StepTitle">
          <div className="round-number number-2">2</div>
          <span>Complete your cloud information</span>
        </div>
        <div className="row hidden" id="onPremise2StepContent">
          <form className="public-cloud-form col-lg-offset-1 col-lg-4">
            {getCloudInputField(this.state.credentialType)}
            <button type="button" className="btn btn-success pull-right public-cloud-button">Save</button>
            <button type="button" className="btn btn-default pull-right public-cloud-button grey-background">Cancel</button>
          </form>
          <div className="col-lg-5 centered">
            <p className="aws-text">How to integrate AWS with Nubity?</p>
            <a>
              <i className="fa fa-play-circle-o play-tutorial" aria-hidden="true"></i>
            </a>
            <p className="aws-text">Watch the video tutorial or</p>
            <p className="aws-text">start live chat with Ninja Support</p>
          </div>
        </div>
        <hr/>
      </div>
    );
  },
});