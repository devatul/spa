var React = require('react');
var Modal = require('react-bootstrap').Modal;
var Popover = require('react-bootstrap').Popover;
var Button = require('react-bootstrap').Button;
var Tooltip = require('react-bootstrap').Tooltip;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;

var Warning = React.createClass({
  getInitialState: function () {
    return { showModal: false };
  },

  close: function () {
    this.setState({ showModal: false });
  },

  open: function () {
    this.setState({ showModal: true });
  },

  render: function () {
    var notice;
    var warn;
    var buttonClass;
    var confirmButtons;
    var action;
    var actionType;
    switch (this.props.type) {
      case 'start':
        actionType = 'action-instance';
        if ('running' == this.props.status) {
          buttonClass = 'icon nb-start action-icon disabled';
          action = (<span className={buttonClass}></span>);
        } else if ('unavailable' == this.props.status) {
          buttonClass = 'icon nb-start action-icon disabled';
          action = (<span className={buttonClass}></span>);
        } else {
          warn = (
            <span><i className="icon nb-warning yellow-text large"></i> You're about to start an instance</span>
          );
          notice = 'The instance will start right after you click OK button';
          buttonClass = 'icon nb-start action-icon';
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-green" onClick={this.close}>Cancel</span>
              <span className="action-button nubity-blue" onClick={this.close}>OK</span>
            </div>
          );
          action = (<span className={buttonClass} onClick={this.open}></span>);
        }
        break;
      case 'stop':
        actionType = 'action-instance';
        if ('stopped' == this.props.status) {
          buttonClass = 'icon nb-stop action-icon disabled';
          action = (<span className={buttonClass}></span>);
        } else if ('unavailable' == this.props.status) {
          buttonClass = 'icon nb-stop action-icon disabled';
          action = (<span className={buttonClass}></span>);
        } else {
          warn = (
            <span><i className="icon nb-warning yellow-text large"></i> Are you sure?</span>
          );
          notice = 'If you stop this instance, it\'ll be unavailable until the next start';
          buttonClass = 'icon nb-stop action-icon';
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
              <span className="action-button nubity-red" onClick={this.close}>OK</span>
            </div>
          );
          action = (<span className={buttonClass} onClick={this.open}></span>);
        }
        break;
      case 'restart':
        actionType = 'action-instance';
        if ('unavailable' == this.props.status) {
          buttonClass = 'icon nb-restart action-icon disabled';
          action = (<span className={buttonClass}></span>);
        } else {
          warn = (
            <span><i className="icon nb-warning yellow-text large"></i> Are you sure to restart?</span>
          );
          notice = 'The instance will be unavailable for a few minutes';
          buttonClass = 'icon nb-restart action-icon';
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
              <span className="action-button nubity-red" onClick={this.close}>OK</span>
            </div>
          );
          action = (<span className={buttonClass} onClick={this.open}></span>);
        }
        break;
      case 'support':
        actionType = 'action-support';
        if ('pending-acceptation' == this.props.status) {
          action = (<span className='action-button nubity-grey no-button'>Pending start</span>);
        } else if ('' == this.props.status) {
          warn = (
            <span><i className="icon nb-ninja-support yellow-text large"></i> Start Ninja Support</span>
          );
          notice = (
            <span>
              You are activating management services for device {this.props.device}.<br/>
              The server takeover process may take from 4 to 6 hours depending on the server complexity.<br/>
              This action will create a charge in the user's account:<br/>
              Setup price: USD 35.00 (unique for each activation).<br/>
              Monthly price: USD 4.34 (billed per 31 days).<br/>
              Hourly price: USD 0.14<br/>
              By clicking the button "I Accept" you agree the <a>Nubity's Terms and Conditions & Privacy Policy</a>.
            </span>
          );
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-blue" onClick={this.close}>Close</span>
              <span className="action-button nubity-green" onClick={this.props.clickAction}>I Accept</span>
            </div>
          );
          action = (<span className='action-button nubity-green' onClick={this.open}>Start</span>);
        } else if ('accepted' == this.props.status) {
          warn = (
            <span><i className="icon nb-warning yellow-text large"></i> Are you sure?</span>
          );
          notice = (
            <span>
              Stopping the management services will be effective in billing as well as technical at the end of the 
              current billing cicle. In any moment during this period, you can dismiss the stop and the service will 
              continue normally.
            </span>
          );
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
              <span className="action-button nubity-red" onClick={this.close}>OK</span>
            </div>
          );
          action = (<span className='action-button nubity-red' onClick={this.open}>Stop</span>);
        } else if ('pending-cancellation' == this.props.status) {
          action = (<span className='action-button nubity-blue'>Dismiss stop</span>);
        } else {
          action = (<span className='action-button nubity-blue no-button'>Management</span>);
        }
        break;
      case 'mute':
        actionType = 'action-notification';
        if (this.props.status) {
          action = (
            <span>
              <span className='hidden-xs hidden-sm action-button-disabled'>Muted</span>
              <OverlayTrigger placement="top" overlay={this.props.hover}>
                <span className="hidden-md hidden-lg action-button-disabled" title="Notifications muted">
                  <i className="icon nb-mute-on grey-text small"></i>
                </span>
              </OverlayTrigger>
            </span>
          );
        } else {
          warn = (
            <span><i className="icon nb-warning yellow-text large"></i> Are you sure?</span>
          );
          notice = 'If you turn off the alerts, you won\'t receive them anymore!';
          confirmButtons = (
            <div className="pull-right">
              <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
              <span className="action-button nubity-red" onClick={this.props.clickAction}>OK</span>
            </div>
          );
          action = (
            <span>
              <span className='action-button nubity-red hidden-xs hidden-sm' onClick={this.open}>Mute notifications</span>
              <OverlayTrigger placement="top" overlay={this.props.hover}>
                <span className="action-button nubity-red hidden-md hidden-lg" title="Mute notifications" onClick={this.open}>
                  <i className="icon nb-mute-off small white-text"></i>
                </span>
              </OverlayTrigger>
            </span>
          );
        }
        break;
    }

    return (
      <div className={actionType}>
        {action}
        <Modal show={this.state.showModal} onHide={this.close} bsSize="small">
          <Modal.Body>
            <div className="row">
              <div className="col-xs-12 warn-message">
                <h1>{warn}</h1>
                <p>{notice}</p>
                <div className="med"></div>
                {confirmButtons}
              </div>
            </div>
          </Modal.Body>
        </Modal>
      </div>
    );
  },
});

module.exports = Warning;
