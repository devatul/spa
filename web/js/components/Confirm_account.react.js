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
    };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    var url          = window.location.href;
    var start        = parseInt(url.indexOf('confirm-account/')) + parseInt(16);
    var token        = url.slice(parseInt(start));
    ConfirmAccountAction(token);
    SessionStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    var messageClass = 'hidden';
    if ('' != SessionStore.getConfirmMessage() && '' != SessionStore.getConfirmCode()) {
      if (SessionStore.getConfirmMessage() && 400 > SessionStore.getConfirmCode()) {
        messageClass = 'alert alert-success alert-margin';
      } else if (SessionStore.getConfirmMessage() && 400 <= SessionStore.getConfirmCode()) {
        messageClass = 'alert alert-danger alert-margin';
      } else {
        messageClass = 'hidden';
      }
      this.setState({
        message:      SessionStore.getConfirmMessage(),
        code:         SessionStore.getConfirmCode(),
        icon:         '',
        messageClass: messageClass,
      });
    }
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

  _onSubmit(e) {
    e.preventDefault();
    var url          = window.location.href;
    var start        = parseInt(url.indexOf('confirm-account/')) + parseInt(16);
    var token        = url.slice(parseInt(start));
    ConfirmAccountAction(token);
  }

  render() {
    var icon = '';
    var legend = '';
    var message = '';

    if (null == this.state.message.key) {
      icon = (<Preloader />);
    }

    if (400 <= this.state.code) {
      icon = (<i className="icon nb-close-circle x-large red-text" aria-hidden="true"></i>);
      legend = 'There was an error on your account verification. ';
      message = 'This confirmation link is no longer valid. May be your account is already verified.';
    } else if ('' != this.state.code) {
      icon = (<i className="icon nb-thick-circle x-large green-text" aria-hidden="true"></i>);
      legend = 'Your account has been successfully verified. ';
    }

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
          <div className="verification-icon">
            {icon}
          </div>
          <div className="row">
            <div className={this.state.messageClass} role="alert">
              <button type="button" className="no-margin close" onClick={this.closeAlert} aria-label="Close"><span aria-hidden="true">&times;</span></button>
              <p><i className="input-icon icon nb-information icon-state" aria-hidden="true"></i>{legend}{message}</p>
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
