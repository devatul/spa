var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var NinjaDefaultContent        = require('./Ninja_default_content.react');
var getCompanyInfo             = require('../actions/RequestActions').getCompanyInfo;

module.exports = React.createClass({
  getInitialState: function () {
    var companyInfo = SessionStore.getCompanyInfo();
    return {
      companyName: companyInfo.name,
    };
  },

  componentWillMount: function () {
    if (!SessionStore.isLoggedIn()) {
      redirect('login');
    }
  },
  componentDidMount: function () {
    if (SessionStore.isLoggedIn()) {
      getCompanyInfo();
    } else {
      redirect('login');
    }
    SessionStore.addChangeListener(this._onChange);
    $('#intercom-container').removeClass('hidden');
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
    $('#intercom-container').addClass('hidden');
  },

  _onChange: function () {
    if (this.isMounted()) {
      var companyInfo = SessionStore.getCompanyInfo();
      this.setState({
        companyName: companyInfo.name,
      });
    }
  },

  _createTicket: function () {
    redirect('create_ticket');
  },

  _liveChat: function () {
    redirect('live_chat');
  },

  render: function () {
    var name = localStorage.getItem('nubity-firstname') + ' ' + localStorage.getItem('nubity-lastname');
    var email = localStorage.getItem('nubity-user-email');

    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
    }

    window.Intercom('boot', {
      app_id: 'xs6j43ab',
      name: name,
      email: email,
      created_at: Math.ceil(Date.now() / 1000),
      'company_name': this.state.companyName,
    });

    return (
      <div className="principal-section">
        <div className="section-title">
          <span className="item title">Support</span>
        </div>
        <div className="centered">
          <a onClick={this._createTicket}>
            <button className="action-button nubity-blue">Create Ticket</button>
          </a>
          <a onClick={this._liveChat}>
            <button className="large-green-button hidden">Start Live Chat</button>
          </a>
        </div>
        <div className="margin-sides min-height-subsection">
          <NinjaDefaultContent/>
        </div>
      </div>
    );
  },
});
