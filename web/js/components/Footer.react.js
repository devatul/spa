var React                 = require('react');
var Router                = require('../router');
var redirect              = require('../actions/RouteActions').redirect;
var SessionStore          = require('../stores/SessionStore');

var Footer = React.createClass({

  _redirectTerms: function () {
    redirect('terms_and_conditions');
  },

  _redirectPolicy: function () {
    redirect('privacy_policies');
  },

  render: function () {
    return (
      <footer className="footer">
        <div className="footer-text">
          © 2015 Nubity. All Rights Reserved. 
          <a onClick={this._redirectTerms}> Terms and conditions</a> | 
          <a onClick={this._redirectPolicy}>Privacy policies</a>
        </div>
      </footer>
    );
  },
});

module.exports = Footer;
