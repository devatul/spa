var React                      = require('react');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var signupAction               = require('../actions/RequestActions').signup;
var _                          = require('lodash');

module.exports = React.createClass({
  getInitialState: function () {

    return {
      message:      '',
      messageClass: 'hidden',
    };
  },

  componentDidMount: function () {
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      var message = SessionStore.signupMessage();
      if ('' != message) {
        this.setState({
          message:      message,
          messageClass: 'alert alert-success',
        });
      }
    }
  },
  _createTicket: function () {
    redirect('create_ticket');
  },

  _liveChat: function () {
    redirect('live_chat');
  },

  _redirectLogin: function () {
    redirect('login');
  },

  _redirectTerms: function () {
    redirect('terms_and_conditions');
  },

  _redirectPolicy: function () {
    redirect('privacy_policies');
  },

  _onSubmit: function (e) {
    e.preventDefault();
    var user       = {};
    user.firstname = this.refs.firstname.getDOMNode().value;
    user.lastname = this.refs.lastname.getDOMNode().value;
    user.email = this.refs.email.getDOMNode().value;
    user.password = this.refs.password.getDOMNode().value;
    user.password2 = this.refs.password2.getDOMNode().value;
    user.phone = this.refs.phone.getDOMNode().value;
    user.company = this.refs.companyName.getDOMNode().value;
    var locale     = navigator.language || navigator.userLanguage;
    user.locale = locale.replace('-', '_');

    signupAction(user).then(function () {
      this.refs.firstname.getDOMNode().value = '';
      this.refs.lastname.getDOMNode().value = '';
      this.refs.email.getDOMNode().value = '';
      this.refs.password.getDOMNode().value = '';
      this.refs.password2.getDOMNode().value = '';
      this.refs.phone.getDOMNode().value = '';
      this.refs.companyName.getDOMNode().value = '';
    }.bind(this)).catch(function (message) {
      var error = [];
      if ('undefined' !== typeof message.firstname) {
        error.push(this._listErrors(message.firstname, 'First name errors'));
      }
      if ('undefined' !== typeof message.lastname) {
        error.push(this._listErrors(message.lastname, 'Last name errors'));
      }
      if ('undefined' !== typeof message.email) {
        error.push(this._listErrors(message.email, 'Email errors'));
      }
      if ('undefined' !== typeof message.password) {
        error.push(this._listErrors(message.password, 'Password errors'));
      }
      if ('undefined' !== typeof message.locale) {
        error.push(this._listErrors(message.locale, 'Locale errors'));
      }
      if ('undefined' !== typeof message.phone) {
        error.push(this._listErrors(message.phone, 'Phone errors'));
      }
      if ('undefined' !== typeof message.companyName) {
        error.push(this._listErrors(message.companyName, 'Company name errors'));
      }
      var errorList = <ul>{error}</ul>;
      this.setState({
        message:      errorList,
        messageClass: 'alert alert-danger',
      });
    }.bind(this));
  },

  _listErrors: function (error, lable) {
    var err = [];
    _.map(error, function (errMsg) {
      err.push(<li>{errMsg}</li>);
    });
    return <li><strong>{lable}</strong><br />
      <ul>{err}</ul>
    </li>;
  },

  render: function () {
    return (
      <section className="login-div">
        <div className="login-box">
          <div className="top-div">
            <p className="login-p">Have an account?</p>
            <a className="action-button nubity-blue" onClick={this._redirectLogin}>Log in</a>
          </div>
          <div className="row">
            <div className="col-xs-12">
              <div className="login-logo"></div>
              <p className="login-title">Create an Account.</p>
            </div>
          </div>
          <div className={this.state.messageClass + ' signup-error-show'}>{this.state.message}</div>
          <form className="login-form" onSubmit={this._onSubmit}>
            <button className="action-button nubity-red hidden">Sign in with Google</button>
            <p className="hidden">or</p>
            <div className="form-group col-xs-6">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </div>
                <input
                  type="text"
                  className="form-control no-shadow"
                  id="firstname"
                  ref="firstname"
                  placeholder="First name"
                  required />
              </div>
            </div>
            <div className="form-group col-xs-6">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </div>
                <input
                  type="text"
                  className="form-control no-shadow"
                  id="lastname"
                  ref="lastname"
                  placeholder="Last name"
                  required />
              </div>
            </div>
            <div className="form-group col-xs-12">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </div>
                <input
                  type="email"
                  className="form-control no-shadow"
                  id="email"
                  ref="email"
                  placeholder="Email"
                  required />
              </div>
            </div>
            <div className="form-group col-xs-12">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="fa fa-key" aria-hidden="true"></i>
                </div>
                <input
                  type="password"
                  className="form-control no-shadow"
                  id="password"
                  ref="password"
                  placeholder="Password"
                  required />
              </div>
            </div>
            <div className="form-group col-xs-12">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="fa fa-key" aria-hidden="true"></i>
                </div>
                <input
                  type="password"
                  className="form-control no-shadow"
                  id="password2"
                  ref="password2"
                  placeholder="Repeat password"
                  required />
              </div>
            </div>
            <div className="form-group col-xs-12">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="fa fa-phone" aria-hidden="true"></i>
                </div>
                <input
                  type="tel"
                  className="form-control no-shadow"
                  id="phone"
                  ref="phone"
                  placeholder="Phone"
                  title="Only valid phone numbers" />
              </div>
            </div>
            <div className="form-group col-xs-12">
              <div className="input-group">
                <div className="input-group-addon">
                  <i className="fa fa-briefcase" aria-hidden="true"></i>
                </div>
                <input
                  type="text"
                  className="form-control no-shadow"
                  id="companyName"
                  ref="companyName"
                  placeholder="Company name" />
              </div>
            </div>
            <button type="submit" className="action-button nubity-blue">Sign up</button>
          </form>
          <div className="login-footer">
            <div className="col-xs-6">
              <a className="link-login" onClick={this._redirectTerms}>Terms and conditions</a>
            </div>
            <div className="col-xs-6">
              <a className="link-login" onClick={this._redirectPolicy}>Privacy policies</a>
            </div>
          </div>
        </div>
      </section>
    );
  },
});
