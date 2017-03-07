var React           = require('react');
var Modal           = require('react-bootstrap').Modal;
var Popover         = require('react-bootstrap').Popover;
var Button          = require('react-bootstrap').Button;
var Tooltip         = require('react-bootstrap').Tooltip;
var OverlayTrigger  = require('react-bootstrap').OverlayTrigger;
var configureAction = require('../actions/RequestActions').configureTemplate;

module.exports = React.createClass({
  getInitialState: function () {
    return { showModal: true };
  },

  componentDidMount: function () {
    this.setState({ showModal: true });
  },

  componentWillReceiveProps: function (nextProps) {
    this.setState({ showModal: true });
  },

  close: function () {
    this.setState({ showModal: false });
  },

  open: function () {
    this.setState({ showModal: true });
  },

  _onSubmit: function (e) {
    e.preventDefault();
    var macros    = this.props.macros;
    var newMacros = [];
    var form      = e.target.elements;

    for (var key in this.props.macros) {
      newMacros[key] = {value: form.macros[key].value}
    }
    configureAction(this.props.instanceId, newMacros, this.props.templateId);
    this.setState({ showModal: false });

  },

  render: function () {
    var inputs = [];
    var form = (<form>{inputs}</form>);
    if (undefined !== this.props.macros) {
      for (var key in this.props.macros) {
        inputs.push(
          <div className="form-group">
            <label for={key}>{this.props.macros[key].name}</label>
            <input type="text" className="form-control" id="macros" defaultValue={(null !== this.props.macros[key].value) ? this.props.macros[key].value : this.props.macros[key].default_value}/>
          </div>
        );
      }
      var form = (
        <form onSubmit={this._onSubmit}>
          {inputs}
          <button type="submit" >Editar</button>
        </form>
      );
    }

    return (
      <div className="hidden">
        <span className="icon nb-stop icon-margin" onClick={this.open}></span>
        <Modal show={this.state.showModal} onHide={this.close} bsSize="small">
          <Modal.Body>
            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.close}><span aria-hidden="true">&times;</span></button>
            {form}
          </Modal.Body>
        </Modal>
      </div>
    );
  },
});
