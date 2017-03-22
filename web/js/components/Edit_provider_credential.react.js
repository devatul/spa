var React                      = require('react');
var _                          = require('lodash');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      credetialInfo: '',
      name: '',
      apiKey: '',
      endpoint: '',
      apiSecret: '',
      certificate: '',
    };
  },

  componentDidMount: function () {

  },

  componentWillUnmount: function () {

  },

  componentWillReceiveProps: function (props) {
    var credentialDetails = props.credentialDetails;
    var credetialInfo = props.credetialInfo;
    if (props.open
      && !_.isEmpty(credentialDetails)
      && credetialInfo
      && credentialDetails.provider_credential == credetialInfo.provider_credential) {
      this.setState({
        credetialInfo: props.credetialInfo,
        name: credentialDetails.name,
        apiKey: credentialDetails.api_key,
        endpoint: credentialDetails.endpoint,
        apiSecret: credentialDetails.api_secret,
        certificate: credentialDetails.certificate,
      });
    }
  },

  _resetDialog: function () {
    $('#'+this.props.modalId).modal('toggle');
    this.setState({
      credetialInfo: '',
      name: '',
      apiKey: '',
      endpoint: '',
      apiSecret: '',
      certificate: '',
    });
  },

  _updateCredentials: function () {
    var _SELF = this;
    var credetialId = this.state.credetialInfo.provider_credential || null;
    var providerId = this.state.credetialInfo.provider || null;
    var integrationName = this.state.name || null;
    var apiKey = this.state.apiKey || null;
    var endpoint = this.state.endpoint || null;
    var apiSecret = this.state.apiSecret || null;
    var company = this.state.credetialInfo.company || null;
    var certificate = this.state.certificate || null;

    var newCredential = new FormData();

    newCredential.append('name', integrationName);
    newCredential.append('api_key', apiKey);
    newCredential.append('endpoint', endpoint);
    newCredential.append('api_secret', apiSecret);
    newCredential.append('certificate', certificate);
    newCredential.append('provider_id', providerId);
    newCredential.append('company_id', company);

    this.props.updateCredentials(credetialId, newCredential)
    .then(function () {
      _SELF.props.refreshTable();
      _SELF._resetDialog();
    });
  },

  _onFileChange: function (e) {
    var file = e.target.files[0];
    this.setState({
      certificate: file,
    });
    $('.image-preview-input-title').text('Change Certificate');
    $('.image-preview-filename').text(file.name).removeClass('hidden');
  },

  render: function () {
    var _SELF = this;
    var providers = this.props.allProviders || [];
    var credetialInfo = this.state.credetialInfo;
    var input = [];
    if (credetialInfo) {
      var provider = _.find(providers, function (o) { return o.provider == credetialInfo.provider; });
      if ('undefined' !== typeof provider) {
        var credetials = provider.requirements;

        input.push(
          <div className="form-group">
            <label>Name</label>
            <div className="input-group">
              <span className="input-group-addon"><i className="fa fa-cloud fa" aria-hidden="true"></i></span>
              <input type="text" className="form-control" onChange={function (e) {_SELF.setState({name: e.target.value});}} value={this.state.name} placeholder="Integration Name"/>
            </div>
          </div>
        );
        if (credetials['api-key']) {
          input.push(
            <div className="form-group">
              <label>Api Key</label>
              <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-key fa" aria-hidden="true"></i></span>
                <input type="text" className="form-control" onChange={function (e) {_SELF.setState({apiKey: e.target.value});}} value={this.state.apiKey} placeholder="API Key"/>
              </div>
            </div>
          );
        }
        if (credetials['endpoint']) {
          input.push(
            <div className="form-group">
              <label>End Point</label>
              <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-user fa" aria-hidden="true"></i></span>
                <input type="text" className="form-control" onChange={function (e) {_SELF.setState({endpoint: e.target.value});}} value={this.state.endpoint} placeholder="Access Key ID"/>
              </div>
            </div>
          );
        }
        if (credetials['api-secret']) {
          input.push(
            <div className="form-group">
              <label>Api Secret</label>
              <div className="input-group">
                <span className="input-group-addon"><i className="fa fa-lock fa" aria-hidden="true"></i></span>
                <input type="text" className="form-control" onChange={function (e) {_SELF.setState({apiSecret: e.target.value});}} value={this.state.apiSecret} placeholder="Secret Access Key"/>
              </div>
            </div>
          );
        }
        if (credetials['certificate']) {
          input.push(
            <div className="input-group image-preview">
              <span className="input-group-btn">
                <div className="btn btn-default image-preview-input">
                    <span className="glyphicon glyphicon-folder-open"></span>
                    <span className="image-preview-input-title">Upload Certificate</span>
                    <input type="file" name="editCertificate" id="editCertificate" onChange={function (e) {_SELF._onFileChange(e);}}/>
                </div>
              </span>
              <span className="form-control image-preview-filename hidden"></span>
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
                      {input}
                    <button type="button" className="btn btn-success pull-right public-cloud-button" onClick={function () {_SELF._updateCredentials();}}>Update</button>
                    <button type="button" className="btn btn-default pull-right public-cloud-button grey-background" data-dismiss="modal">Cancel</button>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
});
