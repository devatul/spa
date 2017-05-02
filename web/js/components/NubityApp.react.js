var React                 = require('react');
var NavBar                = require('./NavBar.react');
var SideBar               = require('./SideBar.react');
var Footer                = require('./Footer.react');
var Auth                  = require('j-toker');
var SessionStore          = require('../stores/SessionStore');

class NubityApp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user:       Auth.user,
      isLoggedIn: SessionStore.isLoggedIn(),
    };
    this._onChange = this._onChange.bind(this);
  }

  componentDidMount() {
    SessionStore.addChangeListener(this._onChange);
  }

  componentWillUnmount() {
    SessionStore.removeChangeListener(this._onChange);
  }

  _onChange() {
    this.setState({
      isLoggedIn: SessionStore.isLoggedIn(),
    });
  }

  render() {
    var loggedIn = this.state.isLoggedIn;
    var dashboard;
    if (true == loggedIn) {
      dashboard =
        <span>
          <NavBar {...this.props} />
          <SideBar {...this.props} />
          {this.props.children}
          <Footer {...this.props} />
        </span>
      ;
    } else {
      dashboard =
        <span>
          {this.props.children}
        </span>
      ;
    }
    return (
      <div className="nubity-app">
        {dashboard}
      </div>
    );
  }
}

module.exports = NubityApp;
