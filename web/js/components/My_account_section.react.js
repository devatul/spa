var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var updateUserData             = require('../actions/RequestActions').updateUserData;
var SessionStore               = require('../stores/SessionStore');
var _                          = require('lodash');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      firstname: localStorage.getItem('nubity-firstname'),
      lastname:   localStorage.getItem('nubity-lastname'),
      email: localStorage.getItem('nubity-user-email'),
      language: localStorage.getItem('nubity-user-language'),
      notificationLevel: localStorage.getItem('nubity-notification-level'),
      timezone: localStorage.getItem('nubity-timezone'),
      enableEdit: false,
      message: '',
      messageClass: 'hidden',
    };
  },

  _submit: function () {
    var userData = {
      firstname: this.state.firstname,
      lastname: this.state.lastname,
      email: this.state.email,
      language: this.state.language,
      notificationLevel: this.state.notificationLevel,
      timezone: this.state.timezone,
    };
    updateUserData(userData).then(function (msg) {
      this.setState({
        message: msg,
        messageClass: 'alert alert-success',
      });
    }.bind(this)).catch(function (message) {
      var error = [];
      for (var key in message) {
        error.push(this._listErrors(message[key], key + ' errors :'));
      }
      var errorList = <ul>{error}</ul>;
      this.setState({
        message: errorList,
        messageClass: 'alert alert-danger',
      });
    }.bind(this));
  },

  _listErrors: function (error, lable) {
    var err = [];
    _.map(error, function (errMsg) {
      err.push(<li>{errMsg}</li>);
    });
    return <li><strong>{lable}</strong><br/>
        <ul>{err}</ul>
      </li>;
  },

  _enableEdit: function () {
    this.setState({
      enableEdit: true,
    });
  },

  _cancleEdit: function () {
    this.setState({
      enableEdit: false,
    });
  },

  _formButtons: function () {
    if (this.state.enableEdit) {
      return <span>
        <button type="button" onClick={this._submit} className="btn btn-success pull-right public-cloud-button">Save</button>
        <button type="button" onClick={this._cancleEdit} className="btn btn-default pull-right public-cloud-button">Cancle</button>
      </span>;
    } else {
      return <button type="button" onClick={this._enableEdit} className="btn btn-success pull-right public-cloud-button">Edit</button>;
    }
  },

  render: function () {
    var notificationLevel = this.state.notificationLevel;
    var avatar    = '';

    if (null === localStorage.getItem('nubity-user-avatar') || 'undefined' === localStorage.getItem('nubity-user-avatar')) {
      avatar = './images/userpic.jpg';
    } else {
      avatar = localStorage.getItem('nubity-user-avatar');
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
              }} checked={'info' === notificationLevel ? true : false} disabled={!this.state.enableEdit}/>
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
              }} checked={'warning' === notificationLevel ? true : false} disabled={!this.state.enableEdit}/>
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
              }} checked={'critical' === notificationLevel ? true : false}  disabled={!this.state.enableEdit}/>
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
              }} checked={'undefined' === notificationLevel || 'none' === notificationLevel ? true : false} disabled={!this.state.enableEdit}/>
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
        <div className="row">
          <div className="col-xs-12 col-sm-1 col-md-1 centered">
            <img src={avatar} height="65" alt={this.state.firstname} title={this.state.firstname} className="img-circle"/>
          </div>
          <div className="col-xs-12 col-sm-1 col-md-1 my-account-data">
            <p className="my-account-title">{this.state.firstname} {this.state.lastname} </p>
            <p className="my-account-email">{this.state.email}</p>
          </div>
        </div>
        <hr/>
        <div className={this.state.messageClass + ' signup-error-show'}>{this.state.message}</div>
        <form >
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
                }} id="firstname" placeholder="First Name" value={this.state.firstname} readOnly={!this.state.enableEdit} />
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
                }} ref="lastname" placeholder="Last Name" value={this.state.lastname}  readOnly={!this.state.enableEdit} />
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
                }} ref="email" placeholder="Email" value={this.state.email}  readOnly={!this.state.enableEdit} />
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-lock small" aria-hidden="true"></i>
                </span>
                <input type="password" className="form-control no-shadow" ref="password" placeholder="Password" readOnly/>
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
                <select className="form-control no-shadow" ref="language" onChange={function (e) {
                  SELF.setState({
                    language: e.target.value,
                  });
                }} disabled={!this.state.enableEdit}>
                  <option>{this.state.language}</option>
                </select>
              </div>
            </div>
            <div className="form-group hidden">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-time small" aria-hidden="true"></i>
                </span>
                <input type="text" className="form-control no-shadow" ref="timeZone" placeholder="Time Zone"/>
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
            {this._formButtons()}
          </div>
        </form>
      </div>
    );
  },
});
