var React                      = require('react');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var signupAction               = require('../actions/RequestActions').signup;

module.exports = React.createClass({
  getInitialState: function () {

    return {
      message: '',
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
          message: message,
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

  _onSubmit: function (e) {
    e.preventDefault();
    var user       = {};
    user.firstname = this.refs.firstname.getDOMNode().value;
    user.lastname  = this.refs.lastname.getDOMNode().value;
    user.email     = this.refs.email.getDOMNode().value;
    user.password  = this.refs.password.getDOMNode().value;
    user.password2 = this.refs.password2.getDOMNode().value;
    user.phone     = this.refs.phone.getDOMNode().value;
    user.company   = this.refs.companyName.getDOMNode().value;
    user.locale    = navigator.language || navigator.userLanguage;
    signupAction(user);
  },

  render: function () {
    return (
      <section className="login-div">
        <div className="col-lg-4 col-lg-offset-4 signup-box">
          <div className="top-div">
            <p className="login-p">Have an account?</p>
            <button className="go-to-signup" onClick={this._redirectLogin}>Log in</button>
          </div>
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1">
              <div className="login-logo"></div>
              <p className="login-title">Create an Account.</p>
              <p className="signup-subtitle">It&#39;s free and always will be.</p>
            </div>
          </div>
          <div className={this.state.messageClass}>{this.state.message}</div>
          <form className="login-form col-xs-10 col-xs-offset-1" onSubmit={this._onSubmit}>
            <button className="col-xs-12 google-button">Sign in with Google</button>
            <p>or</p>
            <div className="form-group col-xs-5 col-xs-offset-1">
              <div className="input-group col-xs-12">
                <div className="input-group-addon">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </div>
                <input type="text" className="form-control no-shadow" id="firstname" ref="firstname" placeholder="First name"/>
              </div>
            </div>
            <div className="form-group col-xs-5">
              <div className="input-group col-xs-12">
                <div className="input-group-addon">
                  <i className="fa fa-user" aria-hidden="true"></i>
                </div>
                <input type="text" className="form-control no-shadow" id="lastname" ref="lastname" placeholder="Last name"/>
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </div>
                <input type="email" className="form-control no-shadow" id="email" ref="email" placeholder="Email"/>
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-key" aria-hidden="true"></i>
                </div>
                <input type="password" className="form-control no-shadow" id="password" ref="password" placeholder="Password"/>
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-key" aria-hidden="true"></i>
                </div>
                <input type="password" className="form-control no-shadow" id="password2" ref="password2" placeholder="Repeat password"/>
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-phone" aria-hidden="true"></i>
                </div>
                <input type="text" className="form-control no-shadow" id="phone" ref="phone" placeholder="Phone"/>
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-briefcase" aria-hidden="true"></i>
                </div>
                <input type="text" className="form-control no-shadow" id="companyName"  ref="companyName" placeholder="Company name"/>
              </div>
            </div>
            <button type="submit" className="col-xs-12 login-button">Sign up</button>
          </form>
        </div>
      </section>
    );
  },
});
