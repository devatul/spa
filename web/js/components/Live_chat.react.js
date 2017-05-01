var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var saveURI                    = require('../actions/RequestActions').saveURI;
var SessionStore               = require('../stores/SessionStore');
var NinjaDefaultContent        = require('./Ninja_default_content.react');

class LiveChat extends React.Component {
  constructor(props) {
    super(props);
    this.updateURL = this.updateURL.bind(this);
  }

  _createTicket() {
    redirect('create-ticket');
  }

  componentWillMount() {
    if (!SessionStore.isLoggedIn()) {
      saveURI();
      redirect('login');
    }
  }

  render() {
    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <h2 className="align-center">Start Live Chat</h2>
        </div>
        <div className="centered">
          <a onClick={this._createTicket}>
            <button className="large-green-button">Create Ticket</button>
          </a>
        </div>
        <div className="margin-sides min-height-subsection">
          <div className="col-xs-3 centered">
            <select className="form-control">
              <option>Select Status</option>
            </select>
          </div>
          <div className="col-xs-3 centered">
            <select className="form-control">
              <option>Select Department</option>
            </select>
          </div>
          <div className="col-xs-3 centered">
            <select className="form-control">
              <option>Select Priority</option>
            </select>
          </div>
          <div className="col-xs-3 centered">
            <select className="form-control">
              <option>Select Server</option>
            </select>
          </div>
          <div className="col-xs-12 margin-tops">
            <div className="col-xs-1">
              <img src="https://upload.wikimedia.org/wikipedia/en/7/70/Shawn_Tok_Profile.jpg" height="65" alt="..." className="img-circle" />
            </div>
            <div className="col-xs-8">
              <p>Federico Palladoro (@fede)</p>
              <p>
                <span className="margin-sides">Available</span>
                <span className="margin-sides">
                  <time dateTime="">YYYY/MM/DD - 00:00:00 am</time>
                </span>
                <span className="margin-sides">Support</span>
                <span className="margin-sides">fede@nubity.com</span>
              </p>
            </div>
            <div className="col-xs-3">
              <i className="fa fa-phone-square phone-button" aria-hidden="true"></i>
              <i className="fa fa-file-text-o file-button" aria-hidden="true"></i>
              <i className="fa fa-link chain-button" aria-hidden="true"></i>
            </div>
          </div>
          <div className="col-xs-12 chat-div">
            <div className="content-chat"></div>
            <div className="message-chat">
              <i className="fa fa-paperclip" aria-hidden="true"></i>
              <span> Message</span>
              <i className="fa fa-smile-o pull-right black-smile" aria-hidden="true"></i>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = LiveChat;
