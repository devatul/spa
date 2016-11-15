var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var NinjaDefaultContent        = require('./Ninja_default_content.react');
var loginAction                = require('../actions/RequestActions').login;

module.exports = React.createClass({

  componentDidMount: function() {
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function() {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function() {
    console.log("change");
  },

  _onSubmit: function(e) {
    e.preventDefault();
    var user      = {};
    user.email    = this.refs.email.getDOMNode().value;
    user.password = this.refs.password.getDOMNode().value;
    
    loginAction(user); 
  },

  render: function() {
    return (
      <section className="login-div">
        <div className="col-lg-4 col-lg-offset-4 login-box">
          <div className="top-div">
            <p className="login-p">Dont have an account yet?</p>
            <button className="go-to-signup">Start Now!</button>
          </div>
          <div className="login-logo"></div>
          <p className="login-title">One account.</p>
          <p className="login-title">All infrastructure.</p>
          <p className="login-subtitle">Sign in to check all your Clouds, Servers,Devices and Apps.</p>
          <form className="login-form col-xs-10 col-xs-offset-1" onSubmit={this._onSubmit}>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </div>
                <input type="email" className="form-control no-shadow" id="email" placeholder="Email" ref="email" name="email" required/>
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-key" aria-hidden="true"></i>
                </div>
                <input type="password" className="form-control no-shadow" id="password" placeholder="Password" ref="password"  name="password" required/>
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
                <a className="link-login">Forgot password?</a>
              </div>
            </div>
            <button className="col-xs-12 login-button" type="submit" onClick={this._onSubmit}>Log in</button>
          </form>
        </div>
      </section>
    );
  }
});
