var React        = require('react');
var RouteHandler = require('react-router').RouteHandler;
var NavBar       = require('./NavBar.react');
var SideBar      = require('./SideBar.react');
var Footer       = require('./Footer.react');
var Auth         = require('j-toker');

var NubityApp  = React.createClass({
  getInitialState: function () {
    return {
      user: Auth.user,
    };
  },

  render: function () {
    return (
      <div className="nubity-app">
        <NavBar/>
        <SideBar/>
        <RouteHandler/>
        <Footer/>
      </div>
    );
  },
});

module.exports   = NubityApp;
