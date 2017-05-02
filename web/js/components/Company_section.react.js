var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var getCompanyInfo             = require('../actions/RequestActions').getCompanyInfo;
var getUserData                = require('../actions/StorageActions').getUserData;
var updateCompanyInfo          = require('../actions/RequestActions').updateCompanyInfo;
var _                          = require('lodash');

class CompanySection extends React.Component {
  constructor(props) {
    super(props);
    var companyInfo = SessionStore.getCompanyInfo();
    var timezones = SessionStore.getTimezones();
    var locales = SessionStore.getLocales();
    this.state = {
      timezones:    timezones,
      locales:      locales,
      name:         companyInfo.name || '',
      tradeName:    companyInfo.trade_name || '',
      tin:          companyInfo.tin || '',
      address:      companyInfo.address || '',
      country:      companyInfo.country || '',
      state:        companyInfo.state || '',
      city:         companyInfo.city || '',
      language:     companyInfo.locale || '',
      postalCode:   companyInfo.postal_code || '',
      timezone:     companyInfo.timezone || '',
      message:      '',
      messageClass: 'hidden',
    };
    this._onChange = this._onChange.bind(this);
    this._submit = this._submit.bind(this);
    this._showError = this._showError.bind(this);
    this._listErrors = this._listErrors.bind(this);
    this._closeAlert = this._closeAlert.bind(this);
  }

  componentDidMount() {
    SessionStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    var companyInfo = SessionStore.getCompanyInfo();
    var timezones = SessionStore.getTimezones();
    var locales = SessionStore.getLocales();
    this.setState({
      timezones:  timezones,
      locales:    locales,
      name:       companyInfo.name || '',
      tradeName:  companyInfo.trade_name || '',
      tin:        companyInfo.tin || '',
      address:    companyInfo.address || '',
      country:    companyInfo.country || '',
      state:      companyInfo.state || '',
      city:       companyInfo.city || '',
      language:   companyInfo.locale || '',
      postalCode: companyInfo.postal_code || '',
      timezone:   companyInfo.timezone || '',
    });
  }

  _submit() {
    var companyInfo = {
      name:        this.state.name,
      trade_name:  this.state.tradeName,
      tin:         this.state.tin,
      address:     this.state.address,
      country:     this.state.country,
      state:       this.state.state,
      city:        this.state.city,
      locale:      this.state.language,
      timezone:    this.state.timezone,
      postal_code: this.state.postalCode,
    };

    updateCompanyInfo(companyInfo).then(function (msg) {
      this.setState({
        message:      msg,
        messageClass: 'alert alert-success',
      });
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

  render() {
    var SELF = this;
    var locale = this.state.locales;

    var timezones = [];
    _.map(this.state.timezones, function (timezone, i) {
      timezones.push(<option key={i} value={timezone}>{timezone}</option>);
    });

    var locales = [];
    for (var key in locale) {
      locales.push(<option key={key} value={key}>{locale[key]}</option>);
    }

    return (
      <div>
        <div>
          <div className={this.state.messageClass + ' signup-error-show'} >
            <button type="button" className="close" onClick={function () { SELF._closeAlert(); }}>
              <span aria-hidden="true">&times;</span>
            </button>
            {this.state.message}
          </div>
          <form >
            <div className="public-cloud-form col-sm-6">
              <div className="form-group">
                <label className="company-labels">Company name</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-suitcase" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="companyName" placeholder="Company Name" onChange={function (e) {
                    SELF.setState({
                      name: e.target.value,
                    });
                  }} value={this.state.name} />
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-sm-6">
              <div className="form-group">
                <label className="company-labels">Comercial name</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-area-chart" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="nameComercial" placeholder="Name Comercial" onChange={function (e) {
                    SELF.setState({
                      tradeName: e.target.value,
                    });
                  }} value={this.state.tradeName} />
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-sm-12">
              <div className="form-group">
                <label className="company-labels">Taxpayer Identification Number</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-suitcase" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="tin" placeholder="TIN" onChange={function (e) {
                    SELF.setState({
                      tin: e.target.value,
                    });
                  }} value={this.state.tin} />
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-xs-4 hidden">
              <div className="form-group">
                <label className="company-labels">Country</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-flag" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="country" placeholder="Country" onChange={function (e) {
                    SELF.setState({
                      country: e.target.value,
                    });
                  }} value={this.state.country} />
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-xs-4 hidden">
              <div className="form-group">
                <label className="company-labels">State</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-flag" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="state" placeholder="State" onChange={function (e) {
                    SELF.setState({
                      state: e.target.value,
                    });
                  }} value={this.state.state} />
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-xs-4 hidden">
              <div className="form-group">
                <label className="company-labels">City</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-flag" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="city" placeholder="City" onChange={function (e) {
                    SELF.setState({
                      city: e.target.value,
                    });
                  }} value={this.state.city} />
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-xs-12">
              <div className="form-group">
                <label className="company-labels">Address</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-map-marker" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="skype" placeholder="Address" onChange={function (e) {
                    SELF.setState({
                      address: e.target.value,
                    });
                  }} value={this.state.address} />
                </div>
              </div>
              <div className="form-group">
                <label className="company-labels">Language</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon icon fa fa-language small" aria-hidden="true"></i>
                  </div>
                  <select className="form-control no-shadow" id="language" onChange={function (e) {
                    SELF.setState({
                      language: e.target.value,
                    });
                  }} value={this.state.language} >
                    {locales}
                  </select>
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-xs-6">
              <div className="form-group">
                <label className="company-labels">Timezone</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon icon nb-time small" aria-hidden="true"></i>
                  </div>
                  <select className="form-control no-shadow" id="timezone" onChange={function (e) {
                    SELF.setState({
                      timezone: e.target.value,
                    });
                  }} value={this.state.timezone} >
                    {timezones}
                  </select>
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-xs-6">
              <div className="form-group">
                <label className="company-labels">Postal code</label>
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-envelope" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="postalCode" placeholder="Postal Code" onChange={function (e) {
                    SELF.setState({
                      postalCode: e.target.value,
                    });
                  }} value={this.state.postalCode} />
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <button type="button" className="btn btn-success pull-right public-cloud-button" onClick={this._submit}>Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

module.exports = CompanySection;
