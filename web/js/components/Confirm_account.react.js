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
      message: '',
      code:    '',
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
    if ('' != SessionStore.getConfirmMessage() && '' != SessionStore.getConfirmCode()) {
      this.setState({
        message: SessionStore.getConfirmMessage(),
        code:    SessionStore.getConfirmCode(),
        icon:    '',
      });
    }
  }

  _redirectLogin() {
    redirect('login');
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
      legend = 'There was an error on your account verification';
      message = 'This confirmation link is no longer valid. May be your account is already verified.';
    } else if ('' != this.state.code) {
      icon = (<i className="icon nb-thick-circle x-large green-text" aria-hidden="true"></i>);
      legend = 'Your account has been successfully verified';
    }
    return (
      <section className="login-div valign-wrapper">
        <div className="col-lg-4 valign">
          <a className="verification-logo" onClick={this._redirectLogin}>
            <img src="./images/logo-nubity-w.png" />
          </a>
          <div className="verification-legend">
            {legend}
          </div>
          <div className="verification-icon">
            {icon}
          </div>
          <div>
            <div className={message ? 'col-sm-12 rounded' : 'hidden'}>
              <div>
                <i className="input-icon icon nb-information icon-state" aria-hidden="true"></i>
                {message}
              </div>
              <br />
              <div className="confirm-account-padding">
                <p className="login-p">Try to</p>
                <a className="action-button nubity-blue" onClick={this._redirectLogin}>Log in</a>
              </div>
            </div>
            <div className="min"></div>
          </div>
        </div>
      </section>
    );
  }
}

module.exports = ConfirmAccount;
