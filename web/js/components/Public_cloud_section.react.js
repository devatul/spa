var React                      = require('react');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var PublicCloudSection         = require('./Public_cloud_section.react');
var PrivateCloudSection        = require('./Private_cloud_section.react');
var _                          = require('lodash');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      credentialType: false,
    };
  },

  componentDidMount: function () {
    $(".image-preview-input input:file").change(function () {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            $(".image-preview-input-title").text("Change Certificate");
            $(".image-preview-filename").text(file.name).removeClass('hidden');
        }
        reader.readAsDataURL(file);
    });
  },

  componentWillReceiveProps: function (props) {
    var width = props.providers.length*150 || 600;
    $("#publicCloudProvidersList").css({width: width+"px"});
  },

  scroll: function (arrow) {
    var width = this.props.providers.length*150;
    var view = $("#publicCloudProvidersList");
    var move = "100px";
    var sliderLimit = -(width-700);
    if (arrow == 'leftArrow') {
      var currentPosition = parseInt(view.css("left"));
      if (currentPosition < 0) view.stop(false,true).animate({left:"+="+move},{ duration: 400})
    } else {
      var currentPosition = parseInt(view.css("left"));
      if (currentPosition >= sliderLimit) view.stop(false,true).animate({left:"-="+move},{ duration: 400})
    }
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
    this.setState({
      credentialType: false,
    });
  },

  getCloudInputField: function () {
    var credetials = this.state.credentialType;
    var input = [];
    input.push(
      <div className="form-group">
        <div className="input-group">
          <span className="input-group-addon"><i className="fa fa-cloud fa" aria-hidden="true"></i></span>
          <input type="text" className="form-control" placeholder="Integration Name"/>
        </div>
      </div>
    );
    if (credetials["api-key"]) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-key fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" placeholder="API Key"/>
          </div>
        </div>
      );
    }
    if (credetials.endpoint) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-user fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" placeholder="Access Key ID"/>
          </div>
        </div>
      );
    }
    if (credetials["api-secret"]) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-lock fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" placeholder="Secret Access Key"/>
          </div>
        </div>
      );
    }
    return input
  },

  explore2step: function (provider, id) {
    $('.clouds-icons-button').addClass('non-selected-provider-step1').removeClass('selected-provider-step1');
    $("#"+id+'.clouds-icons-button').addClass('selected-provider-step1').removeClass('non-selected-provider-step1');
    var credetials = this.state.credentialType;
    if (!credetials) {
      this.revealSecondStep();
    }
    this.setState({
      credentialType: provider.requirements,
    });
  },

  render: function () {
    var providers = this.props.providers;
    var _SELF = this;
    var rows = [];
    _.map(providers, function (provider, i) {
      if (null != provider.logo) {
        rows.push(
          <div id={"pubPro_"+i} className="col-md-2 clouds-icons-button" onClick={function () {_SELF.explore2step(provider, "pubPro_"+i)}}>
            <img src={provider.logo.public_path} ></img>
            <p className="aws-text">{provider.name}</p>
          </div>
        );
      } else {
        rows.push(
          <div  id={"pubPro_"+i} className="clouds-icons-button" onClick={function () {_SELF.explore2step(provider, "pubPro_"+i)}}>
            <div className="clouds-icons aws"></div>
            <p className="aws-text">{provider.name}</p>
          </div>
        );
      }
    });
    var certificate = this.state.credentialType.certificate;
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
        <div className="row hidden" id="onBoarding1StepContent">
          <div className="col-lg-8 col-lg-offset-2">
            <div className="col-lg-1 scroll-step1" onClick={function () {_SELF.scroll('leftArrow')}}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </div>
              <div id="viewContainer" className="col-lg-11 public-cloud-selector-div">
                <div id="publicCloudProvidersList" className="list-providers">
                  {rows}
                </div>
              </div>
            <div className="col-lg-1 scroll-step1" onClick={function () {_SELF.scroll('rightArrow')}}>
              <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div className="hidden" id="onBoarding2StepTitle">
          <div className="round-number number-2">2</div>
          <span>Complete your cloud information</span>
        </div>
        <div className="row hidden" id="onBoarding2StepContent">
          <form action="http://api.pricing.nubity.com/doc#post--company-{company_id}-cloud.{_format}" className="public-cloud-form col-lg-offset-1 col-lg-5">
            <div style={{paddingTop: '10px'}}>
              {this.getCloudInputField()}
              { certificate ?
                <div className="input-group image-preview">
                  <span className="input-group-btn">
                    <div className="btn btn-default image-preview-input">
                        <span className="glyphicon glyphicon-folder-open"></span>
                        <span className="image-preview-input-title">Upload Certificate</span>
                        <input type="file" name="input-file-preview"/>
                    </div>
                  </span>
                  <span className="form-control image-preview-filename hidden"></span>
              </div>:""}
              <button type="button" className="btn btn-success pull-right public-cloud-button">Save</button>
              <button type="button" className="btn btn-default pull-right public-cloud-button grey-background">Cancel</button>
            </div>
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
        <div>
          <i className="fa fa-cloud" aria-hidden="true"></i>
          <span>Connected Public Cloud</span>
        </div>
      </div>
    );
  },
});
