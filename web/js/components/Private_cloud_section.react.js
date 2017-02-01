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
    $("#privateCloudProvidersList").css({width: width+"px"});
  },

  scroll: function (arrow) {
    var width = this.props.providers.length*150;
    var view = $("#privateCloudProvidersList");
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

  limit: 5,
  sectionKey: '_PRIVATE',
  editModalId: "editModalPrivate",

  componentDidMount: function () {
    OnBoardingStore.addChangeListener(this._onChange);
    getProviderCredential(this.sectionKey, this.state.pageNo, this.limit);
  },

  componentWillUnmount: function () {
    OnBoardingStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function (props) {
    var width = props.providers.length*150 || 600;
    $("#privateCloudProvidersList").css({width: width+"px"});
  },

  _onChange: function () {
    if (this.isMounted()) {
      var privateCloud = OnBoardingStore.getProviderCredentialPrivate();
      var credentialDetails = OnBoardingStore.getCredentialDetails();
      this.setState({
        connectedPrivateCloud: privateCloud.member,
        totalItems: privateCloud.totalItems,
        totalPages: Math.ceil(parseInt(privateCloud.totalItems)/5),
        credentialDetails: credentialDetails,
      });
    }
  },

  _scroll: function (arrow) {
    var width = this.props.providers.length*150;
    var view = $("#privateCloudProvidersList");
    var move = "100px";
    var sliderLimit = -(width-700);
    if ('leftArrow' == arrow) {
      var currentPosition = parseInt(view.css("left"));
      if (0 > currentPosition) view.stop(false,true).animate({left:"+="+move},{ duration: 400})
    } else {
      var currentPosition = parseInt(view.css("left"));
      if (currentPosition >= sliderLimit) view.stop(false,true).animate({left:"-="+move},{ duration: 400})
    }
  },

  _revealFirstStepOfPrivateCloud: function () {
    $('#private1StepTitle').removeClass('hidden');
    $('#private1StepContent').removeClass('hidden');
    $('#privateCancelButton').removeClass('hidden');
    $('#privateAddButton').addClass('hidden');
  },

  _revealSecondStepOfPrivateCloud: function () {
    $('#private2StepTitle').removeClass('hidden');
    $('#private2StepContent').removeClass('hidden');
  },

  revertPrivateSteps: function () {
    $('#private1StepTitle').addClass('hidden');
    $('#private1StepContent').addClass('hidden');
    $('#private2StepTitle').addClass('hidden');
    $('#private2StepContent').addClass('hidden');
    $('#privateCancelButton').addClass('hidden');
    $('#privateAddButton').removeClass('hidden');
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

  explorePrivateStep2: function (provider, id) {
    $('.clouds-icons-button').addClass('non-selected-provider-step1').removeClass('selected-provider-step1');
    $("#"+id+'.clouds-icons-button').addClass('selected-provider-step1').removeClass('non-selected-provider-step1');
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
    _.map(providers, function (provider, i) {
      if (null != provider.logo) {
        rows.push(
          <div id={"pvtPro_"+i} className="col-md-2 clouds-icons-button" onClick={function () {_SELF.explorePrivateStep2(provider, "pvtPro_"+i)}}>
            <img src={provider.logo.public_path} ></img>
            <p className="aws-text">{provider.name}</p>
          </div>
        );
      } else {
        rows.push(
          <div id={"pvtPro_"+i} className="col-md-2 clouds-icons-button" onClick={function () {_SELF.explorePrivateStep2(provider, "pvtPro_"+i)}}>
            <div className="clouds-icons aws"></div>
            <p className="aws-text">{provider.name}</p>
          </div>
        );
      }
    });

    var certificate = this.state.credentialType.certificate;
    return (
      <div>
        <button className="transparent-button" onClick={this._revealFirstStepOfPrivateCloud} id="privateAddButton">
          <i id="buttonPrivateToClick" className="fa fa-plus-circle big-green-circle" aria-hidden="true"></i>
          <span id="privateTextToClick"> Add New Private Cloud Connection</span>
        </button>
        <button className="transparent-button hidden" onClick={this._revertPrivateSteps} id="privateCancelButton">
          <i  className="fa fa-minus-circle big-red-circle" aria-hidden="true"></i>
          <span>  Cancel Private Cloud Connection</span>
        </button>
        <div className="hidden" id="private1StepTitle">
          <div className="round-number number-1">1</div>
          <span>Select your Private Cloud</span>
        </div>
        <div className="row hidden" id="private1StepContent">
          <div className="col-lg-8 col-lg-offset-2">
            <div className="col-lg-1 scroll-step1" onClick={function () {_SELF.scroll('leftArrow')}}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </div>
              <div id="viewContainer" className="col-lg-11 public-cloud-selector-div">
                <div id="privateCloudProvidersList" className="list-providers">
                  {rows}
                </div>
              </div>
            <div className="col-lg-1 scroll-step1" onClick={function () {_SELF.scroll('rightArrow')}}>
              <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div className="hidden" id="private2StepTitle">
          <div className="round-number number-2">2</div>
          <span>Complete your cloud information</span>
        </div>
        <div className="row hidden" id="private2StepContent">
          <form className="public-cloud-form col-lg-offset-1 col-lg-5">
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
      </div>
    );
  },
});
