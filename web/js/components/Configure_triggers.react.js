var React                      = require('react');
var Moment                     = require('moment');
var Switch                     = require('rc-switch');
var Tooltip                    = require('react-bootstrap').Tooltip;
var OverlayTrigger             = require('react-bootstrap').OverlayTrigger;
var modifyingTrigger           = require('../actions/RequestActions').modifyingTrigger;

class ConfigureTrigger extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false,
      triggers: this.props.template.triggers,
    };
    this.switchTrigger = this.switchTrigger.bind(this);
  }

  switchTrigger(trigger) {
    if (trigger.is_enabled) {
      modifyingTrigger(this.props.idInstance, trigger.trigger, false);
    } else {
      modifyingTrigger(this.props.idInstance, trigger.trigger, true);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      triggers: nextProps,
    });

  }

  render() {
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
        <tr key={key} className="content">
          <td>{triggers[key].name}</td>
          <td>{0 < triggers[key].items.length ? Moment(triggers[key].items[0].last_check).format('DD/MM/YYYY hh:mm:ss') : '-'}</td>
          <td>{0 < triggers[key].items.length ? triggers[key].items[0].last_value : '-'}</td>
          <td>{0 < triggers[key].items.length ? triggers[key].items[0].prev_value : '-'}</td>
          <td>
            <Switch checked={triggers[key].is_enabled ? true : false} onChange={this.switchTrigger.bind(this, triggers[key])} />
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
        <table className="triggers-table">
          <thead>
            <tr>
              <th colSpan="4">Items description</th>
              <th colSpan="4">Triggers</th>
            </tr>
            <tr>
              <th className="fix">Name</th>
              <th className="fix">Last Check</th>
              <th className="fix">Last Value</th>
              <th className="fix">Prev. Value</th>
              <th className="fix">State</th>
              <th className="fix">Condition</th>
              <th className="fix">Threshold</th>
              <th className="fix">Priority</th>
            </tr>
          </thead>
          <tbody>
            {rows}
          </tbody>
        </table>
      </div>
    );
  }
}

module.exports = ConfigureTrigger;
