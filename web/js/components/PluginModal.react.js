var React      = require('react');
var Modal      = require('react-bootstrap').Modal;
var Popover    = require('react-bootstrap').Popover;
var Button     = require('react-bootstrap').Button;
var Tooltip    = require('react-bootstrap').Tooltip;
var OverlayTrigger = require('react-bootstrap').OverlayTrigger;

module.exports = React.createClass({
  getInitialState: function () {
    return { showModal: true };
  },

  close: function () {
    this.setState({ showModal: false });
  },

  open: function () {
    this.setState({ showModal: true });
  },

  render: function () {
    var inputs = [];
    var id;
    var form = (<form>{inputs}</form>);
    if (undefined !== this.props.macros) {
      for (var key in this.props.macros) {
        inputs.push(
          <div className="form-group">
            <label for={key}>{this.props.macros[key].macro}</label>
            <input type="email" className="form-control" id={key} defaultValue={(null !== this.props.macros[key].value) ? this.props.macros[key].value : this.props.macros[key].default_value}/>
          </div>
        );
      }
      var form = (<form>{inputs}</form>);
    }

    return (
      <div className="action-instance">
        <span className="icon nb-stop icon-margin" onClick={this.open}></span>
        <Modal show={this.state.showModal} onHide={this.close} bsSize="small">
          <Modal.Body>
            {form}
          </Modal.Body>
        </Modal>
      </div>
    );
  },
});
