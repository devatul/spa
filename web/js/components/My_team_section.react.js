var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var createUser                 = require('../actions/RequestActions').createUser;
var getUserRoles               = require('../actions/RequestActions').getUserRoles;
var updateNotificationLevel    = require('../actions/RequestActions').updateNotificationLevel;
var getUserData                = require('../actions/StorageActions').getUserData;
var SessionStore               = require('../stores/SessionStore');
var _                          = require('lodash');
var Select2                    = require('react-select');

class MyTeamSection extends React.Component {
  constructor(props) {
    super(props);
    var timezones = SessionStore.getTimezones();
    var locales = SessionStore.getLocales();
    var roles = SessionStore.getUserRoles();
    this.state = {
      timezones:         timezones,
      locales:           locales,
      roles:             roles,
      firstname:         '',
      lastname:          '',
      email:             '',
      language:          getUserData('locale'),
      notificationLevel: '',
      timezone:          getUserData('timezone'),
      password:          '',
      cmfPassword:       '',
      userRole:          [],
      message:           '',
      messageClass:      'hidden',
    };
    this._onChange = this._onChange.bind(this);
    this._submit = this._submit.bind(this);
    this._showError = this._showError.bind(this);
    this._listErrors = this._listErrors.bind(this);
    this._closeAlert = this._closeAlert.bind(this);
  }

  componentDidMount() {
    SessionStore.addChangeListener(this._onChange);
    getUserRoles();
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    var timezones = SessionStore.getTimezones();
    var locales = SessionStore.getLocales();
    var roles = SessionStore.getUserRoles();
    this.setState({
      timezones: timezones,
      locales:   locales,
      roles:     roles,
    });
  }

