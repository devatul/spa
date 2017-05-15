var React                      = require('react');
var OnBoardingStore            = require('../stores/OnBoardingStore');
var submitCloudData            = require('../actions/RequestActions').submitCloudData;
var updateNewCredentials       = require('../actions/RequestActions').updateNewCredentials;
var getProviderCredential      = require('../actions/RequestActions').getProviderCredential;
var deleteProviderCredential   = require('../actions/RequestActions').deleteProviderCredential;
var getCredentialDetails       = require('../actions/RequestActions').getCredentialDetails;
var EditProviderCredential     = require('./Edit_provider_credential.react');
var _                          = require('lodash');
var moment                     = require('moment');
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;
var Carousel                   = require('react-bootstrap').Carousel;
var CarouselItem               = require('react-bootstrap').CarouselItem;
var Modal                      = require('react-bootstrap').Modal;

class PublicCloudSection extends React.Component {
  constructor(props) {
    super(props);
    var connectedPublicCloud = OnBoardingStore.getProviderCredentialPublic();
    var credentialDetails = OnBoardingStore.getCredentialDetails();
    this.state = {
      connectedPublicCloud: connectedPublicCloud,
      activeProvider:       false,
      totalItems:           connectedPublicCloud.totalItems,
      totalPages:           0,
      pageNo:               1,
      credentialDetails:    credentialDetails,
      credetialInfo:        false,
      open:                 false,
      direction:            null,
      active:               '',
      showiam:              false,
    };
    this.closeiam = this.closeiam.bind(this);
    this.execute = this.execute.bind(this);
    this._onChange = this._onChange.bind(this);
    this._scroll = this._scroll.bind(this);
    this._revealFirstStep = this._revealFirstStep.bind(this);
    this._revealSecondStep = this._revealSecondStep.bind(this);
    this._revertPublicSteps = this._revertPublicSteps.bind(this);
    this._submitData = this._submitData.bind(this);
    this._onFileChange = this._onFileChange.bind(this);
    this._explore2step = this._explore2step.bind(this);
    this._updatePage = this._updatePage.bind(this);
    this._editProviderCredential = this._editProviderCredential.bind(this);
    this._deleteCredential = this._deleteCredential.bind(this);
    this.clickProvider = this.clickProvider.bind(this);

    this.limit = 5;
    this.sectionKey = '_PUBLIC';
    this.editModalId = 'editModalPublic';
  }

  closeiam() {
    this.setState({
      showiam: false,
    });
  }

  execute() {
    this.setState({
      showiam: true,
    });
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
    $('#publicCloudProvidersList').css({width: width + 'px'});

    if (props.page_no !== this.state.pageNo) {
      this.setState({
        pageNo: props.page_no,
      });
      getProviderCredential(this.sectionKey, props.page_no, this.limit);
    }
  }

  _onChange() {
    var publicCloud = OnBoardingStore.getProviderCredentialPublic();
    var credentialDetails = OnBoardingStore.getCredentialDetails();
    this.setState({
      connectedPublicCloud: publicCloud.member,
      totalItems:           publicCloud.totalItems,
      totalPages:           Math.ceil(parseInt(publicCloud.totalItems) / 5),
      credentialDetails:    credentialDetails,
    });
  }

