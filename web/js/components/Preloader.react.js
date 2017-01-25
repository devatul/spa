var React                 = require('react');

var Preloader = React.createClass({

  render: function () {
    var preloaderClass = '';
    if ('mini' == this.props.size) {
      preloaderClass = 'loader-mini';
    } else {
      preloaderClass = 'loader';
    }
    return (
      <div className={preloaderClass}>Loading...</div>
    );
  },
});

module.exports = Preloader;
