var React                 = require('react');

var Preloader = React.createClass({

  render: function () {
    var preloaderClass = '';
    if (this.props.preloaderClass) {
      preloaderClass = this.props.preloaderClass + ' ';
    }
    if ('mini' == this.props.size) {
      preloaderClass += 'loader-mini';
    } else if ('medium' == this.props.size) {
      preloaderClass += 'loader-medium';
    } else {
      preloaderClass += 'loader';
    }
    return (
      <div className={preloaderClass}>Loading...</div>
    );
  },
});

module.exports = Preloader;
