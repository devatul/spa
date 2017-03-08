var React                      = require('react');
var SessionStore               = require('../stores/SessionStore');
var ChangePasswordAction       = require('../actions/RequestActions').changePassword;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      pass: '',
    };
  },

  componentDidMount: function () {
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
  },

  _onSubmit: function (e) {
    e.preventDefault();
    var password     = this.refs.password.getDOMNode().value;
    var confirmation = this.refs.password2.getDOMNode().value;
    var url          = window.location.href;
    var start        = url.indexOf('reset-password/') + 15;
    var token        = url.slice(parseInt(start));

    if (password != confirmation) {
      this.setState({
        codeClass: 'alert alert-danger',
        textError: 'Passwords doesn\'t match',
      });
    } else {
      ChangePasswordAction(token, password, confirmation);
    }
  },

  render: function () {
    return (
      <section className="login-div">
        <div className="col-lg-4 col-lg-offset-4 login-box">
          <div className="top-div">
            <p className="login-p">Dont have an account yet?</p>
            <button className="go-to-signup">Start Now!</button>
          </div>
          <div className="login-logo"></div>
          <div className="row left-align">
          </div>
          <div className={this.state.codeClass}>{this.state.textError}</div>
          <p className="login-title">Your cloud, managed</p>
          <p className="login-subtitle">Sign in to check all your Clouds, Servers, Devices and Apps.</p>
          <form className="login-form col-xs-10 col-xs-offset-1" onSubmit={this._onSubmit}>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-key" aria-hidden="true"></i>
                </div>
                <input type="password" className="form-control no-shadow" id="password" placeholder="Password" ref="password"  name="password" required/>
              </div>
            </div>
            <div className="form-group row">
              <div className="input-group col-xs-10 col-xs-offset-1">
                <div className="input-group-addon">
                  <i className="fa fa-key" aria-hidden="true"></i>
                </div>
                <input type="password" className="form-control no-shadow" id="confirmation" placeholder="Confirm Password" ref="password2"  name="password2" required/>
              </div>
            </div>
            <button className="col-xs-12 login-button" type="submit" onClick={this._onSubmit}>Change Password</button>
          </form>
        </div>
      </section>
    );
  },
});
