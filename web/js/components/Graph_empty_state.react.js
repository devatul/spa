var React                      = require('react');

class GraphEmptyState extends React.Component {
  render() {
    return (
      <div className="empty-table valign">
        <i className="icon nb-performance x-large grey-text"></i>
        <h3 className="grey-text">There is no data in this graph.</h3>
      </div>
    );
  }
}


module.exports = GraphEmptyState;
