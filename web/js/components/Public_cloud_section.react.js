var React                      = require('react');
var redirect                   = require('../actions/RouteActions').redirect;

module.exports = React.createClass({
  _goToAlerts: function () {
    redirect('alerts');
  },

  revealFirstStep: function () {
    $('#onBoarding1StepTitle').removeClass('hidden');
    $('#onBoarding1StepContent').removeClass('hidden');
    $('#cancelButton').removeClass('hidden');
    $('#addButton').addClass('hidden');
  },

  revealSecondStep: function () {
    $('#onBoarding2StepTitle').removeClass('hidden');
    $('#onBoarding2StepContent').removeClass('hidden');
  },

  revertPublicSteps: function () {
    $('#onBoarding1StepTitle').addClass('hidden');
    $('#onBoarding1StepContent').addClass('hidden');
    $('#onBoarding2StepTitle').addClass('hidden');
    $('#onBoarding2StepContent').addClass('hidden');
    $('#cancelButton').addClass('hidden');
    $('#addButton').removeClass('hidden');
  },

  render: function () {
    var providers = this.props.providers;
    var rows = [];
    for (var key in providers) {
      if (null != providers[key].logo) {
        rows.push(
          <div className="col-md-2 clouds-icons-button">
            <img src={providers[key].logo.public_path} ></img>
            <p className="aws-text">{providers[key].name}</p>
          </div>
        );
      } else {
        rows.push(
          <div className="col-md-2 clouds-icons-button">
            <div className="clouds-icons aws"></div>
            <p className="aws-text">{providers[key].name}</p>
          </div>
        );
      }
    }

    return (
      <div>
        <button className="transparent-button" onClick={this.revealFirstStep} id="addButton">
          <i  className="fa fa-plus-circle big-green-circle" aria-hidden="true"></i>
          <span>  Add New Public Cloud Connection</span>
        </button>
        <button className="transparent-button hidden" onClick={this.revertPublicSteps} id="cancelButton">
          <i  className="fa fa-minus-circle big-red-circle" aria-hidden="true"></i>
          <span>  Cancel Public Cloud Connection</span>
        </button>
        <div className="hidden" id="onBoarding1StepTitle">
          <div className="round-number number-1">1</div>
          <span>Select your Public Cloud</span>
        </div>
        <div className="row hidden" id="onBoarding1StepContent" onClick={this.revealSecondStep}>
          <div className="col-lg-8 col-lg-offset-2 public-cloud-selector-div">
            {rows}
          </div>
        </div>
        <div className="hidden" id="onBoarding2StepTitle">
          <div className="round-number number-2">2</div>
          <span>Complete your cloud information</span>
        </div>
        <div className="row hidden" id="onBoarding2StepContent">
          <div className="col-lg-offset-1 col-lg-4"></div>
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
        <div>
          <i className="fa fa-cloud" aria-hidden="true"></i>
          <span>Connected Public Cloud</span>
        </div>
      </div>  
    );
  },
});
