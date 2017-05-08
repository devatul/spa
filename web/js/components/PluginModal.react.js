var React                 = require('react');
var Modal                 = require('react-bootstrap').Modal;
var Popover               = require('react-bootstrap').Popover;
var Button                = require('react-bootstrap').Button;
var Tooltip               = require('react-bootstrap').Tooltip;
var OverlayTrigger        = require('react-bootstrap').OverlayTrigger;
var configureAction       = require('../actions/RequestActions').configureTemplate;

class PluginModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: true,
    };
    this.close = this.close.bind(this);
    this.open = this.open.bind(this);
    this._onSubmit = this._onSubmit.bind(this);
  }

  componentDidMount() {
    this.setState({showModal: true});
  }

  componentWillReceiveProps(nextProps) {
    this.setState({showModal: false});
  }

  close() {
    this.setState({showModal: false});
  }

  open() {
    this.setState({showModal: true});
  }

  _onSubmit(e) {
    e.preventDefault();
    var newMacros = [];
    var form      = e.target.elements;

    for (var key in this.props.macros) {
      newMacros[key] = {value: form.macros[key].value};
    }
    configureAction(this.props.instanceId, newMacros, this.props.templateId);
    this.setState({showModal: false});

  }

  render() {
    var inputs = [];
    var form = (<form>{inputs}</form>);
    if (undefined !== this.props.macros) {
      for (var key in this.props.macros) {
        inputs.push(
          <div className="form-group">
            <label htmlFor={key}>{this.props.macros[key].name}</label>
            <input type="text" className="form-control" id="macros" defaultValue={null !== this.props.macros[key].value ? this.props.macros[key].value : this.props.macros[key].default_value} />
          </div>
        );
      }
      form = (
        <form onSubmit={this._onSubmit} className="padding-20">
          {inputs}
          <button type="submit" className="action-button-xs nubity-green">Editar</button>
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
  }
}

module.exports = PluginModal;
