var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var ForgotPasswordAction       = require('../actions/RequestActions').forgotPassword;

module.exports = React.createClass({

  getInitialState: function () {
    return {
      message:      '',
      messageClass: 'hidden',
    };
  },

  _onSubmit: function (e) {
    e.preventDefault();
    var email = this.refs.email.getDOMNode().value;
    if ('' !== email) {
      ForgotPasswordAction(email).then(function (res) {
        this.setState({
          message:      res,
          messageClass: 'alert alert-success alert-margin',
        });
      }.bind(this)).catch(function (res) {
        this.setState({
          message:      res.message,
          messageClass: 'alert alert-danger alert-margin',
        });
      }.bind(this));
    } else {
      this.setState({
        message:      'Please enter email',
        messageClass: 'alert alert-danger alert-margin',
      });
    }
  },

  closeAlert: function (argument) {
    this.setState({
      message:      '',
      messageClass: 'hidden',
    });
  },

  _redirectLogin: function () {
    redirect('login');
  },

  render: function () {
    return (
      <section className="login-div">
        <div className="col-lg-4 col-lg-offset-4 login-box">
          <div className="top-div">
            <button className="go-to-signup" onClick={this._redirectLogin}>Go to login</button>
          </div>
          <div className="login-logo"></div>
          <p className="login-title">Your cloud, managed</p>
          <p className="login-subtitle">Sign in to check all your Clouds, Servers, Devices and Apps.</p>
          <form className="login-form col-xs-10 col-xs-offset-1" onSubmit={this._onSubmit}>
            <div className="row">
              <div className={this.state.messageClass} role="alert">
                <button type="button" className="close" onClick={this.closeAlert} aria-label="Close"><span aria-hidden="true">&times;</span></button>
                {this.state.message}
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-envelope" aria-hidden="true"></i>
                </div>
                <input type="email" className="form-control no-shadow" id="email" placeholder="Email" ref="email" name="email" required />
              </div>
            </div>
            <button className="col-xs-12 login-button" type="submit" onClick={this._onSubmit}>Reset Password</button>
          </form>
        </div>
      </section>
    );
  },
});
