var React                      = require('react');
var Router                     = require('../router');
var Modal                      = require('react-bootstrap').Modal;

module.exports = React.createClass({
  getInitialState: function () {
    return {
      showModal: false,
      modalType: this.props.modalType,
    };
  },

  componentWillReceiveProps: function (nextProps) {
    if (nextProps.modalType !== this.state.modalType) {
      this.setState({ modalType: nextProps.modalType });
    }
    if ('' != nextProps.modalType) {
      this.setState({ showModal: true });
    }
  },

  close: function () {
    this.setState({
      showModal: false,
    });
  },

  execute: function () {
    this.setState({
      showModal: false,
    });

    this.props.okAction(this.props.functionParam);
  },

  render: function () {
    var notice;
    var warn;
    var confirmButtons;

    switch (this.state.modalType) {
      case 'start':
        warn = (
          <span><i className="icon nb-warning yellow-text large"></i> You&#39;re about to start an instance</span>
        );
        notice = 'The instance will start right after you click OK button';
        confirmButtons = (
          <div className="pull-right">
            <span className="action-button nubity-green" onClick={this.close}>Cancel</span>
            <span className="action-button nubity-blue" onClick={this.execute}>OK</span>
          </div>
        );
        break;
      case 'stop':
        warn = (
          <span><i className="icon nb-warning yellow-text large"></i> Are you sure?</span>
        );
        notice = 'If you stop this instance, it\'ll be unavailable until the next start';
        confirmButtons = (
          <div className="pull-right">
            <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
            <span className="action-button nubity-red" onClick={this.execute}>OK</span>
          </div>
        );
        break;
      case 'restart':
        warn = (
          <span><i className="icon nb-warning yellow-text large"></i> Are you sure to restart?</span>
        );
        notice = 'The instance will be unavailable for a few minutes';
        confirmButtons = (
          <div className="pull-right">
            <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
            <span className="action-button nubity-red" onClick={this.execute}>OK</span>
          </div>
        );
        break;
      case 'managementStart':
        warn = (
          <span><i className="icon nb-ninja-support yellow-text large"></i> Start Support</span>
        );
        notice = (
          <span>
            You are activating management services for device {this.props.hostname}.<br/>
            The server takeover process may take from 4 to 6 hours depending on the server complexity.<br/>
            This action will create a charge in the user's account.<br/><br/>
            By clicking the button "I Accept" you agree the <a>Nubity's Terms and Conditions & Privacy Policy</a>.
          </span>
        );
        confirmButtons = (
          <div className="pull-right">
            <span className="action-button nubity-blue" onClick={this.close}>Close</span>
            <span className="action-button nubity-green" onClick={this.execute}>I Accept</span>
          </div>
        );
        break;
      case 'managementStop':
        warn = (
          <span><i className="icon nb-warning yellow-text large"></i> Are you sure?</span>
        );
        notice = (
          <span>
            Cancelling this management product will impact the billing and management at the end of the current billing cycle. In any moment during this period, you can dismiss this cancellation request and the service will continue normally.
          </span>
        );
        confirmButtons = (
          <div className="pull-right">
            <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
            <span className="action-button nubity-red" onClick={this.execute}>OK</span>
          </div>
        );
        break;
      case 'monitoringStop':
        warn = (
          <span><i className="icon nb-warning yellow-text large"></i> Are you sure?</span>
        );
        notice = (
          <span>
            Cancelling this monitoring product will impact the billing and monitoring at the end of the current billing cycle. In any moment during this period, you can dismiss this cancellation request and the service will continue normally.
          </span>
        );
        confirmButtons = (
          <div className="pull-right">
            <span className="action-button nubity-blue" onClick={this.close}>Cancel</span>
            <span className="action-button nubity-red" onClick={this.execute}>OK</span>
          </div>
        );
        break;
    }

    return (
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
    );
  },
});
