var React                 = require('react');
var redirect              = require('../actions/RouteActions').redirect;

class Footer extends React.Component {
  constructor(props) {
    super(props);
  }

  _redirectTerms() {
    redirect('terms-and-conditions');
  }

  _redirectPolicy() {
    redirect('privacy-policies');
  }

  render() {
    return (
      <footer className="footer">
        <div className="footer-text">
          © 2017 Nubity. All Rights Reserved.
          <a onClick={this._redirectTerms}> Terms and conditions</a> |
          <a onClick={this._redirectPolicy}>Privacy policies</a>
        </div>
      </footer>
    );
  }
}

module.exports = Footer;
