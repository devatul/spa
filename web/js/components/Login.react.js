var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var NinjaDefaultContent        = require('./Ninja_default_content.react');
var Preloader                  = require('./Preloader.react');
var loginAction                = require('../actions/RequestActions').login;
var getUserForSwitchUser       = require('../actions/RequestActions').getUserForSwitchUser;

module.exports = React.createClass({

  getInitialState: function () {
    return {
      loading:      false,
      messageClass: 'hidden',
    };
  },

  componentDidMount: function () {
    SessionStore.addChangeListener(this._onChange);

    var url          = window.location.href;
    var start        = parseInt(url.indexOf('?'));
    var end          = parseInt(url.indexOf('&return='));
    var token        = url.slice(parseInt(start) + parseInt(5), parseInt(end));
    var returnUrl    = url.slice(parseInt(end) + parseInt(8));
    if (0 <= start && token) {
      localStorage.clear();
      localStorage.setItem('nubity-token', token);
      localStorage.setItem('switching-user', true);
      localStorage.setItem('go-back-url', decodeURIComponent(returnUrl));
      getUserForSwitchUser();
    } else {
      if (SessionStore.isLoggedIn()) {
        redirect('dashboard');
      }
      localStorage.setItem('switching-user', false);
    }
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      this.setState({
        loading: false,
      });

      var message = SessionStore.getLoginError();
      if ('' != message) {
        this.setState({
          message:      message,
          loading:      false,
          messageClass: 'alert alert-danger alert-margin',
        });
      }
    }
  },

  closeAlert: function (argument) {
    this.setState({
      message:      '',
      messageClass: 'hidden',
    });
  },

  _onSubmit: function (e) {
    this.setState({
      loading: true,
    });
    e.preventDefault();
    var user      = {};
    user.email = this.refs.email.getDOMNode().value;
    user.password = this.refs.password.getDOMNode().value;

    loginAction(user);
  },

  _redirectForgotPassword: function () {
    redirect('forgot_password');
  },

  _redirectSignUp: function () {
    redirect('signup');
  },

  _redirectTerms: function () {
    redirect('terms_and_conditions');
  },

  _redirectPolicy: function () {
    redirect('privacy_policies');
  },

  render: function () {
    var login;

    if (true == this.state.loading) {
      login = (
        <div className="login-load">
          <Preloader size="medium" />
        </div>
      );
    } else {
      login = (<button className="action-button nubity-blue" type="submit" >Log in</button>);
    }

    return (
      <section className="login-div">
        <div className="login-box">
          <div className="top-div">
            <p className="login-p">Don&#39;t have an account yet?</p>
            <a className="action-button nubity-blue" onClick={this._redirectSignUp}>Start Now!</a>
          </div>
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1">
              <div className="login-logo"></div>
            </div>
          </div>
          <div className="row">
            <div className={this.state.messageClass} role="alert">
              <button type="button" className="close" onClick={this.closeAlert} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              {this.state.message}
            </div>
          </div>
          <form className="login-form" onSubmit={this._onSubmit}>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </div>
                <input type="email" className="form-control no-shadow" id="email" placeholder="Email" ref="email" name="email" required />
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-key" aria-hidden="true"></i>
                </div>
                <input type="password" className="form-control no-shadow" id="password" placeholder="Password" ref="password" name="password" required />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <div className="checkbox">
                  <label>
                    <input type="checkbox"> Remember me</input>
                  </label>
                </div>
              </div>
              <div className="col-xs-6">
                <a className="link-login" onClick={this._redirectForgotPassword}>Forgot password?</a>
              </div>
            </div>
            <div onChange={this._onChange}>{login}</div>
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
