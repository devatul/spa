var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var updateUserData             = require('../actions/RequestActions').updateUserData;
var updateNotificationLevel    = require('../actions/RequestActions').updateNotificationLevel;
var getTimezone                = require('../actions/RequestActions').getTimezone;
var getLocales                 = require('../actions/RequestActions').getLocales;
var getUserData                = require('../actions/StorageActions').getUserData;
var SessionStore               = require('../stores/SessionStore');
var _                          = require('lodash');

module.exports = React.createClass({
  getInitialState: function () {
    var timezones = SessionStore.getTimezones();
    var locales = SessionStore.getLocales();
    var notificationLevel = this._getNotificationLevel();

    return {
      timezones: timezones,
      locales: locales,
      firstname: getUserData('firstname'),
      lastname: getUserData('lastname'),
      email: getUserData('username'),
      language: getUserData('locale'),
      notificationLevel: notificationLevel,
      timezone: getUserData('timezone'),
      password: '',
      cmfPassword: '',
      avatar: false,
      message: '',
      messageClass: 'hidden',
      n_message: '',
      n_messageClass: 'hidden',
    };
  },

  componentDidMount: function () {
    getTimezone();
    getLocales();
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var timezones = SessionStore.getTimezones();
      var locales = SessionStore.getLocales();
      this.setState({
        timezones: timezones,
        locales: locales,
      });
    }
  },

  _getNotificationLevel: function () {
    var user = JSON.parse(localStorage.getItem('nubity-user'));
    var notificationLevel = null;
    if (user && user.notification_severity_level) {
      notificationLevel = user.notification_severity_level[0].name;
    }
    return notificationLevel;
  },

  _submit: function () {
    var userData = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      locale: this.state.language,
      timezone: this.state.timezone,
      password: {
        password: this.state.password,
        password_repeat: this.state.cmfPassword,
      },
    };

    updateUserData(userData).then(function (msg) {
      this.setState({
        message: msg,
        messageClass: 'alert alert-success',
        firstname: getUserData('firstname'),
        lastname: getUserData('lastname'),
        email: getUserData('username'),
        language: getUserData('locale'),
        timezone: getUserData('timezone'),
      });
    }.bind(this)).catch(function (message) {
      var err = this._showError(message);
      this.setState({
        message: err,
        messageClass: 'alert alert-danger',
      });
    }.bind(this));

    updateNotificationLevel(this.state.notificationLevel).then(function (msg) {
      this.setState({
        n_message: msg,
        n_messageClass: 'alert alert-success',
        notificationLevel: this._getNotificationLevel(),
      });
    }.bind(this)).catch(function (message) {
      var err = this._showError(message);
      this.setState({
        n_message: err,
        n_messageClass: 'alert alert-danger',
      });
    }.bind(this));
  },

  _showError: function (message) {
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
  },

  _listErrors: function (error, lable) {
    var err = [];
    _.map(error, function (errMsg) {
      err.push(<li>{errMsg}</li>);
    });
    return (
      <li>
        <strong>{lable}</strong>
        <br/>
        <ul>{err}</ul>
      </li>);
  },

  _onChangeAvatar: function (e) {
    var file = e.target.files[0];
    this.setState({
      avatar: file,
    });
  },

  _closeAlert: function (alertToken) {
    if ('formAlert' === alertToken) {
      this.setState({
        message: '',
        messageClass: 'hidden',
      });
    }
    if ('severityAlert' === alertToken) {
      this.setState({
        n_message: '',
        n_messageClass: 'hidden',
      });
    }
  },

  render: function () {
    var notificationLevel = this.state.notificationLevel;
    var locale = this.state.locales;
    var avatar    = '';

    if (!getUserData('public_path')) {
      avatar = './images/userpic.jpg';
    } else {
      avatar = getUserData('public_path');
    }

    var timezones = [];
    _.map(this.state.timezones,function (timezone, i) {
      timezones.push(<option key={i} value={timezone} >{timezone}</option>);
    });

    var locales = [];
    for (var key in locale) {
      locales.push(<option key={key} value={key} >{locale[key]}</option>);
    }

    var SELF = this;

    var alertCheck = (
      <div className="col-sm-12 light-grey-background">
        <div className="col-lg-3 col-md-6 col-xs-12">
          <label className="input-group">
            <span className="input-group-addon">
              <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="info" onChange={function (e) {
                SELF.setState({
                  notificationLevel: 'info',
                });
              }} checked={'info' === notificationLevel} />
            </span>
            <div className="form-control">
              <i className="icon nb-information blue-text small"></i> Information
            </div>
          </label>
        </div>
        <div className="col-lg-3 col-md-6 col-xs-12">
          <label className="input-group">
            <span className="input-group-addon">
              <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="warning" onChange={function (e) {
                SELF.setState({
                  notificationLevel: 'warning',
                });
              }} checked={'warning' === notificationLevel} />
            </span>
            <div className="form-control">
              <i className="icon nb-warning yellow-text small"></i> Warning
            </div>
          </label>
        </div>
        <div className="col-lg-3 col-md-6 col-xs-12">
          <label className="input-group">
            <span className="input-group-addon">
              <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="critical" onChange={function (e) {
                SELF.setState({
                  notificationLevel: 'critical',
                });
              }} checked={'critical' === notificationLevel}  />
            </span>
            <div className="form-control">
              <i className="icon nb-critical red-text small"></i> Critical
            </div>
          </label>
        </div>
        <div className="col-lg-3 col-md-6 col-xs-12">
          <label className="input-group">
            <span className="input-group-addon">
              <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="none" onChange={function (e) {
                SELF.setState({
                  notificationLevel: 'none',
                });
              }} checked={'undefined' === notificationLevel || 'none' === notificationLevel} />
            </span>
            <div className="form-control">
              <i className="icon nb-mute-on grey-text small"></i> Mute
             </div>
          </label>
        </div>
        <div className="min"></div>
      </div>
    );

    return (
      <div>
        <div className="section-title">
          <h2>My Account</h2>
        </div>
        <form encType="multipart/form-data">
        <div className="row">
          <div className="col-xs-12 col-sm-1 col-md-1 centered enable-change-option">
            <img src={avatar} height="65" alt={this.state.firstname} title={this.state.firstname} className="img-circle"/>
            <div className="change-avatar">
              <input type="file" name="changeAvatar" id="changeAvatar" onChange={function (e) {
                SELF._onChangeAvatar(e);
              }} />
              <i className="fa fa-camera cam-icon" aria-hidden="true"></i>
            </div>
          </div>
          <div className="col-xs-12 col-sm-1 col-md-1 my-account-data">
            <p className="my-account-title">{this.state.firstname} {this.state.lastname} </p>
            <p className="my-account-email">{this.state.email}</p>
          </div>
          <span className={this.state.avatar ? 'avatar-slected' : 'hidden'}>Avatar Slected</span>
        </div>
      </form>
        <hr/>
        <div className={this.state.messageClass + ' signup-error-show'} >
          <button type="button" className="close" onClick={ function () { SELF._closeAlert('formAlert'); }}>
            <span aria-hidden="true">&times;</span>
          </button>
          {this.state.message}
        </div>
        <div className={this.state.n_messageClass + ' signup-error-show'} >
          <button type="button" className="close" onClick={ function () { SELF._closeAlert('severityAlert'); }}>
            <span aria-hidden="true">&times;</span>
          </button>
          {this.state.n_message}
        </div>
        <form>
          <div className="public-cloud-form col-sm-6">
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-user small" aria-hidden="true"></i>
                </span>
                <input type="text" className="form-control no-shadow" onChange={function (e) {
                  SELF.setState({
                    firstname: e.target.value,
                  });
                }} id="firstname" placeholder="First Name" value={this.state.firstname} />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-user small" aria-hidden="true"></i>
                </span>
                <input type="text" className="form-control no-shadow" onChange={function (e) {
                  SELF.setState({
                    lastname: e.target.value,
                  });
                }} ref="lastname" placeholder="Last Name" value={this.state.lastname} />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-servers small" aria-hidden="true"></i>
                </span>
                <input type="email" className="form-control no-shadow" onChange={function (e) {
                  SELF.setState({
                    email: e.target.value,
                  });
                }} ref="email" placeholder="Email" value={this.state.email} readOnly/>
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-lock small" aria-hidden="true"></i>
                </span>
                <input type="password" className="form-control no-shadow" ref="password" placeholder="Password" onChange={function (e) {
                  SELF.setState({
                    password: e.target.value,
                  });
                }} value={this.state.password} />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-lock small" aria-hidden="true"></i>
                </span>
                <input type="password" className="form-control no-shadow" ref="cmfPassword" placeholder="confirm Password" onChange={function (e) {
                  SELF.setState({
                    cmfPassword: e.target.value,
                  });
                }} value={this.state.cmfPassword} />
              </div>
            </div>
          </div>
          <div className="public-cloud-form col-sm-6">
            <div className="form-group hidden">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-skype small" aria-hidden="true"></i>
                </span>
                <input type="text" className="form-control no-shadow" ref="skype" placeholder="Skype"/>
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-language small" aria-hidden="true"></i>
                </span>
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
                <span className="input-group-addon">
                  <i className="input-icon icon nb-time small" aria-hidden="true"></i>
                </span>
                <select className="form-control no-shadow" ref="timezone" value={this.state.timezone} onChange={function (e) {
                  SELF.setState({
                    timezone: e.target.value,
                  });
                }} >
                {timezones}
                </select>
              </div>
            </div>
            <div className="form-group hidden">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-user small" aria-hidden="true"></i>
                </span>
                <input type="text" className="form-control no-shadow" ref="contactType" placeholder="Contact Type"/>
              </div>
            </div>
          </div>
          <div className="col-sm-12 light-grey-background">
            <h3><i className="medium icon nb-notification" aria-hidden="true"></i><span className="padding-left">Alert level notification</span></h3>
          </div>
            {alertCheck}
          <div className="col-sm-12">
            <button type="button" onClick={this._submit} className="btn btn-success pull-right public-cloud-button">Save</button>
          </div>
        </form>
      </div>
    );
  },
});
