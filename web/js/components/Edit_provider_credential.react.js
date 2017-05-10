var React                      = require('react');
var _                          = require('lodash');

class EditProviderCredential extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      credetialInfo:  '',
      name:           '',
      apiKey:         '',
      endpoint:       '',
      apiSecret:      '',
      certificate:    '',
      message:        '',
      messageClass:   'hidden',
      fileName:       '',
      fileLoadStatus: '',
    };
    this._resetDialog = this._resetDialog.bind(this);
    this._updateCredentials = this._updateCredentials.bind(this);
    this._showError = this._showError.bind(this);
    this._listErrors = this._listErrors.bind(this);
    this._closeAlert = this._closeAlert.bind(this);
    this._onFileChange = this._onFileChange.bind(this);
  }

  componentWillReceiveProps(props) {
    var credentialDetails = props.credentialDetails;
    var credetialInfo = props.credetialInfo;
    if (props.open
      && !_.isEmpty(credentialDetails)
      && credetialInfo
      && credentialDetails.provider_credential === credetialInfo.provider_credential) {
      this.setState({
        credetialInfo: props.credetialInfo,
        name:          credentialDetails.name,
        apiKey:        credentialDetails.api_key,
        endpoint:      credentialDetails.endpoint,
        apiSecret:     credentialDetails.api_secret,
        certificate:   credentialDetails.certificate,
      });
    }
  }

  _resetDialog() {
    $('#' + this.props.modalId).modal('toggle');
    this.setState({
      credetialInfo: '',
      name:          '',
      apiKey:        '',
      endpoint:      '',
      apiSecret:     '',
      certificate:   '',
    });
  }

  _updateCredentials() {
    var _SELF = this;
    var credetialId = this.state.credetialInfo.provider_credential || null;
    var providerId = this.state.credetialInfo.provider || null;
    var integrationName = this.state.name || null;
    var apiKey = this.state.apiKey || null;
    var endpoint = this.state.endpoint || null;
    var apiSecret = this.state.apiSecret || null;
    var company = this.state.credetialInfo.company || null;
    var certificate = this.state.certificate || null;

    var newCredential = {};

    if (null !== integrationName) {
      newCredential.name = integrationName;
    }
    if (null !== apiKey) {
      newCredential.api_key = apiKey;
    }
    if (null !== endpoint) {
      newCredential.endpoint = endpoint;
    }
    if (null !== apiSecret) {
      newCredential.api_secret = apiSecret;
    }
    if (null !== certificate) {
      newCredential.certificate = certificate;
    }
    if (null !== company) {
      newCredential.company_id = company;
    }
    if (null !== providerId) {
      newCredential.provider_id = providerId;
    }

    this.props.updateCredentials(credetialId, newCredential).then(function (msg) {
      _SELF.props.refreshTable();
      _SELF._resetDialog();
    }.bind(this)).catch(function (message) {
      var err = this._showError(message);
      this.setState({
        message:      err,
        messageClass: 'alert alert-danger',
      });
    }.bind(this));
  }

  _showError(message) {
    var errorList = '';
    if ('string' !== typeof message[0]) {
      var error = [];
      for (var key in message) {
        error.push(this._listErrors(message[key], key + ' errors :'));
      }
      errorList = <ul>{error}</ul>;
    } else {
      errorList = message[0];
    }
    return errorList;
  }

  _listErrors(error, lable) {
    var err = [];
    _.map(error, function (errMsg) {
      err.push(<li>{errMsg}</li>);
    });
    return (
      <li>
        <strong>{lable}</strong>
        <br />
        <ul>{err}</ul>
      </li>);
  }

  _closeAlert() {
    this.setState({
      message:      '',
      messageClass: 'hidden',
    });
  }

  _onFileChange(e) {
    var file = e.target.files[0];
    var reader = new FileReader();
    var SELF = this;
    reader.onloadstart = function () {
      $('.image-filename').removeClass('hidden');
      $('.image-title').text('Change certificate');
      SELF.setState({
        fileName:       file.name,
        fileLoadStatus: 'fa-spinner fa-spin',
      });
    };
    reader.onerror = function () {
      SELF.setState({
        fileLoadStatus: 'fa-times red-text',
      });
    };
    reader.onload = function (event) {
      SELF.setState({
        certificate:    event.target.result,
        fileLoadStatus: 'fa-check-circle green-text',
      });
    };
    reader.readAsBinaryString(file);
  }

  render() {
    var _SELF = this;
    var providers = this.props.allProviders || [];
    var credetialInfo = this.state.credetialInfo;
    var input = [];
    if (credetialInfo) {
      var provider = _.find(providers, function (o) { return o.provider === credetialInfo.provider; });
      if ('undefined' !== typeof provider) {
        var credetials = provider.requirements;

        input.push(
          <div key={'integration-name'} className="form-group">
            <label>Name</label>
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-cloud fa" aria-hidden="true"></i></span>
              <input type="text" className="form-control" onChange={function (e) { _SELF.setState({name: e.target.value}); }} value={this.state.name} placeholder="Integration Name" />
            </div>
          </div>
        );
        if (-1 < _.indexOf(credetials, 'api-key')) {
          input.push(
            <div key={'api-key'} className="form-group">
              <label>Api Key</label>
              <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-key fa" aria-hidden="true"></i></span>
                <input type="text" className="form-control" onChange={function (e) { _SELF.setState({apiKey: e.target.value}); }} value={this.state.apiKey} placeholder="API Key" />
              </div>
            </div>
          );
        }
        if (-1 < _.indexOf(credetials, 'endpoint')) {
          input.push(
            <div key={'endpoint'} className="form-group">
              <label>End Point</label>
              <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-user fa" aria-hidden="true"></i></span>
                <input type="text" className="form-control" onChange={function (e) { _SELF.setState({endpoint: e.target.value}); }} value={this.state.endpoint} placeholder="Access Key ID" />
              </div>
            </div>
          );
        }
        if (-1 < _.indexOf(credetials, 'api-secret')) {
          input.push(
            <div key={'api-secret'} className="form-group">
              <label>Api Secret</label>
              <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-lock fa" aria-hidden="true"></i></span>
                <input type="text" className="form-control" onChange={function (e) { _SELF.setState({apiSecret: e.target.value}); }} value={this.state.apiSecret} placeholder="Secret Access Key" />
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
                  <span className="image-title">Upload certificate</span>
                  <input type="file" name="editCertificate" id="editCertificate" onChange={function (e) { _SELF._onFileChange(e); }} />
                </div>
              </span>
              <span className="form-control image-filename hidden">{this.state.fileName}<i className={'fa ' + this.state.fileLoadStatus + ' font-20 pull-right'} aria-hidden="true"></i></span>
            </div>
        );
        }
      }
    }

    return (
      <div>
        <div className="modal fade" id={this.props.modalId} role="dialog">
          <div className="modal-dialog" style={{marginTop: '100px'}} role="document">
            <div className="modal-content">
              <div className="modal-body">
                <button type="button" className="modal-close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
                <div className="dialog-body">
                  <div className="edit-title">Edit Credential</div>
                  <hr />
                  <div className={this.state.messageClass + ' signup-error-show'} >
                    <button type="button" className="close" onClick={function () { this._closeAlert(); }.bind(this)}>
                      <span aria-hidden="true">&times;</span>
                    </button>
                    {this.state.message}
                  </div>
                  {input}
                  <button type="button" className="btn btn-success pull-right public-cloud-button" onClick={function () { _SELF._updateCredentials(); }}>Update</button>
                  <button type="button" className="btn btn-default pull-right public-cloud-button grey-background" data-dismiss="modal">Cancel</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = EditProviderCredential;
