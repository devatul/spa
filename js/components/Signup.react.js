var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var NinjaDefaultContent        = require('./Ninja_default_content.react');

module.exports = React.createClass({

  _createTicket: function() {
    redirect('create_ticket');
  },

  _liveChat: function() {
    redirect('live_chat');
  },

  render: function() {
    return (
      <section className="login-div">
        <div className="col-lg-4 col-lg-offset-4 signup-box">
          <div className="top-div">
            <p className="login-p">Have an account?</p>
            <button className="go-to-signup">Log in</button>
          </div>
          <div className="login-logo"></div>
          <p className="login-title">Create an Account.</p>
          <p className="signup-subtitle">It's free and always will be.</p>
          <form className="login-form col-xs-10 col-xs-offset-1">
            <button className="col-xs-12 google-button">Sign in with Google</button>
            <p>or</p>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </div>
                <input type="email" className="form-control no-shadow" id="email" placeholder="Email"/>
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-key" aria-hidden="true"></i>
                </div>
                <input type="password" className="form-control no-shadow" id="password" placeholder="Password"/>
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-key" aria-hidden="true"></i>
                </div>
                <input type="password" className="form-control no-shadow" id="password2" placeholder="Repeat password"/>
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-phone" aria-hidden="true"></i>
                </div>
                <input type="password" className="form-control no-shadow" id="phone" placeholder="Phone"/>
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-briefcase" aria-hidden="true"></i>
                </div>
                <input type="password" className="form-control no-shadow" id="companyName" placeholder="Company name"/>
              </div>
            </div>
            <button className="col-xs-12 login-button">Log in</button>
          </form>
        </div>
      </section>
    );
  }
});
