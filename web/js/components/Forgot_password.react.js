var React                      = require('react');
var redirect                   = require('../actions/RouteActions').redirect;
var ForgotPasswordAction       = require('../actions/RequestActions').forgotPassword;
var Preloader                  = require('./Preloader.react');

class ForgotPassword extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message:      '',
      messageClass: 'hidden',
      submit:       (<button className="action-button nubity-blue" type="submit">Reset password</button>),
    };
    this._onSubmit = this._onSubmit.bind(this);
    this.closeAlert = this.closeAlert.bind(this);
  }

  _onSubmit(e) {
    e.preventDefault();
    var email = this.refs.email.value;
    if ('' !== email) {
      this.setState({
        submit: (<div className="login-load"><Preloader size="medium" /></div>),
      });
      ForgotPasswordAction(email).then(function (res) {
        this.setState({
          message:      res,
          messageClass: 'alert alert-success alert-margin',
          submit:       (<button className="action-button nubity-blue" type="submit">Reset password</button>),
        });
      }.bind(this)).catch(function (res) {
        this.setState({
          message:      res.message,
          messageClass: 'alert alert-danger alert-margin',
          submit:       (<button className="action-button nubity-blue" type="submit">Reset password</button>),
        });
      }.bind(this));
    } else {
      this.setState({
        message:      'Please enter email',
        messageClass: 'alert alert-danger alert-margin',
        submit:       (<button className="action-button nubity-blue" type="submit">Reset password</button>),
      });
    }
  }

  closeAlert(argument) {
    this.setState({
      message:      '',
      messageClass: 'hidden',
    });
  }

  _redirectLogin() {
    redirect('login');
  }

  _redirectTerms() {
    redirect('terms-and-conditions');
  }

  _redirectPolicy() {
    redirect('privacy-policies');
  }

  render() {
    return (
      <section className="login-div">
        <div className="login-box">
          <div className="top-div">
            <a className="action-button nubity-blue" onClick={this._redirectLogin}>Go to login</a>
          </div>
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1">
              <div className="login-logo"></div>
            </div>
          </div>
          <div className="row">
            <div className={this.state.messageClass} role="alert">
              <button type="button" className="no-margin close" onClick={this.closeAlert} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <p>{this.state.message}</p>
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
            <div onChange={this._onChange}>{this.state.submit}</div>
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

module.exports = ForgotPassword;
