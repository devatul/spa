var React                      = require('react');
var Router                     = require('../router');
var OnBoardingStore            = require('../stores/OnBoardingStore');
var submitCloudData            = require('../actions/RequestActions').submitCloudData;
var updateNewCredentials       = require('../actions/RequestActions').updateNewCredentials;
var getProviderCredential      = require('../actions/RequestActions').getProviderCredential;
var getCredentialDetails       = require('../actions/RequestActions').getCredentialDetails;
var deleteProviderCredential   = require('../actions/RequestActions').deleteProviderCredential;
var EditProviderCredential     = require('./Edit_provider_credential.react');
var _                          = require('lodash');
var moment                     = require('moment');
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;

module.exports = React.createClass({
  getInitialState: function () {
    var connectedOnPremiseCloud = OnBoardingStore.getProviderCredentialOnpremise();
    var credentialDetails = OnBoardingStore.getCredentialDetails();
    return {
      connectedOnPremiseCloud: connectedOnPremiseCloud,
      activeProvider: false,
      totalItems: connectedOnPremiseCloud.totalItems,
      totalPages: 0,
      pageNo: 1,
      credentialDetails: credentialDetails,
      credetialInfo: false,
      open: false,
    };
  },

  limit: 5,
  sectionKey: '_ONPREMISE',
  editModalId: 'editModalPremise',

  componentDidMount: function () {
    OnBoardingStore.addChangeListener(this._onChange);
    getProviderCredential(this.sectionKey, this.state.pageNo, this.limit);
  },

  componentWillUnmount: function () {
    OnBoardingStore.removeChangeListener(this._onChange);
  },

  componentWillReceiveProps: function (props) {
    var width = props.providers.length * 150 || 600;
    $('#premiseCloudProvidersList').css({width: width + 'px'});

    if (props.page_no !== this.state.pageNo) {
      this.setState({
        pageNo: props.page_no,
      });
      getProviderCredential(this.sectionKey, props.page_no, this.limit);
    }
  },

  _onChange: function () {
    if (this.isMounted()) {
      var premiseCloud = OnBoardingStore.getProviderCredentialOnpremise();
      var credentialDetails = OnBoardingStore.getCredentialDetails();
      this.setState({
        connectedOnPremiseCloud: premiseCloud.member,
        totalItems: premiseCloud.totalItems,
        totalPages: Math.ceil(parseInt(premiseCloud.totalItems) / 5),
        credentialDetails: credentialDetails,
      });
    }
  },

  _scroll: function (arrow) {
    var width = this.props.providers.length * 150;
    var view = $('#premiseCloudProvidersList');
    var move = '100px';
    var sliderLimit = -(width - 700);
    var currentPosition = parseInt(view.css('left'));
    if ('leftArrow' === arrow) {
      if (0 > currentPosition) {
        view.stop (false,true).animate ({left:'+=' + move}, { duration: 400});
      }
    } else {
      if (currentPosition >= sliderLimit) {
        view.stop (false,true).animate ({left:'-=' + move}, { duration: 400});
      }
    }
  },

  _revealFirstStepOfPrivateCloud: function () {
    $('#onPremise1StepTitle').removeClass('hidden');
    $('#onPremise1StepContent').removeClass('hidden');
    $('#onPremiseCancelButton').removeClass('hidden');
    $('#onPremiseAddButton').addClass('hidden');
  },

  _revealSecondStepOfPrivateCloud: function () {
    $('#onPremise2StepTitle').removeClass('hidden');
    $('#onPremise2StepContent').removeClass('hidden');
  },

  _revertPrivateSteps: function () {
    $('#onPremise1StepTitle').addClass('hidden');
    $('#onPremise1StepContent').addClass('hidden');
    $('#onPremise2StepTitle').addClass('hidden');
    $('#onPremise2StepContent').addClass('hidden');
    $('#onPremiseCancelButton').addClass('hidden');
    $('#onPremiseAddButton').removeClass('hidden');
    this.setState({
      activeProvider: false,
    });
  },

  _submitData: function () {
    var providerId = this.state.activeProvider.provider;
    var integrationName = $('input[name="onPremiseIntegrationName"]').prop('value') || null;
    var apiKey = $('input[name="onPremiseApiKey"]').prop('value') || null;
    var endpoint = $('input[name="onPremiseEndpoint"]').prop('value') || null;
    var apiSecret = $('input[name="onPremiseApiSecret"]').prop('value') || null;
    var certificate = $('#onPremiseCertificate').prop('files');
    certificate = certificate && certificate[0] || null;

    var cloudData = {};

    if (null !== integrationName) {
      cloudData.name = integrationName;
    }
    if (null !== apiKey) {
      cloudData.api_key = apiKey;
    }
    if (null !== endpoint) {
      cloudData.endpoint = endpoint;
    }
    if (null !== apiSecret) {
      cloudData.api_secret = apiSecret;
    }
    if (null !== certificate) {
      cloudData.certificate = certificate;
    }
    if (null !== providerId) {
      cloudData.provider_id = providerId;
    }
    var _SELF = this;
    submitCloudData(cloudData).then(function () {
      getProviderCredential(_SELF.sectionKey, _SELF.state.pageNo, _SELF.limit);
      $('input[name="onPremiseIntegrationName"]').val('');
      $('input[name="onPremiseApiKey"]').val('');
      $('input[name="onPremiseEndpoint"]').val('');
      $('input[name="onPremiseApiSecret"]').val('');
      $('#onPremiseCertificate').val('');
      $('.image-preview-input-title').text('Upload Certificate');
      $('.image-preview-filename').text('').addClass('hidden');
    });
  },

  _getCloudInputField: function () {
    var _SELF = this;
    var credetials = this.state.activeProvider && this.state.activeProvider.requirements;
    var input = [];
    input.push(
      <div className="form-group">
        <div className="input-group">
          <span className="input-group-addon"><i className="fa fa-cloud fa" aria-hidden="true"></i></span>
          <input type="text" className="form-control" name="onPremiseIntegrationName" placeholder="Integration Name"/>
        </div>
      </div>
    );
    if (-1 < _.indexOf(credetials, 'api-key')) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-key fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="onPremiseApiKey" placeholder="API Key"/>
          </div>
        </div>
      );
    }
    if (-1 < _.indexOf(credetials, 'endpoint')) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-user fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="onPremiseEndpoint" placeholder="Access Key ID"/>
          </div>
        </div>
      );
    }
    if (-1 < _.indexOf(credetials, 'api-secret')) {
      input.push(
        <div className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-lock fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="onPremiseApiSecret" placeholder="Secret Access Key"/>
          </div>
        </div>
      );
    }
    if (-1 < _.indexOf(credetials, 'certificate')) {
      input.push(
        <div className="input-group image-preview">
          <span className="input-group-btn">
            <div className="btn btn-default image-preview-input">
                <span className="glyphicon glyphicon-folder-open"></span>
                <span className="image-preview-input-title">Upload Certificate</span>
                <input type="file" name="certificate" id="onPremiseCertificate" onChange={function () {_SELF._onFileChange();}} />
            </div>
          </span>
          <span className="form-control image-preview-filename hidden"></span>
        </div>
      );
    }
    return input;
  },

  _onFileChange: function () {
    var file = $('#onPremiseCertificate').prop('files')[0];
    $('.image-preview-input-title').text('Change Certificate');
    $('.image-preview-filename').text(file.name).removeClass('hidden');
  },

  _exploreOnPremiseStep2: function (provider, id) {
    $('.onPremise-cloud-provider').addClass('non-selected-provider-step1').removeClass('selected-provider-step1');
    $('#' + id + '.onPremise-cloud-provider').addClass('selected-provider-step1').removeClass('non-selected-provider-step1');
    var credetials = this.state.activeProvider;
    if (!credetials) {
      this._revealSecondStepOfPrivateCloud();
    }
    this.setState({
      activeProvider: provider,
    });
  },

  _updatePage: function (page) {
    if (0 < page && page <= this.state.totalPages) {
      this.props.callUpdateURL(page);
    }
  },

  _editProviderCredential: function (credetialInfo) {
    this.setState({
      open: true,
      credetialInfo: credetialInfo,
    });
    getCredentialDetails(credetialInfo.provider_credential);
  },

  _deleteCredential: function (id) {
    var _SELF = this;
    deleteProviderCredential(id).then(function () {
      getProviderCredential(_SELF.sectionKey, _SELF.state.pageNo, _SELF.limit);
    });
  },

  render: function () {
    var providers = this.props.providers;
    var _SELF = this;
    var rows = [];
    _.map(providers, function (provider, i) {
      if (null != provider.logo) {
        rows.push(
          <div id={'prePro_' + i} className="col-md-2 onPremise-cloud-provider clouds-icons-button" onClick={function () {_SELF._exploreOnPremiseStep2(provider, 'prePro_' + i);}}>
            <img src={provider.logo.public_path} className="logo-max-size m-t-15"/>
            <p className="aws-text">{provider.name}</p>
          </div>
        );
      } else {
        rows.push(
          <div id={'prePro_' + i} className="col-md-2 onPremise-cloud-provider clouds-icons-button" onClick={function () {_SELF._exploreOnPremiseStep2(provider, 'prePro_' + i);}}>
            <div className="clouds-icons aws"></div>
            <p className="aws-text">{provider.name}</p>
          </div>
        );
      }
    });

    var pages = this.state.totalPages;

    var navpages = [];
    var key = 0;
    for (key; key < pages ; key++) {
      var page = key + 1;
      navpages[navpages.length] = <li className={this.state.pageNo === page ? 'active' : ''}><a onClick={this._updatePage.bind(this, page)}>{page}</a></li>;
    }

    var paginatorClass;
    if (1 >= pages) {
      paginatorClass = 'hidden';
    }

    var connectionTableRow = [];
    var allProviders = this.props.allProviders || [];

    _.map(this.state.connectedOnPremiseCloud, function (data, i) {
      var statusClass = 'fa fa-check-circle green-text';
      var statusLabel = 'OK';

      if ('Failed' === data.status) {
        statusClass = 'fa fa-times-circle red-text';
        statusLabel = 'Fail';
      } else if ('Disabled' === data.status) {
        statusClass = 'fa fa-ban grey-text';
        statusLabel = 'Disabled';
      }
      var provider = _.find(allProviders, function (o) { return o.provider === data.provider; });
      var tooltip = (<Tooltip id="tooltip">{statusLabel}</Tooltip>);
      if ('undefined' !== typeof provider) {
        connectionTableRow.push(
          <tr>
            <td>
              <div className="status-container">
                <OverlayTrigger placement="top" overlay={tooltip}>
                  <i className={statusClass + ' onboard-status'} aria-hidden="true"></i>
                </OverlayTrigger>
              </div>
            </td>
            <td>
              <div className="connection-name-container">
                {null !== provider.logo ? <img src={provider.logo.public_path} className="logo-max-size m-l-10 m-t-15"></img> : <span className="clouds-icons aws m-l-10"></span>}
                <span className="label-inline">{provider.name}</span>
              </div>
            </td>
            <td className="">
              <div>{moment(data.checked_at).format('MM/DD/YYYY hh:mm:ss')}</div>
            </td>
            <td className="icons">
              <div className=""><span className="action-button nubity-blue" data-toggle="modal" data-target={'#' + _SELF.editModalId} onClick={function () {_SELF._editProviderCredential(data);}}>Edit</span></div>
              <div className="hidden"><span className="action-button add-cloud-btn-disabled">Disable</span></div>
              <div className="hidden"><span className="action-button add-cloud-btn-deleted" onClick={function () {_SELF._deleteCredential(data.provider_credential);}}>Delete</span></div>
            </td>
          </tr>
        );
      }
    });

    return (
      <div>
        <button className="transparent-button hidden" onClick={this._revealFirstStepOfPrivateCloud} id="onPremiseAddButton">
          <i className="fa fa-plus-circle big-green-circle" aria-hidden="true"></i>
          <span>Add New On Premise Cloud Connection</span>
        </button>
        <button className="transparent-button hidden" onClick={this._revertPrivateSteps} id="onPremiseCancelButton">
          <i  className="fa fa-minus-circle big-red-circle" aria-hidden="true"></i>
          <span>Cancel On Premise Cloud Connection</span>
        </button>
        <div className="hidden" id="onPremise1StepTitle">
          <div className="round-number number-1">1</div>
          <span>Select your On Premise Cloud</span>
        </div>
        <div className="row hidden" id="onPremise1StepContent">
          <div className="col-lg-8 col-lg-offset-2">
            <div className="col-lg-1 scroll-step1" onClick={function () {_SELF._scroll('leftArrow');}}>
              <i className="fa fa-chevron-left" aria-hidden="true"></i>
            </div>
              <div id="viewContainer" className="col-lg-11 public-cloud-selector-div">
                <div id="premiseCloudProvidersList" className="list-providers">
                  {rows}
                </div>
              </div>
            <div className="col-lg-1 scroll-step1" onClick={function () {_SELF._scroll('rightArrow');}}>
              <i className="fa fa-chevron-right" aria-hidden="true"></i>
            </div>
          </div>
        </div>
        <div className="hidden" id="onPremise2StepTitle">
          <div className="round-number number-2">2</div>
          <span>Complete your cloud information</span>
        </div>
        <div className="row hidden" id="onPremise2StepContent">
          <form className="public-cloud-form col-lg-offset-1 col-lg-5">
            <div style={{paddingTop: '10px'}}>
              {this._getCloudInputField()}
              <button type="button" className="btn btn-success pull-right public-cloud-button" onClick={function () {_SELF._submitData();}} >Save</button>
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
          <span>Connected clouds</span>
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
              <a aria-label="Previous" onClick={this._updatePage.bind(this, this.state.pageNo - 1)}>
                <span aria-hidden="true">&laquo;</span>
              </a>
            </li>
            {navpages}
            <li>
              <a aria-label="Next" onClick={this._updatePage.bind(this, this.state.pageNo + 1)}>
                <span aria-hidden="true">&raquo;</span>
              </a>
            </li>
          </ul>
        </nav>
        <div>
          <EditProviderCredential
            modalId={this.editModalId}
            open={this.state.open}
            credentialDetails={this.state.credentialDetails}
            credetialInfo={this.state.credetialInfo}
            updateCredentials={function (credetialId, newCredential) {return updateNewCredentials(credetialId, newCredential);}}
            refreshTable={function () {
              _SELF.setState({open: false});
              getProviderCredential(_SELF.sectionKey, _SELF.state.pageNo, _SELF.limit);
            }}
            {...this.props}/>
        </div>
      </div>
    );
  },
});
