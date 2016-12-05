var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var PublicCloudSection         = require('./Public_cloud_section.react');
var PrivateCloudSection        = require('./Private_cloud_section.react');

module.exports = React.createClass({
  _goToAlerts: function () {
    redirect('alerts');
  },

  revealFirstStepOfPrivateCloud: function () {
    $('#private1StepTitle').removeClass('hidden');
    $('#private1StepContent').removeClass('hidden');
    $('#buttonPrivateToClick').addClass('clicked');
    $('#privateTextToClick').addClass('clicked');
  },

  revealSecondStepOfPrivateCloud: function () {
    $('#private2StepTitle').removeClass('hidden');
    $('#private2StepContent').removeClass('hidden');
  },

  render: function () {
    return (
      <div>
        <button className="transparent-button" onClick={this.revealFirstStepOfPrivateCloud}>
          <i id="buttonPrivateToClick" className="fa fa-plus-circle big-green-circle" aria-hidden="true"></i>
          <span id="privateTextToClick"> Add New Private Cloud Connection</span>
        </button>
        <div className="hidden" id="private1StepTitle">
          <div className="round-number number-1">1</div>
          <span>Select your Private Cloud</span>
        </div>
        <div className="row hidden" id="private1StepContent" onClick={this.revealSecondStepOfPrivateCloud}>
          <div className="col-lg-8 col-lg-offset-2 public-cloud-selector-div">
            <div className="col-md-2 clouds-icons-button">
              <div className="clouds-icons hiper-v"></div>
              <p className="aws-text">Hyper-V</p>
            </div>
            <div className="col-md-2 clouds-icons-button">
              <div className="clouds-icons vmware"></div>
              <p className="aws-text">VMWare</p>
            </div>
            <div className="col-md-2 clouds-icons-button">
              <div className="clouds-icons open-stack"></div>
              <p className="aws-text">OpenStack</p>
            </div>
            <div className="col-md-2 clouds-icons-button">
              <div className="clouds-icons cloud-stack"></div>
              <p className="aws-text">CloudStack</p>
            </div>
            <div className="col-md-2 clouds-icons-button">
              <div className="clouds-icons xen-server"></div>
              <p className="aws-text">XenServer</p>
            </div>
          </div>
        </div>
        <div className="hidden" id="private2StepTitle">
          <div className="round-number number-2">2</div>
          <span>Complete your cloud information</span>
        </div>
        <div className="row hidden" id="private2StepContent">
          <form className="public-cloud-form col-lg-offset-1 col-lg-4">
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="input-icon fa fa-user" aria-hidden="true"></i>
                </div>
                <input type="text" className="form-control no-shadow" id="privateUser" placeholder="Cuenta o usuario"/>
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="input-icon fa fa-lock" aria-hidden="true"></i>
                </div>
                <input type="text" className="form-control no-shadow" id="privatePassword" placeholder="Contraseña"/>
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="input-icon fa fa-server" aria-hidden="true"></i>
                </div>
                <input type="text" className="form-control no-shadow" id="integrationName" placeholder="Datacenter Virrey"/>
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="input-icon fa fa-cloud" aria-hidden="true"></i>
                </div>
                <input type="text" className="form-control no-shadow" id="privateNubityName" placeholder="Nombre en nubity"/>
              </div>
            </div>
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
