var React        = require('react');
var RouteHandler = require('react-router').RouteHandler;
var NavBar       = require('./NavBar.react');
var SideBar      = require('./SideBar.react');
var Footer       = require('./Footer.react');
var Auth         = require('j-toker');
var SessionStore = require('../stores/SessionStore');

var NubityApp  = React.createClass({
  getInitialState: function () {
    return {
      user:       Auth.user,
      isLoggedIn: SessionStore.isLoggedIn(),
    };
  },

  componentDidMount: function () {
    SessionStore.addChangeListener(this._onChange);
  },

  componentWillUnmount: function () {
    SessionStore.removeChangeListener(this._onChange);
  },

  _onChange: function () {
    if (this.isMounted()) {
      this.setState({
        isLoggedIn: SessionStore.isLoggedIn(),
      });
    }
  },

  render: function () {
    var loggedIn = this.state.isLoggedIn;
    var dashboard;
    if (true == loggedIn) {
      dashboard =
        <span>
          <NavBar />
          <SideBar />
          <RouteHandler />
          <Footer />
        </span>
      ;
    } else {
      dashboard =
        <span>
          <RouteHandler />
        </span>
      ;
    }
    return (
      <div className="nubity-app">
        {dashboard}
      </div>
    );
  },
});

module.exports = NubityApp;