  _scroll(arrow) {
    var width = this.props.providers.length * 150;
    var view = $('#publicCloudProvidersList');
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

  _revealFirstStep() {
    $('#onBoarding1StepTitle').removeClass('hidden');
    $('#onBoarding1StepContent').removeClass('hidden');
    $('#cancelButton').removeClass('hidden');
    $('#addButton').addClass('hidden');
  }

  _revealSecondStep() {
    $('#onBoarding2StepTitle').removeClass('hidden');
    $('#onBoarding2StepContent').removeClass('hidden');
  }

  _revertPublicSteps() {
    $('#onBoarding1StepTitle').addClass('hidden');
    $('#onBoarding1StepContent').addClass('hidden');
    $('#onBoarding2StepTitle').addClass('hidden');
    $('#onBoarding2StepContent').addClass('hidden');
    $('#cancelButton').addClass('hidden');
    $('#addButton').removeClass('hidden');
    this.setState({
      activeProvider: false,
    });
  }

  _submitData() {
    var providerId = this.state.activeProvider.provider;
    var integrationName = $('input[name="publicIntegrationName"]').prop('value') || null;
    var apiKey = $('input[name="publicApiKey"]').prop('value') || null;
    var endpoint = $('input[name="publicEndpoint"]').prop('value') || null;
    var apiSecret = $('input[name="publicApiSecret"]').prop('value') || null;
    var certificate = $('#publicCertificate').prop('files');
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
      $('input[name="publicIntegrationName"]').val('');
      $('input[name="publicApiKey"]').val('');
      $('input[name="publicEndpoint"]').val('');
      $('input[name="publicApiSecret"]').val('');
      $('#publicCertificate').val('');
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
          <input type="text" className="form-control" name="publicIntegrationName" placeholder="Integration Name" />
        </div>
      </div>
    );
    if (-1 < _.indexOf(credetials, 'api-key')) {
      input.push(
        <div key={'api-key'} className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-key fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="publicApiKey" placeholder="API Key" />
          </div>
        </div>
      );
    }
    if (-1 < _.indexOf(credetials, 'endpoint')) {
      input.push(
        <div key={'endpoint'} className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-user fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="publicEndpoint" placeholder="Access Key ID" />
          </div>
        </div>
      );
    }
    if (-1 < _.indexOf(credetials, 'api-secret')) {
      input.push(
        <div key={'api-secret'} className="form-group">
          <div className="input-group">
            <span className="input-group-addon"><i className="fa fa-lock fa" aria-hidden="true"></i></span>
            <input type="text" className="form-control" name="publicApiSecret" placeholder="Secret Access Key" />
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
              <input type="file" name="certificate" id="publicCertificate" onChange={function () { _SELF._onFileChange(); }} />
            </div>
          </span>
          <span className="form-control image-preview-filename hidden"></span>
        </div>
      );
    }
    return input;
  }

  _onFileChange() {
    var file = $('#publicCertificate').prop('files')[0];
    $('.image-preview-input-title').text('Change Certificate');
    $('.image-preview-filename').text(file.name).removeClass('hidden');
  }

  _explore2step(provider, id) {
    $('.public-cloud-provider').addClass('non-selected-provider-step1').removeClass('selected-provider-step1');
    $('#' + id + '.public-cloud-provider').addClass('selected-provider-step1').removeClass('non-selected-provider-step1');
    var credetials = this.state.activeProvider;
    if (!credetials) {
      this._revealSecondStep();
    }
    this.setState({
      activeProvider: provider,
    });
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

    $('.public-cloud-provider').addClass('non-selected-provider-step1').removeClass('selected-provider-step1');
    var credetials = this.state.activeProvider;
    if (!credetials) {
      this._revealSecondStep();
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
          <Carousel interval={false} data-interval="false" activeIndex={this.state.index} onSelect={this.handleSelect}>
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

    _.map(this.state.connectedPublicCloud, function (data, i) {
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
          <tr key={i} className="content">
            <td>
              <div className="status-container">
                <OverlayTrigger placement="top" overlay={tooltip}>
                  <i className={statusClass + ' onboard-status'} aria-hidden="true"></i>
                </OverlayTrigger>
              </div>
            </td>
            <td className="left-aligned">
              <div className="connection-name-container">
                {null !== provider.logo ? <img src={provider.logo.public_path} className="logo-max-size m-l-10 m-t-15"></img> : <span className="clouds-icons aws m-l-10"></span>}
                <span className="label-inline">{data.name}</span>
              </div>
            </td>
            <td className="hidden-xs hidden-sm">
              <div>{moment(data.checked_at).format('MM/DD/YYYY hh:mm:ss')}</div>
            </td>
            <td className="hidden-xs hidden-sm">
              <div className="action-btn-container"><span className="action-button nubity-blue" data-toggle="modal" data-target={'#' + _SELF.editModalId} onClick={function () { _SELF._editProviderCredential(data); }}>Edit</span></div>
              <div className="action-btn-container"><span className="action-button add-cloud-btn-deleted" onClick={function () { _SELF._deleteCredential(data.provider_credential); }}>Delete</span></div>
            </td>
          </tr>
        );
      }
    });

    var videoSrc = '';
    var doc = '';
    var iam = '';

    for (var k in this.state.activeProvider.provider_hints) {
      if ('url' === this.state.activeProvider.provider_hints[k].type) {
        doc = this.state.activeProvider.provider_hints[k];
      }
      if ('video-url' === this.state.activeProvider.provider_hints[k].type) {
        videoSrc = this.state.activeProvider.provider_hints[k];
      }
      if ('iam-definition' === this.state.activeProvider.provider_hints[k].type) {
        iam = this.state.activeProvider.provider_hints[k];
      }
    }

