var React           = require('react');
var uninstallPlugin = require('../actions/RequestActions').uninstallPlugin;
var installPlugin   = require('../actions/RequestActions').installPlugin;
var configureAction = require('../actions/RequestActions').configureTemplate;

module.exports = React.createClass({
  getInitialState: function () {
    var action;
    var install;
    if (this.props.template.is_installed) {
      action = 'uninstall';
      install = (<button type="submit" className="action-button nubity-red">Uninstall</button>);
    } else {
      action = 'install';
      install = (<button type="submit" className="action-button nubity-green">Install</button>);
    }
    return {
      install: install,
      action: action,
      idTemplate: this.props.template.template,
    };
  },

  componentWillReceiveProps: function (nextProps) {
    var action;
    var install;
    if (nextProps.template.is_installed) {
      action = 'uninstall';
      install = (<button type="submit" className="action-button nubity-red">Uninstall</button>);
    } else {
      action = 'install';
      install = (<button type="submit" className="action-button nubity-green">Install</button>);
    }
    this.setState({
      install: install,
      action: action,
      idTemplate: nextProps.template.template,
    });
  },

  _onSubmit: function (e) {
    e.preventDefault();
    var newMacros = [];
    var form      = e.target.elements;

    for (var key in this.props.macros) {
      newMacros[key] = {value: form.macros[key].value};
    }
    configureAction(this.props.idInstance, newMacros, this.state.idTemplate);
    if ('install' == this.state.action) {
      installPlugin(this.state.idTemplate, this.props.idInstance);
    } else {
      uninstallPlugin(this.state.idTemplate, this.props.idInstance);
    }
  },

  render: function () {
    var macros = [];
    if (this.props.template.user_macros) {
      for (var key in this.props.template.user_macros) {
        if ('user_data' == this.props.template.user_macros[key].type) {
          macros.push(
            <div className="form-group row">
              <div className="col-xs-offset-4">
                <label for={key}>{this.props.template.user_macros[key].name}</label>
                <input type={this.props.template.user_macros[key].is_password ? 'password' : 'text'} className="form-control col-xs-4" id={key} defaultValue={(null !== this.props.template.user_macros[key].value) ? this.props.template.user_macros[key].value : ''} placeholder={this.props.template.user_macros[key].default_value}/>
              </div>
            </div>
          );
        }
      }
    }
    var numberOne;
    var numberTwo;
    var numberThree;

    if (0 < macros.length) {
      numberOne = 'col-xs-12';
      numberTwo = '2';
      numberThree = '3';
    } else {
      numberOne = 'hidden';
      numberTwo = '1';
      numberThree = '2';
    }

    return (
      <div className="container">
        <div className="row">
          <div className="col-xs-4">
            <div className={numberOne}>
              <div className="round-number number-1">1</div>
              <span>Complete information</span>
            </div>
          </div>
        </div>
        <div className="row">
          <form onSubmit={this._onSubmit} className="col-xs-5">
            {macros}
            <div className="col-xs-12">
              <div className="round-number number-2">{numberTwo}</div>
              <span>Technical pocedure</span>
            </div>
            <div className="col-xs-offset-4 col-xs-8" dangerouslySetInnerHTML={{__html: this.props.template.description}}></div>
            <div className="col-xs-12">
              <div className="round-number number-2">{numberThree}</div>
              <span>Install</span>
            </div>
            <div className="col-xs-offset-4 col-xs-8">{this.state.install}</div>
          </form>
        </div>
      </div>
    );
  },
});
