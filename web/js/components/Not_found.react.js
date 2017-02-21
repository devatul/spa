var React                      = require('react');
var Router                     = require('../router');
var redirect                   = require('../actions/RouteActions').redirect;
var SessionStore               = require('../stores/SessionStore');

class NotFound extends React.Component {
  redirectHome() {
    redirect('home');
  }

  render() {
    return (
      <section className="valign-wrapper not-found">
        <div className="valign centered">
          <h3>PAGE NOT FOUND</h3>
          <p>We are sorry but the page you are looking for does not exist.</p>
          <a onClick={this.redirectHome}>Go to homepage</a>
        </div>
      </section>
    );
  }
}

module.exports = NotFound;