  _submit() {
    var userRole = [];
    _.map(this.state.userRole, (role)=>{
      userRole.push(role.value);
    });
    var userData = {
      firstname: this.state.firstname,
      lastname:  this.state.lastname,
      email:     this.state.email,
      locale:    this.state.language,
      timezone:  this.state.timezone,
      role:      userRole,
      password:  {
        password:        this.state.password,
        password_repeat: this.state.cmfPassword,
      },
    };

    createUser(userData).then(function (text) {
      this.setState({
        message:      'User created successfully',
        messageClass: 'alert alert-success',
        firstname:    '',
        lastname:     '',
        email:        '',
        language:     '',
        timezone:     '',
        password:     '',
        cmfPassword:  '',
        userRole:     [],
      });
      updateNotificationLevel(text.user, this.state.notificationLevel).then(function (msg) {
        this.setState({
          notificationLevel: '',
        });
      }.bind(this));
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
    var notificationLevel = this.state.notificationLevel;
    var locale = this.state.locales;
    var SELF = this;

    var timezones = [];
    _.map(this.state.timezones, function (timezone, i) {
      timezones.push(<option key={i} value={timezone} >{timezone}</option>);
    });

    var locales = [];
    for (var key in locale) {
      locales.push(<option key={key} value={key} >{locale[key]}</option>);
    }

    var options = [];
    _.map(this.state.roles, function (role) {
      options.push({value: role, label: role});
    });

    return (
      <div>
        <div>
          <div className="section-title">
            <h2>My Team</h2>
          </div>
          <div className="row">
            <div className="col-xs-1">
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" height="45" width="45" alt="..." className="img-circle" />
            </div>
            <div className="col-xs-1">
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" height="45" width="45" alt="..." className="img-circle" />
            </div>
            <div className="col-xs-1">
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" height="45" width="45" alt="..." className="img-circle" />
            </div>
            <div className="col-xs-1">
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" height="45" width="45" alt="..." className="img-circle" />
            </div>
            <div className="col-xs-1">
              <button className="btn-plus-circle">+</button>
            </div>
          </div>
          <hr />
          <div className={this.state.messageClass + ' signup-error-show'} >
            <button type="button" className="close" onClick={function () { SELF._closeAlert('formAlert'); }}>
              <span aria-hidden="true">&times;</span>
            </button>
            {this.state.message}
          </div>
          <form >
            <div className="public-cloud-form col-lg-offset-0 col-lg-6">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-user" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="privateUser" placeholder="First Name" onChange={function (e) {
                    SELF.setState({
                      firstname: e.target.value,
                    });
                  }} value={this.state.firstname} />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-user" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="privatePassword" placeholder="Last Name" onChange={function (e) {
                    SELF.setState({
                      lastname: e.target.value,
                    });
                  }} value={this.state.lastname} />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-server" aria-hidden="true"></i>
                  </div>
                  <input type="text" className="form-control no-shadow" id="integrationName" placeholder="Email" onChange={function (e) {
                    SELF.setState({
                      email: e.target.value,
                    });
                  }} value={this.state.email} />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon icon nb-lock" aria-hidden="true"></i>
                  </div>
                  <input type="password" className="form-control no-shadow" id="password" placeholder="Password" onChange={function (e) {
                    SELF.setState({
                      password: e.target.value,
                    });
                  }} value={this.state.password} />
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <span className="input-group-addon">
                    <i className="input-icon icon nb-lock" aria-hidden="true"></i>
                  </span>
                  <input type="password" className="form-control no-shadow" ref="cmfPassword" placeholder="confirm Password" onChange={function (e) {
                    SELF.setState({
                      cmfPassword: e.target.value,
                    });
                  }} value={this.state.cmfPassword} />
                </div>
              </div>
            </div>
            <div className="public-cloud-form col-lg-offset-0 col-lg-6">
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-language" aria-hidden="true"></i>
                  </div>
                  <select className="form-control no-shadow" ref="language" value={this.state.language} onChange={function (e) {
                    SELF.setState({
                      language: e.target.value,
                    });
                  }} >
                    {locales}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-clock-o" aria-hidden="true"></i>
                  </div>
                  <select className="form-control no-shadow" ref="timezone" value={this.state.timezone} onChange={function (e) {
                    SELF.setState({
                      timezone: e.target.value,
                    });
                  }} >
                    {timezones}
                  </select>
                </div>
              </div>
              <div className="form-group">
                <div className="input-group">
                  <div className="input-group-addon">
                    <i className="input-icon fa fa-lock" aria-hidden="true"></i>
                  </div>
                  <Select2
                    multi
                    className="select2-roles"
                    name="roles"
                    value={this.state.userRole}
                    options={options}
                    placeholder="select user roles..."
                    onChange={(val) => {
                      this.setState({
                        userRole: val,
                      });
                    }}
                  />
                </div>
              </div>
            </div>
            <div className="col-sm-12">
              <h3><i className="input-icon fa fa-bell" aria-hidden="true"></i><span className="padding-left">Alerts Notification</span></h3>
            </div>
            <div className="col-sm-12">
              <div className="col-lg-3 col-md-6 col-xs-12">
                <label className="input-group">
                  <span className="input-group-addon">
                    <input type="radio" name="notificationLevel" id="inlineRadio1" value="info" onChange={function (e) {
                      SELF.setState({
                        notificationLevel: 'info',
                      });
                    }} checked={'info' === notificationLevel} />
                  </span>
                  <div className="form-control inline-flex">
                    <i className="icon nb-information blue-text small"></i> Information
                  </div>
                </label>
              </div>
              <div className="col-lg-3 col-md-6 col-xs-12">
                <label className="input-group">
                  <span className="input-group-addon">
                    <input type="radio" name="notificationLevel" id="inlineRadio2" value="warning" onChange={function (e) {
                      SELF.setState({
                        notificationLevel: 'warning',
                      });
                    }} checked={'warning' === notificationLevel} />
                  </span>
                  <div className="form-control inline-flex">
                    <i className="icon nb-warning yellow-text small"></i> Warning
                  </div>
                </label>
              </div>
              <div className="col-lg-3 col-md-6 col-xs-12">
                <label className="input-group">
                  <span className="input-group-addon">
                    <input type="radio" name="notificationLevel" id="inlineRadio3" value="critical" onChange={function (e) {
                      SELF.setState({
                        notificationLevel: 'critical',
                      });
                    }} checked={'critical' === notificationLevel} />
                  </span>
                  <div className="form-control inline-flex">
                    <i className="icon nb-critical red-text small"></i> Critical
                  </div>
                </label>
              </div>
              <div className="col-lg-3 col-md-6 col-xs-12">
                <label className="input-group">
                  <span className="input-group-addon">
                    <input type="radio" name="notificationLevel" id="inlineRadio3" value="none" onChange={function (e) {
                      SELF.setState({
                        notificationLevel: 'none',
                      });
                    }} checked={undefined === notificationLevel || 'none' === notificationLevel || null === notificationLevel} />
                  </span>
                  <div className="form-control inline-flex">
                    <i className="icon nb-mute-on grey-text small"></i> Mute
                   </div>
                </label>
              </div>
              <div className="min"></div>
            </div>
            <div className="col-sm-12">
              <button type="button" onClick={this._submit} className="btn btn-success pull-right public-cloud-button">Save</button>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

module.exports = MyTeamSection;
