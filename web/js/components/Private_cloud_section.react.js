var React                      = require('react');
var redirect                   = require('../actions/RouteActions').redirect;
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
var Carousel                   = require('react-bootstrap').Carousel;
var CarouselItem               = require('react-bootstrap').CarouselItem;

class PrivateCloudSection extends React.Component {
  constructor(props) {
    super(props);
    var connectedPrivateCloud = OnBoardingStore.getProviderCredentialPrivate();
    var credentialDetails = OnBoardingStore.getCredentialDetails();
    this.state = {
      connectedPrivateCloud: connectedPrivateCloud,
      activeProvider:        false,
      totalItems:            connectedPrivateCloud.totalItems,
      totalPages:            0,
      pageNo:                1,
      credentialDetails:     credentialDetails,
      credetialInfo:         false,
      open:                  false,
    };
    this._onChange = this._onChange.bind(this);
    this._scroll = this._scroll.bind(this);
    this._revealFirstStepOfPrivateCloud = this._revealFirstStepOfPrivateCloud.bind(this);
    this._revealSecondStepOfPrivateCloud = this._revealSecondStepOfPrivateCloud.bind(this);
    this._revertPrivateSteps = this._revertPrivateSteps.bind(this);
    this._submitData = this._submitData.bind(this);
    this._getCloudInputField = this._getCloudInputField.bind(this);
    this._onFileChange = this._onFileChange.bind(this);
    this._updatePage = this._updatePage.bind(this);
    this._editProviderCredential = this._editProviderCredential.bind(this);
    this._deleteCredential = this._deleteCredential.bind(this);
    this.clickProvider = this.clickProvider.bind(this);

    this.limit = 5;
    this.sectionKey = '_PRIVATE';
    this.editModalId = 'editModalPrivate';
  }

  componentDidMount() {
    OnBoardingStore.addChangeListener(this._onChange);
    getProviderCredential(this.sectionKey, this.state.pageNo, this.limit);
  }

  componentWillUnmount() {
    OnBoardingStore.removeChangeListener(this._onChange);
  }

  componentWillReceiveProps(props) {
    var width = props.providers.length * 150 || 600;
    $('#privateCloudProvidersList').css({width: width + 'px'});

    if (props.page_no !== this.state.pageNo) {
      this.setState({
        pageNo: props.page_no,
      });
      getProviderCredential(this.sectionKey, props.page_no, this.limit);
    }
  }

  _onChange() {
    var privateCloud = OnBoardingStore.getProviderCredentialPrivate();
    var credentialDetails = OnBoardingStore.getCredentialDetails();
    this.setState({
      connectedPrivateCloud: privateCloud.member,
      totalItems:            privateCloud.totalItems,
      totalPages:            Math.ceil(parseInt(privateCloud.totalItems) / 5),
      credentialDetails:     credentialDetails,
    });
  }

  _scroll(arrow) {
    var width = this.props.providers.length * 150;
    var view = $('#privateCloudProvidersList');
    var move = '100px';
    var sliderLimit = -(width - 700);
    var currentPosition = parseInt(view.css('left'));
    if ('leftArrow' === arrow) {
      if (0 > currentPosition) {
        view.stop(false, true).animate({left: '+=' + move}, {duration: 400});
      }
    } else if (currentPosition >= sliderLimit) {
      view.stop(false, true).animate({left: '-=' + move}, {duration: 400});
    }
  }

  _revealFirstStepOfPrivateCloud() {
    $('#private1StepTitle').removeClass('hidden');
    $('#private1StepContent').removeClass('hidden');
    $('#privateCancelButton').removeClass('hidden');
    $('#privateAddButton').addClass('hidden');
  }

  _revealSecondStepOfPrivateCloud() {
    $('#private2StepTitle').removeClass('hidden');
    $('#private2StepContent').removeClass('hidden');
  }

  _revertPrivateSteps() {
    $('#private1StepTitle').addClass('hidden');
    $('#private1StepContent').addClass('hidden');
    $('#private2StepTitle').addClass('hidden');
    $('#private2StepContent').addClass('hidden');
    $('#privateCancelButton').addClass('hidden');
    $('#privateAddButton').removeClass('hidden');
    this.setState({
      activeProvider: false,
    });
  }

