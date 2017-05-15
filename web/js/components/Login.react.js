var React                      = require('react');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var Preloader                  = require('./Preloader.react');
var loginAction                = require('../actions/RequestActions').login;
var getUserForSwitchUser       = require('../actions/RequestActions').getUserForSwitchUser;

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading:      false,
      messageClass: 'hidden',
    };
    this._onChange = this._onChange.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
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
        redirect('/');
      }
      localStorage.setItem('switching-user', false);
    }
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
  }

  _onChange() {
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

  closeAlert(argument) {
    this.setState({
      message:      '',
      messageClass: 'hidden',
    });
  }

  _onSubmit(e) {
    this.setState({
      loading: true,
    });
    e.preventDefault();
    var user      = {};
    user.email = this.refs.email.value;
    user.password = this.refs.password.value;
    loginAction(user);
  }

  _redirectForgotPassword() {
    redirect('forgot-password');
  }

  _redirectSignUp() {
    redirect('signup');
  }

  _redirectTerms() {
    redirect('terms-and-conditions');
  }

  _redirectPolicy() {
    redirect('privacy-policies');
  }

  render() {
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
                  <label htmlFor="remember_me">
                    <input name="remember_me" type="checkbox" />Remember me
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
  }
}

module.exports = Login;
