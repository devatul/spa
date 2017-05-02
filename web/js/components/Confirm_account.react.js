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
    this.switchTrigger = this.switchTrigger.bind(this);
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

    if (null == this.state.message.key) {
      icon = (<Preloader />);
    }

    if (400 <= this.state.code) {
      icon = (<i className="icon nb-close-circle x-large red-text" aria-hidden="true"></i>);
      legend = 'There was an error on your account verification';
    } else if ('' != this.state.code) {
      icon = (<i className="icon nb-thick-circle x-large green-text" aria-hidden="true"></i>);
      legend = 'Your account has been successfully verified';
    }
    return (
      <section className="login-div">
        <div className="col-lg-4 col-lg-offset-4 login-box">
          <div className="verification-logo">
            <img src="./images/logo-nubity_380.png" />
          </div>
          <div className="verification-legend">
            {legend}
          </div>
          <div className="verification-icon">
            {icon}
          </div>
          <div>
            <div className="col-sm-12 light-grey-background">
              <div className="pull-left">
                <i className="input-icon icon nb-information icon-state" aria-hidden="true"></i>
                {this.state.message}
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
