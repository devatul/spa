var React                      = require('react');
var Moment                     = require('moment');
var Switch                     = require('rc-switch');
var Carousel                   = require('react-bootstrap').Carousel;
var CarouselItem               = require('react-bootstrap').CarouselItem;
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      disabled: false,
    };
  },

  render: function () {
    var rows = [];
    var triggers = this.props.template.triggers;
    var priority = '';
    var severityTooltip = '';
    for (var key in triggers) {
      if ('critical' == triggers[key].priority) {
        priority = 'icon nb-critical icon-state red-text';
        severityTooltip = (<Tooltip id="tooltip">Critical</Tooltip>);
      } else if ('warning' == triggers[key].priority) {
        priority = 'icon nb-warning icon-state yellow-text';
        severityTooltip = (<Tooltip id="tooltip">Warning</Tooltip>);
      } else if ('info' == triggers[key].priority) {
        priority = 'icon nb-information icon-state blue-text';
        severityTooltip = (<Tooltip id="tooltip">Information</Tooltip>);
      }
      rows.push(
        <tr key={key}>
          <td>{triggers[key].name}</td>
          <td>{0 < triggers[key].items.length ? Moment(triggers[key].items[0].last_check).format('DD/MM/YYYY hh:mm:ss') : '-'}</td>
          <td>{0 < triggers[key].items.length ? triggers[key].items[0].last_value : '-'}</td>
          <td>{0 < triggers[key].items.length ? triggers[key].items[0].prev_value : '-'}</td>
          <td>
            <Switch/>
          </td>
          <td>{triggers[key].condition}</td>
          <td>{triggers[key].threshold}</td>
          <td>
            <OverlayTrigger placement="top" overlay={severityTooltip}>
              <i className={priority} aria-hidden="true"></i>
            </OverlayTrigger>
          </td>
        </tr>
      );
    }

    return (
      <div>
        <table>
          <thead>
            <tr>
              <th colSpan="4">Items description</th>
              <th colSpan="4">Triggers</th>
            </tr>
            <tr>
              <th>Name</th>
              <th>Last Check</th>
              <th>Last Value</th>
              <th>Prev. Value</th>
              <th>State</th>
              <th>Condition</th>
              <th>Treshold</th>
              <th>Priority</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  },
});