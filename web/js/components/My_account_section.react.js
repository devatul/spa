var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');

module.exports = React.createClass({
  render: function () {
    var firstname = localStorage.getItem('nubity-firstname');
    var lastname  = localStorage.getItem('nubity-lastname');
    var email     = localStorage.getItem('nubity-user-email');
    var language  = localStorage.getItem('nubity-user-language');
    var notificationLevel = localStorage.getItem('nubity-notification-level');
    var avatar    = '';

    if (null === localStorage.getItem('nubity-user-avatar') || 'undefined' === localStorage.getItem('nubity-user-avatar')) {
      avatar = './images/userpic.jpg';
    } else {
      avatar = localStorage.getItem('nubity-user-avatar');
    }

    var alertCheck = '';
    switch (notificationLevel) {
      case 'info' :
        alertCheck = (
          <div className="col-sm-12 light-grey-background">
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="info" checked disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-information blue-text small"></i> Information
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="warning" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-warning yellow-text small"></i> Warning
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="critical" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-critical red-text small"></i> Critical
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="none" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-mute-on grey-text small"></i> Mute
                </div>
              </label>
            </div>
            <div className="min"></div>
          </div>
        );
      break;
      case 'warning' :
        alertCheck = (
          <div className="col-sm-12 light-grey-background">
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="info" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-information blue-text small"></i> Information
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="warning" checked disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-warning yellow-text small"></i> Warning
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="critical" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-critical red-text small"></i> Critical
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="none" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-mute-on grey-text small"></i> Mute
                </div>
              </label>
            </div>
            <div className="min"></div>
          </div>
        );
      break;
      case 'critical' :
        alertCheck = (
          <div className="col-sm-12 light-grey-background">
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="info" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-information blue-text small"></i> Information
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="warning" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-warning yellow-text small"></i> Warning
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="critical" checked disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-critical red-text small"></i> Critical
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="none" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-mute-on grey-text small"></i> Mute
                </div>
              </label>
            </div>
            <div className="min"></div>
          </div>
        );
      break;
      case 'undefined' :
        alertCheck = (
          <div className="col-sm-12 light-grey-background">
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="info" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-information blue-text small"></i> Information
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="warning" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-warning yellow-text small"></i> Warning
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="critical" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-critical red-text small"></i> Critical
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="none" checked disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-mute-on grey-text small"></i> Mute
                </div>
              </label>
            </div>
            <div className="min"></div>
          </div>
        );
      break;
      default :
        alertCheck = (
          <div className="col-sm-12 light-grey-background">
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio1" value="info" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-information blue-text small"></i> Information
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio2" value="warning" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-warning yellow-text small"></i> Warning
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="critical" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-critical red-text small"></i> Critical
                </div>
              </label>
            </div>
            <div className="col-md-3 col-xs-12">
              <label className="input-group">
                <span className="input-group-addon">
                  <input type="radio" name="inlineRadioOptions" id="inlineRadio3" value="none" disabled/>
                </span>
                <div className="form-control">
                  <i className="icon nb-mute-on grey-text small"></i> Mute
                </div>
              </label>
            </div>
            <div className="min"></div>
          </div>
        );
    }

    return (
      <div>
        <div className="section-title">
          <h2>My Account</h2>
        </div>
        <div className="row">
          <div className="col-xs-1">
            <img src={avatar} height="65" alt={firstname} title={firstname} className="img-circle"/>
          </div>
          <div className="col-xs-8 my-account-data">
            <p className="my-account-title">{firstname} {lastname} </p>
            <p className="my-account-email">{email}</p>
          </div>
        </div>
        <hr/>
        <form >
          <div className="public-cloud-form col-sm-6">
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-user small" aria-hidden="true"></i>
                </span>
                <input type="text" className="form-control no-shadow" id="privateUser" placeholder="First Name" value={firstname} readOnly/>
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-user small" aria-hidden="true"></i>
                </span>
                <input type="text" className="form-control no-shadow" id="privatePassword" placeholder="Last Name" value={lastname} readOnly/>
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-servers small" aria-hidden="true"></i>
                </span>
                <input type="email" className="form-control no-shadow" id="integrationName" placeholder="Email" value={email} readOnly/>
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-lock small" aria-hidden="true"></i>
                </span>
                <input type="password" className="form-control no-shadow" id="privateNubityName" placeholder="Password" readOnly/>
              </div>
            </div>
          </div>
          <div className="public-cloud-form col-sm-6">
            <div className="form-group hidden">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-skype small" aria-hidden="true"></i>
                </span>
                <input type="text" className="form-control no-shadow" id="skype" placeholder="Skype"/>
              </div>
            </div>
            <div className="form-group">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-language small" aria-hidden="true"></i>
                </span>
                <select className="form-control no-shadow" id="language" readOnly>
                  <option>{language}</option>
                </select>
              </div>
            </div>
            <div className="form-group hidden">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-time small" aria-hidden="true"></i>
                </span>
                <input type="text" className="form-control no-shadow" id="timeZone" placeholder="Time Zone"/>
              </div>
            </div>
            <div className="form-group hidden">
              <div className="input-group">
                <span className="input-group-addon">
                  <i className="input-icon icon nb-user small" aria-hidden="true"></i>
                </span>
                <input type="text" className="form-control no-shadow" id="contactType" placeholder="Contact Type"/>
              </div>
            </div>
          </div>
          <div className="col-sm-12 light-grey-background">
            <h3><i className="medium icon nb-notification" aria-hidden="true"></i><span className="padding-left">Alert level notification</span></h3>
          </div>
            {alertCheck}
          <div className="col-sm-12">
            <button type="button" className="btn btn-success pull-right public-cloud-button disabled">Save</button>
          </div>
        </form>
      </div>
    );
  },
});
