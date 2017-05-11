var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var saveURI                    = require('../actions/RequestActions').saveURI;
var SessionStore               = require('../stores/SessionStore');
var AlertsStore                = require('../stores/AlertsStore');
var NinjaDefaultContent        = require('./Ninja_default_content.react');
var search                     = require('../actions/RequestActions').search;
var CreateTicketAction         = require('../actions/RequestActions').createTicket;
var Dropzone                   = require('react-dropzone');

class CreateTicket extends React.Component {
  constructor(props) {
    super(props);
    var search = SessionStore.search();
    this.state = {
      search:    search,
      instances: search.instances,
      clouds:    search.clouds,
      files:     [],
      dropzone:  'hidden',
    };
    this._onChange = this._onChange.bind(this);
    this.onDrop = this.onDrop.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
    this._createPreview = this._createPreview.bind(this);
    this.showDropZone = this.showDropZone.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    if (SessionStore.isLoggedIn()) {
      search();
    } else {
      redirect('login');
    }
    SessionStore.addChangeListener(this._onChange);
  }

  componentWillMount() {
    if (!SessionStore.isLoggedIn()) {
      saveURI();
      redirect('login');
    }
  }

  componentWillUnmount() {
    AlertsStore.resetAlertTicket();
    SessionStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    var search = SessionStore.search();
    var serverCheck = '';
    if (search.instances && AlertsStore.isAlertTicket()) {
      var alert = AlertsStore.getAlertTicket();
      for (var key in search.instances) {
        if (search.instances[key].instance == alert.instance.id) {
          serverCheck = search.instances[key].hostname;
          break;
        }
      }
    }
    this.setState({
      search:      search,
      instances:   search.instances,
      clouds:      search.clouds,
      serverCheck: serverCheck,
    });
  }

  _onSubmit(e) {
    e.preventDefault();
    var ticket = {};
    ticket.department = this.refs.department.value;
    ticket.priority = this.refs.priority.value;
    ticket.type = this.refs.type.value;
    ticket.subject = this.refs.subject.value;
    ticket.content = this.refs.content.value;
    ticket.hostname = this.refs.hostname.value;
    ticket.files = this.state.files;
    CreateTicketAction(ticket);
  }

  _createTicket() {
    redirect('support/create-ticket');
  }

  _liveChat() {
    redirect('live-chat');
  }

  onDrop(acceptedFiles, rejectedFiles) {
    this.setState({
      files: acceptedFiles,
    });
  }

  _createPreview(file) {
    var newFile, reader = new FileReader();

    reader.onloadend = function (e) {
      newFile = {file: file, imageUrl: e.target.result};
      var files = this.state.files;
      files.push(newFile);
      this.setState({
        files: files,
      });

    };
    reader.readAsDataURL(file);
  }
  showDropZone(e) {
    e.preventDefault();
    this.setState({
      dropzone: 'dropzone',
    });
  }
  render() {
    var search = this.state.search;
    var instances = this.state.instances;
    var servers = [];
    var department = [];
    var type = [];
    var subject = '';
    var serverCheck = this.state.serverCheck;
    var priorityCheck = '';

    if (AlertsStore.isAlertTicket()) {
      var alert = AlertsStore.getAlertTicket();
      department = [
        <select key="department" className="form-control" ref="department" defaultValue="support" onChange={this._onChange}>
          <option value="support">Support</option>
          <option value="billing">Billing</option>
          <option value="sales">Sales</option>
        </select>,
      ];
      type = [
        <select key="type" className="form-control" ref="type" defaultValue="incident">
          <option value="" disabled ref="type">Select Type</option>
          <option value="incident">Incident</option>
          <option value="service-request">Service Request</option>
        </select>,
      ];


      switch (alert.level) {
        case 'critical':
          priorityCheck = 'high';
          break;
        case 'warning':
          priorityCheck = 'medium';
          break;
        case 'info':
          priorityCheck = 'low';
          break;
      }

      subject = alert.description;
      if (instances) {
        for (var key in instances) {
          if (instances[key].instance == alert.instance.id) {
            serverCheck = search.instances[key].hostname;
            break;
          }
        }
      }
    } else {
      department = [
        <select key="department1" className="form-control" ref="department" onChange={this._onChange}>
          <option value="support">Support</option>
          <option value="billing">Billing</option>
          <option value="sales">Sales</option>
        </select>,
      ];

      type = [
        <select key="type1" className="form-control" ref="type" defaultValue="">
          <option value="" disabled ref="type">Select Type</option>
          <option value="incident">Incident</option>
          <option value="service-request">Service Request</option>
        </select>,
      ];
    }

    servers.push(<option key="server_0" value="" disabled>Select Server</option>);
    for (key in instances) {
      servers.push(<option key={instances[key].hostname} value={instances[key].hostname}>{instances[key].hostname}</option>);
    }

    var priority = [
      <select key="priority" className="form-control" ref="priority" defaultValue={priorityCheck}>
        <option value="" disabled>Select Priority</option>
        <option value="low">Low</option>
        <option value="medium">Medium</option>
        <option value="high">High</option>
      </select>,
    ];

    if (!SessionStore.isLoggedIn()) {
      return (<div></div>);
    }
    var filesPreview = (<p>Try dropping some files here, or click to select files to upload.</p>);
    var preview = [];
    if (0 < this.state.files.length) {
      for (var cont in this.state.files) {
        preview.push(<div className="col-xs-2"><object className="pdfPreview" data={this.state.files[cont].preview}></object><p>{this.state.files[cont].name}</p></div>);
      }
      filesPreview = (
        <div>
          <p>Uploading {this.state.files.length} files...</p>
          <div>{preview}</div>
        </div>
      );
    }

    return (
      <div className="principal-section">
        <div className="section-title">
          <span className="item title">Create your ticket</span>
        </div>
        <div className="centered hidden">
          <a onClick={this._liveChat}>
            <button className="large-green-button">Start Live Chat</button>
          </a>
        </div>
        <div className="margin-sides min-height-subsection">
          <div className="col-xs-3 centered">
            {type}
          </div>
          <div className="col-xs-3 centered">
            {department}
          </div>
          <div className="col-xs-3 centered">
            {priority}
          </div>
          <div className="col-xs-3 centered">
            <select className="form-control" key="hostname" ref="hostname" value={serverCheck}>
              {servers}
            </select>
          </div>
          <div className="col-xs-6 margin-tops">
            <input type="text" className="form-control" id="inputPassword" placeholder="Subject" ref="subject" defaultValue={subject} />
          </div>
          <div className="col-xs-12">
            <form onSubmit={this._onSubmit}>
              <textarea className="form-control" rows="8" placeholder="Message" ref="content" required></textarea>
              <div>
                <Dropzone onDrop={this.onDrop} className={this.state.dropzone}>
                  {filesPreview}
                </Dropzone>
              </div>
              <button type="submit" className="margin-tops blue-button">Send</button>
              <button className="attachmentFile" onClick={this.showDropZone}><i className="fa fa-paperclip" aria-hidden="true"></i></button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

module.exports = CreateTicket;
