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
    switch (this.props.type) {
      case 'start':
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
    }

    return (
      <div className="action-instance">
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