    var user     = localStorage.getItem('nubity-user');
    var jsonUser = JSON.parse(user);

    var name  = jsonUser.firstname + ' ' + jsonUser.lastname;
    var email = localStorage.getItem('nubity-user-email');

    window.Intercom('boot', {
      app_id:                   'xs6j43ab',
      name:                     name,
      email:                    email,
      created_at:               Math.ceil(Date.now() / 1000),
      'company_name':           this.state.companyName,
      custom_launcher_selector: '#public-intercom',
      hide_default_launcher:    true,

    });

    return (
      <div>
        <button className="transparent-button" onClick={this._revealFirstStep} id="addButton">
          <i className="fa fa-plus-circle big-green-circle" aria-hidden="true"></i>
          <span>Add New Public Cloud Connection</span>
        </button>
        <button className="transparent-button hidden" onClick={this._revertPublicSteps} id="cancelButton">
          <i className="fa fa-minus-circle big-red-circle" aria-hidden="true"></i>
          <span>Cancel Public Cloud Connection</span>
        </button>
        <div className="hidden" id="onBoarding1StepTitle">
          <div className="round-number number-1">1</div>
          <span>Select your Public Cloud</span>
        </div>
        <div className="row hidden" id="onBoarding1StepContent">
          {providersView}
        </div>
        <div className="hidden" id="onBoarding2StepTitle">
          <div className="round-number number-2">2</div>
          <span>Complete your cloud information</span>
        </div>
        <div className="row hidden" id="onBoarding2StepContent">
          <form className="public-cloud-form col-lg-offset-1 col-lg-5 col-md-12" method="post" encType="multipart/form-data">
            <div style={{paddingTop: '10px'}}>
              {this._getCloudInputField()}
              <button type="button" className="btn btn-success pull-right public-cloud-button" onClick={function () { _SELF._submitData(); }}>Save</button>
              <button type="button" className="btn btn-default pull-right public-cloud-button grey-background">Cancel</button>
            </div>
          </form>
          <div className="col-lg-5 col-md-12 centered">
            <p className="provider-title">How to integrate {this.state.activeProvider.name} with Nubity?</p>
            <p className={videoSrc ? 'provider-text' : 'hidden'}>Watch the video tutorial:</p>
            <a className={videoSrc ? 'provider-text pointer link-nubity-blue' : 'hidden'} href={videoSrc.content} target="_blank"><div className="icon nb-play nb-inline small"></div> {videoSrc.name}</a>
            <p className={doc ? 'provider-text' : 'hidden'}>Check this external resource:</p>
            <a className={doc ? 'provider-text pointer link-nubity-blue' : 'hidden'} href={doc.content} target="_blank"><div className="icon nb-attach nb-inline small"></div> {doc.name}</a>
            <p className={iam ? 'provider-text' : 'hidden'}>See this policy definition:</p>
            <p className={iam ? 'provider-text pointer link-nubity-blue' : 'hidden'} onClick={this.execute}><i className="fa fa-file-text-o" aria-hidden="true"></i> {iam.name}</p>
            <Modal show={this.state.showiam} onHide={this.closeiam} bsSize="small">
              <Modal.Body>
                <pre>{iam.content}</pre>
                <button className="action-button nubity-blue pointer" onClick={this.closeiam}>Close</button>
              </Modal.Body>
            </Modal>
            <p className="provider-text">If you have any doubt or trouble</p>
            <p className="provider-text pointer link-nubity-blue" id="public-intercom">start live chat with Support</p>
          </div>
        </div>
        <hr />
        <div>
          <i className="fa fa-cloud" aria-hidden="true"></i>
          <span>Connected clouds</span>
        </div>
        <div className="add-cloud-table-container">
          <div className="alert-table">
            <table>
              <thead>
                <tr>
                  <th className="column-icon">Status</th>
                  <th>Connection name</th>
                  <th className="hidden-xs hidden-sm">Last sync</th>
                  <th className="hidden-xs hidden-sm">Actions</th>
                </tr>
              </thead>
              <tbody>
                {connectionTableRow}
              </tbody>
            </table>
          </div>
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

module.exports = PublicCloudSection;
