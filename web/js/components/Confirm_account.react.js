var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var ConfirmAccountAction       = require('../actions/RequestActions').confirmAccount;
var Preloader                  = require('./Preloader.react');

class ConfirmAccount extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message:      '',
      messageClass: 'hidden',
      code:         '',
      icon:         (<Preloader />),
    };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    var url          = window.location.href;
    var start        = parseInt(url.indexOf('confirm-account/')) + parseInt(16);
    var token        = url.slice(parseInt(start));
    SessionStore.addChangeListener(this._onChange);
    ConfirmAccountAction(token).then(function (res) {
      this.setState({
        message:      (<p><i className="input-icon icon nb-information icon-state" aria-hidden="true"></i>Congratulations! Your account has been successfully verified. Please <a className="action-button nubity-blue" onClick={this._redirectLogin}>Log in</a></p>),
        icon:         (<i className="icon nb-thick-circle x-large green-text" aria-hidden="true"></i>),
        messageClass: 'alert alert-success alert-margin',
      });
    }.bind(this)).catch(function (res) {
      this.setState({
        message:      (<p><i className="input-icon icon nb-information icon-state" aria-hidden="true"></i>There was an error on your account verification. This confirmation link is no longer valid. May be your account is already verified. Please try to <a className="action-button nubity-blue" onClick={this._redirectLogin}>Log in</a></p>),
        icon:         (<i className="icon nb-close-circle x-large red-text" aria-hidden="true"></i>),
        messageClass: 'alert alert-danger alert-margin',
      });
    }.bind(this));
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
  }

  _onChange() {

  }

  _redirectLogin() {
    redirect('login');
  }

  closeAlert(argument) {
    this.setState({
      message:      '',
      messageClass: 'hidden',
    });
  }

  render() {
    return (
      <section className="login-div">
        <div className="login-box">
          <div className="row">
            <div className="col-xs-10 col-xs-offset-1">
              <div className="login-logo"></div>
            </div>
          </div>
          <div className="verification-icon">
            {this.state.icon}
          </div>
          <div className="row">
            <div className={this.state.messageClass} role="alert">
              <button type="button" className="no-margin close" onClick={this.closeAlert} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              {this.state.message}
            </div>
          </div>

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

module.exports = ConfirmAccount;