  _submitData() {
    var providerId = this.state.activeProvider.provider;
    var integrationName = $('input[name="privateIntegrationName"]').prop('value') || null;
    var apiKey = $('input[name="privateApiKey"]').prop('value') || null;
    var endpoint = $('input[name="privateEndpoint"]').prop('value') || null;
    var apiSecret = $('input[name="privateApiSecret"]').prop('value') || null;
    var certificate = $('#privateCertificate').prop('files');
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
      $('input[name="privateIntegrationName"]').val('');
      $('input[name="privateApiKey"]').val('');
      $('input[name="privateEndpoint"]').val('');
      $('input[name="privateApiSecret"]').val('');
      $('#privateCertificate').val('');
      $('.image-preview-input-title').text('Upload Certificate');
      $('.image-preview-filename').text('').addClass('hidden');
    });
  }

  _getCloudInputField() {
    var _SELF = this;
    var credetials = this.state.activeProvider && this.state.activeProvider.requirements;
    var input = [];
    input.push(
      <div key={'integration-name'} className="form-group">
        <div className="input-group">
          <span className="input-group-addon"><i className="fa fa-cloud fa" aria-hidden="true"></i></span>
          <input type="text" className="form-control" name="privateIntegrationName" placeholder="Integration Name" />
        </div>
      </div>
    );
    if (-1 < _.indexOf(credetials, 'api-key')) {
      input.push(
        <div key={'api-key'} className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-key fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="privateApiKey" placeholder="API Key" />
          </div>
        </div>
      );
    }
    if (-1 < _.indexOf(credetials, 'endpoint')) {
      input.push(
        <div key={'endpoint'} className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-user fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="privateEndpoint" placeholder="Access Key ID" />
          </div>
        </div>
      );
    }
    if (-1 < _.indexOf(credetials, 'api-secret')) {
      input.push(
        <div key={'api-secret'} className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-lock fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="privateApiSecret" placeholder="Secret Access Key" />
          </div>
        </div>
      );
    }
    if (-1 < _.indexOf(credetials, 'certificate')) {
      input.push(
        <div key={'certificate'} className="input-group image-preview">
          <span className="input-group-btn">
            <div className="btn btn-default image-preview-input">
              <span className="glyphicon glyphicon-folder-open"></span>
              <span className="image-preview-input-title">Upload Certificate</span>
              <input type="file" name="certificate" id="privateCertificate" onChange={function () { _SELF._onFileChange(); }} />
            </div>
          </span>
          <span className="form-control image-preview-filename hidden"></span>
        </div>
      );
    }
    return input;
  }

  _onFileChange() {
    var file = $('#privateCertificate').prop('files')[0];
    $('.image-preview-input-title').text('Change Certificate');
    $('.image-preview-filename').text(file.name).removeClass('hidden');
  }

  _updatePage(page) {
    if (0 < page && page <= this.state.totalPages) {
      this.props.callUpdateURL(page);
    }
  }

  _editProviderCredential(credetialInfo) {
    this.setState({
      open:          true,
      credetialInfo: credetialInfo,
    });
    getCredentialDetails(credetialInfo.provider_credential);
  }

  _deleteCredential(id) {
    var _SELF = this;
    deleteProviderCredential(id).then(function () {
      getProviderCredential(_SELF.sectionKey, _SELF.state.pageNo, _SELF.limit);
    });
  }

  clickProvider(provider, id) {
    this.setState({
      active: provider.provider,
    });

    $('.private-cloud-provider').addClass('non-selected-provider-step1').removeClass('selected-provider-step1');
    var credetials = this.state.activeProvider;
    if (!credetials) {
      this._revealSecondStepOfPrivateCloud();
    }
    this.setState({
      activeProvider: provider,
    });
  }

  render() {
    var providers = this.props.providers;
    var _SELF = this;
    var rows = [];
    if (providers !== undefined) {
      for (var key = 0; key < providers.length; key = key + 4) {
        rows.push(
          <CarouselItem key={key}>
            <div className="col-sm-8 col-sm-offset-2">
              <div className={providers[key] !== undefined ? 'col-sm-3' : 'hidden'}>
                <a className={providers[key] !== undefined && this.state.active == providers[key].provider ? 'carousel-active thumbnail' : 'thumbnail'} onClick={this.clickProvider.bind(this, providers[key], key)}>
                  <img src={providers[key] !== undefined ? providers[key].logo.public_path : ''} alt="Image" className="img-responsive" />
                  <div className="centered"><span>{providers[key] !== undefined ? providers[key].name : ''}</span></div>
                </a>
              </div>
              <div className={providers[key + 1] !== undefined ? 'col-sm-3' : 'hidden'}>
                <a className={providers[key + 1] !== undefined && this.state.active == providers[key + 1].provider ? 'carousel-active thumbnail' : 'thumbnail'} onClick={this.clickProvider.bind(this, providers[key + 1], key + 1)}>
                  <img src={providers[key + 1] !== undefined ? providers[key + 1].logo.public_path : ''} className="img-responsive" />
                  <div className="centered"><span>{providers[key + 1] !== undefined ? providers[key + 1].name : ''}</span></div>
                </a>
              </div>
              <div className={providers[key + 2] !== undefined ? 'col-sm-3' : 'hidden'}>
                <a className={providers[key + 2] !== undefined && this.state.active == providers[key + 2].provider ? 'carousel-active thumbnail' : 'thumbnail'} onClick={this.clickProvider.bind(this, providers[key + 2], key + 2)}>
                  <img src={providers[key + 2] !== undefined ? providers[key + 2].logo.public_path : ''} alt="Image" className="img-responsive" />
                  <div className="centered"><span>{providers[key + 2] !== undefined ? providers[key + 2].name : ''}</span></div>
                </a>
              </div>
              <div className={providers[key + 3] !== undefined ? 'col-sm-3' : 'hidden'}>
                <a className={providers[key + 3] !== undefined && this.state.active == providers[key + 3].provider ? 'carousel-active thumbnail' : 'thumbnail'} onClick={this.clickProvider.bind(this, providers[key + 3], key + 3)}>
                  <img src={providers[key + 3] !== undefined ? providers[key + 3].logo.public_path : ''} alt="Image" className="img-responsive" />
                  <div className="centered"><span>{providers[key + 3] !== undefined ? providers[key + 3].name : ''}</span></div>
                </a>
              </div>
            </div>
          </CarouselItem>
        );
      }
    }
    var providersView = '';
    // if there are more than four providers, we need carousel to display them, else they fit in the screen without carousel
    if (providers && 4 < providers.length) {
      providersView = (
        <div>
          <Carousel interval={false} data-interval="false" activeIndex={this.state.index} direction={this.state.direction} onSelect={this.handleSelect}>
            {rows}
          </Carousel>
        </div>
      );
    } else {
      var providersItems = [];
      if (providers !== undefined) {
        for (var count = 0; count < providers.length; count++) {
          providersItems.push(
            <div key={count} className={providers[count] !== undefined ? 'carousel-item' : 'hidden'}>
              <a className={providers[count] !== undefined && this.state.active == providers[count].provider ? 'carousel-active thumbnail' : 'thumbnail'} onClick={this.clickProvider.bind(this, providers[count], count)}>
                <img src={providers[count] !== undefined ? providers[count].logo.public_path : ''} alt="Image" className="img-responsive" />
                <div className="centered"><span>{providers[count] !== undefined ? providers[count].name : ''}</span></div>
              </a>
            </div>
          );
        }
      }
      providersView = (<div className="centered">{providersItems}</div>);
    }

    var pages = this.state.totalPages;

    var navpages = [];
    for (var i = 0; i < pages; i++) {
      var page = i + 1;
      navpages[navpages.length] = <li key={i} className={this.state.pageNo === page ? 'active' : ''}><a onClick={this._updatePage.bind(this, page)}>{page}</a></li>;
    }

    var paginatorClass;
    if (1 >= pages) {
      paginatorClass = 'hidden';
    }

    var connectionTableRow = [];
    var allProviders = this.props.allProviders || [];

    _.map(this.state.connectedPrivateCloud, function (data, i) {
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
          <tr key={i}>
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
              <div className="action-btn-container"><span className="action-button nubity-blue" data-toggle="modal" data-target={'#' + _SELF.editModalId} onClick={function () { _SELF._editProviderCredential(data); }}>Edit</span></div>
              <div className="action-btn-container hidden"><span className="action-button add-cloud-btn-disabled">Disable</span></div>
              <div className="action-btn-container"><span className="action-button add-cloud-btn-deleted" onClick={function () { _SELF._deleteCredential(data.provider_credential); }}>Delete</span></div>
            </td>
          </tr>
        );
      }
    });

    return (
      <div>
        <button className="transparent-button" onClick={this._revealFirstStepOfPrivateCloud} id="privateAddButton">
          <i id="buttonPrivateToClick" className="fa fa-plus-circle big-green-circle" aria-hidden="true"></i>
          <span id="privateTextToClick">Add New Private Cloud Connection</span>
        </button>
        <button className="transparent-button hidden" onClick={this._revertPrivateSteps} id="privateCancelButton">
          <i className="fa fa-minus-circle big-red-circle" aria-hidden="true"></i>
          <span>Cancel Private Cloud Connection</span>
        </button>
        <div className="hidden" id="private1StepTitle">
          <div className="round-number number-1">1</div>
          <span>Select your Private Cloud</span>
        </div>
        <div className="row hidden" id="private1StepContent">
          {providersView}
        </div>
        <div className="hidden" id="private2StepTitle">
          <div className="round-number number-2">2</div>
          <span>Complete your cloud information</span>
        </div>
        <div className="row hidden" id="private2StepContent">
          <form className="public-cloud-form col-lg-offset-1 col-lg-5">
            <div style={{paddingTop: '10px'}}>
              {this._getCloudInputField()}
              <button type="button" className="btn btn-success pull-right public-cloud-button" onClick={function () { _SELF._submitData(); }}>Save</button>
              <button type="button" className="btn btn-default pull-right public-cloud-button grey-background">Cancel</button>
            </div>
          </form>
          <div className="col-lg-5 centered hidden">
            <p className="aws-text">How to integrate AWS with Nubity?</p>
            <a>
              <i className="fa fa-play-circle-o play-tutorial" aria-hidden="true"></i>
            </a>
            <p className="aws-text">Watch the video tutorial or</p>
            <p className="aws-text">start live chat with Support</p>
          </div>
        </div>
        <hr />
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
            updateCredentials={function (credetialId, newCredential) { return updateNewCredentials(credetialId, newCredential); }}
            refreshTable={function () {
              _SELF.setState({open: false});
              getProviderCredential(_SELF.sectionKey, _SELF.state.pageNo, _SELF.limit);
            }}
            {...this.props} />
        </div>
      </div>
    );
  }
}

module.exports = PrivateCloudSection;
