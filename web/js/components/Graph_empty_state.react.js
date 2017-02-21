var React      = require('react');

module.exports = React.createClass({

  render: function () {
    return (
      <div className="empty-table">
        <i className="icon nb-performance x-large grey-text"></i>
        <h3 className="grey-text">There is no data in this graph.</h3>
      </div>
    );
  },
});
