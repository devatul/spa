var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var ConfirmAccountAction       = require('../actions/RequestActions').confirmAccount;
var Preloader                  = require('./Preloader.react');

module.exports = React.createClass({
  getInitialState: function () {
    var preloader = (<Preloader/>);
    return{
      message: preloader,
      code: ''
    }
  },

  componentDidMount: function () {
    var url          = window.location.href;
    var start        = parseInt(url.indexOf('confirm-account/')) + parseInt(16);
    var token        = url.slice(parseInt(start));
    ConfirmAccountAction(token); 
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      if ('' != SessionStore.getConfirmMessage() && '' != SessionStore.getConfirmCode()) {
        this.setState({
          message: SessionStore.getConfirmMessage(),
          code: SessionStore.getConfirmCode(),
        });
      }
    }
  },

  _onSubmit: function (e) {
    e.preventDefault();
    var url          = window.location.href;
    var start        = parseInt(url.indexOf('confirm-account/')) + parseInt(16);
    var token        = url.slice(parseInt(start));
    ConfirmAccountAction(token);   
  },

  render: function () {
    var icon = '';
    if (400 <= this.state.code) {
      icon = (<i className="fa fa-times-circle" aria-hidden="true"></i>);
    } else if ('' != this.state.code) {
      icon = (<i className="fa fa-check-circle" aria-hidden="true"></i>);
    }
    return (
      <section className="login-div">
        <div className="col-lg-4 col-lg-offset-4 login-box">
          {this.state.message}
          <br/>
          {icon}
        </div>
      </section>
    );
  },
});
