var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');
var NinjaDefaultContent        = require('./Ninja_default_content.react');
var getCompanyInfo             = require('../actions/RequestActions').getCompanyInfo;

class NinjaSupportSection extends React.Component {
  constructor(props) {
    super(props);
    var companyInfo = SessionStore.getCompanyInfo();
    this.state = {
      companyName: companyInfo.name,
    };
    this._onChange = this._onChange.bind(this);
  }

  componentWillMount() {
    if (!SessionStore.isLoggedIn()) {
      redirect('login');
    }
  }

  componentDidMount() {
    if (SessionStore.isLoggedIn()) {
      getCompanyInfo();
    } else {
      redirect('login');
    }
    SessionStore.addChangeListener(this._onChange);
    $('#intercom-container').removeClass('hidden');
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
    $('#intercom-container').addClass('hidden');
  }

  _onChange() {
    var companyInfo = SessionStore.getCompanyInfo();
    this.setState({
      companyName: companyInfo.name,
    });
  }

  _createTicket() {
    redirect('create-ticket');
  }

  _liveChat() {
    redirect('live-chat');
  }

  render() {
    var user     = localStorage.getItem('nubity-user');
    var jsonUser = JSON.parse(user);

    var name  = jsonUser.firstname + ' ' + jsonUser.lastname;
    var email = localStorage.getItem('nubity-user-email');

    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
    }

    window.Intercom('boot', {
      app_id:         'xs6j43ab',
      name:           name,
      email:          email,
      created_at:     Math.ceil(Date.now() / 1000),
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
          <NinjaDefaultContent />
        </div>
      </div>
    );
  }
}

module.exports = NinjaSupportSection;
