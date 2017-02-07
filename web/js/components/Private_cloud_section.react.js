var React                      = require('react');
var redirect                   = require('../actions/RouteActions').redirect;
var OnBoardingStore            = require('../stores/OnBoardingStore');
var submitCloudData            = require('../actions/RequestActions').submitCloudData;
var getProviderCredential      = require('../actions/RequestActions').getProviderCredential;
var deleteProviderCredential   = require('../actions/RequestActions').deleteProviderCredential;
var _                          = require('lodash');
var moment                     = require('moment');

module.exports = React.createClass({
  getInitialState: function () {
    var connectedPrivateCloud = OnBoardingStore.getProviderCredentialPrivate();
    return {
      connectedPrivateCloud: connectedPrivateCloud,
      activeProvider: false,
      totalItems: connectedPrivateCloud.totalItems,
      totalPages: 0,
      pageNo: 1,
    };
  },

  componentDidMount: function () {
    OnBoardingStore.addChangeListener(this._onChange);
    getProviderCredential('_PRIVATE', this.state.pageNo, 5);
    $(".image-preview-input input:file").change(function () {
        var file = this.files[0];
        var reader = new FileReader();
        reader.onload = function (e) {
            $(".image-preview-input-title").text("Change Certificate");
            $(".image-preview-filename").text(file.name).removeClass('hidden');
        }
    });
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
      this.setState({
        connectedPrivateCloud: privateCloud.member,
        totalItems: privateCloud.totalItems,
        totalPages: Math.ceil(parseInt(privateCloud.totalItems)/5),
      });
    }
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

  revealFirstStepOfPrivateCloud: function () {
    $('#private1StepTitle').removeClass('hidden');
    $('#private1StepContent').removeClass('hidden');
    $('#privateCancelButton').removeClass('hidden');
    $('#privateAddButton').addClass('hidden');
  },

  revealSecondStepOfPrivateCloud: function () {
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
      activeProvider: false,
    });
  },

  submitData: function () {
    var providerId = this.state.activeProvider.provider;
    var integrationName = $("input[name='privateIntegrationName']").prop("value") || null;
    var apiKey = $("input[name='privateApiKey']").prop("value") || null;
    var endpoint = $("input[name='privateEndpoint']").prop("value") || null;
    var apiSecret = $("input[name='privateApiSecret']").prop("value") || null;
    var certificate = $("#privateCertificate").prop("files");
    var company = localStorage.getItem('nubity-company') || null;
    certificate = certificate && certificate[0] || null;

    var cloudData = new FormData();

    cloudData.append('name', integrationName);
    cloudData.append('api_key', apiKey);
    cloudData.append('endpoint', endpoint);
    cloudData.append('api_secret', apiSecret);
    cloudData.append('certificate', certificate);
    cloudData.append('provider_id', providerId);
    cloudData.append('company_id', company);

    submitCloudData(cloudData).then(function(){
      $("input[name='privateIntegrationName']").val('');
      $("input[name='privateApiKey']").val('');
      $("input[name='privateEndpoint']").val('');
      $("input[name='privateApiSecret']").val('');
      $("#privateCertificate").val('');
      $(".image-preview-input-title").text("Upload Certificate");
      $(".image-preview-filename").text('').addClass('hidden');
    });
  },

  getCloudInputField: function () {
    var credetials = this.state.activeProvider && this.state.activeProvider.requirements;
    var input = [];
    input.push(
      <div className="form-group">
        <div className="input-group">
          <span className="input-group-addon"><i className="fa fa-cloud fa" aria-hidden="true"></i></span>
          <input type="text" className="form-control" name="privateIntegrationName" placeholder="Integration Name"/>
        </div>
      </div>
    );
    if (credetials["api-key"]) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-key fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="privateApiKey" placeholder="API Key"/>
          </div>
        </div>
      );
    }
    if (credetials.endpoint) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-user fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="privateEndpoint" placeholder="Access Key ID"/>
          </div>
        </div>
      );
    }
    if (credetials["api-secret"]) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-lock fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="privateApiSecret" placeholder="Secret Access Key"/>
          </div>
        </div>
      );
    }
    return input
  },

  explorePrivateStep2: function (provider, id) {
    $('.private-cloud-provider').addClass('non-selected-provider-step1').removeClass('selected-provider-step1');
    $("#"+id+'.private-cloud-provider').addClass('selected-provider-step1').removeClass('non-selected-provider-step1');
    var credetials = this.state.activeProvider;
    if (!credetials) {
      this.revealSecondStepOfPrivateCloud();
    }
    this.setState({
      activeProvider: provider,
    });
  },

  _updatePage: function (page) {
    if (0 < page && page <= this.state.totalPages) {
      getProviderCredential('_PRIVATE', page, 5);
      this.setState({
        pageNo: page,
      });
    }
  },

  render: function () {
    var providers = this.props.providers;
    var _SELF = this;
    var rows = [];
    _.map(providers, function (provider, i) {
      if (null != provider.logo) {
        rows.push(
          <div id={"pvtPro_"+i} className="col-md-2 private-cloud-provider clouds-icons-button" onClick={function () {_SELF.explorePrivateStep2(provider, "pvtPro_"+i)}}>
            <img src={provider.logo.public_path} className="logo-max-size m-t-15"></img>
            <p className="aws-text">{provider.name}</p>
          </div>
        );
      } else {
        rows.push(
          <div id={"pvtPro_"+i} className="col-md-2 private-cloud-provider clouds-icons-button" onClick={function () {_SELF.explorePrivateStep2(provider, "pvtPro_"+i)}}>
            <div className="clouds-icons aws"></div>
            <p className="aws-text">{provider.name}</p>
          </div>
        );
      }
    });
    //---------------Pagination On Table---------
    var pages = this.state.totalPages;

    var navpages = [];
    for (var key = 0 ; key < pages ; key++) {
      var page = key + 1;
      var send = page.toString();
      navpages[navpages.length] = <li className={this.state.pageNo == page ? "active" : ""}><a onClick={this._updatePage.bind(this, page)}>{page}</a></li>;
    }

    var paginatorClass;
    if (pages <= 1) {
      paginatorClass = 'hidden';
    }
    //---------------Table Rows------------------
    var connectionTableRow = [];
    var allProvoders = this.props.allProvoders || [];

    _.map(this.state.connectedPrivateCloud, function (data, i) {
      var statusClass = "fa fa-check-circle green-text";
      var statusLable = "OK";

      if (data.status == "Failed") {
        statusClass = "fa fa-times-circle red-text";
        statusLable = "Fail";
      } else if (data.status == "Disabled") {
        statusClass = "fa fa-ban grey-text";
        statusLable = "Disabled";
      }
      var provider = _.find(allProvoders, function(o) { return o.provider == data.provider });

      if(typeof provider !== 'undefined')
      connectionTableRow.push(
        <tr>
         <td>
           <div className="status-container">
             <i className={statusClass} aria-hidden="true"></i>
             <span className="label-inline">{statusLable}</span>
           </div>
         </td>
         <td>
           <div className="connection-name-container">
             {null !== provider.logo ? <img src={provider.logo.public_path} className="logo-max-size m-l-10 m-t-15"></img> : <span className="clouds-icons aws m-l-10"></span>}
             <span className="label-inline">{provider.name}</span>
           </div>
         </td>
         <td className="">
           <div>{moment(data.checked_at).format("MM/DD/YYYY hh:mm:ss")}</div>
         </td>
         <td className="icons">
           <div className="col-xs-4"><span className="action-button nubity-blue">Edit</span></div>
           <div className="col-xs-4"><span className="action-button add-cloud-btn-disabled">Disabled</span></div>
           <div className="col-xs-4"><span className="action-button add-cloud-btn-deleted" onClick={function () {deleteProviderCredential('_PRIVATE', _SELF.state.pageNo, limit=5, id=i)}}>Deleted</span></div>
         </td>
       </tr>
      );
    });

    var certificate = this.state.activeProvider && this.state.activeProvider.requirements.certificate;
    return (
      <div>
        <button className="transparent-button" onClick={this.revealFirstStepOfPrivateCloud} id="privateAddButton">
          <i id="buttonPrivateToClick" className="fa fa-plus-circle big-green-circle" aria-hidden="true"></i>
          <span id="privateTextToClick"> Add New Private Cloud Connection</span>
        </button>
        <button className="transparent-button hidden" onClick={this.revertPrivateSteps} id="privateCancelButton">
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
                        <input type="file" name="certificate" id="privateCertificate"/>
                    </div>
                  </span>
                  <span className="form-control image-preview-filename hidden"></span>
              </div>:""}
              <button type="button" className="btn btn-success pull-right public-cloud-button" onClick={function () {_SELF.submitData()}}>Save</button>
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
            <span>Connected Private Cloud</span>
          </div>
          <div className="add-cloud-table-container">
            <table className="add-cloud-table">
              <thead>
              <tr>
                <th className="">Status</th>
                <th className="">Connection name</th>
                <th className="">Last Sync</th>
                <th className="column-action">Actions</th>
              </tr>
              </thead>
              <tbody>
                {connectionTableRow}
              </tbody>
            </table>
          </div>
          <nav aria-label="Page navigation" className={paginatorClass}>
            <ul className="pagination">
              <li>
                <a aria-label="Previous" onClick={this._updatePage.bind(this, this.state.pageNo-1)}>
                  <span aria-hidden="true">&laquo;</span>
                </a>
              </li>
                {navpages}
              <li>
                <a aria-label="Next" onClick={this._updatePage.bind(this, this.state.pageNo+1)}>
                  <span aria-hidden="true">&raquo;</span>
                </a>
              </li>
            </ul>
          </nav>
      </div>
    );
  },
});
