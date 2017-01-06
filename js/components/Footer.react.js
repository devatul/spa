var React                 = require('react');
var Router                = require('../router');
var redirect              = require('../actions/RouteActions').redirect;
var SessionStore          = require('../stores/SessionStore');

var Footer = React.createClass({

  render: function () {
    return (
      <footer className="footer">
        <div className="footer-text">
          © 2015 Nubity. All Rights Reserved.
        </div>
      </footer>
    );
  },
});

module.exports = Footer;
