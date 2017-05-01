var React                      = require('react');
var uninstallPlugin            = require('../actions/RequestActions').uninstallPlugin;
var installPlugin              = require('../actions/RequestActions').installPlugin;
var PluginModal                = require('./PluginModal.react');
var Preloader                  = require('./Preloader.react');
var alertify                   = require('alertify.js');

class PluginsTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pluginForm:  'hola',
      pluginModal: '',
    };
    this._uninstall = this._uninstall.bind(this);
    this._install = this._install.bind(this);
    this._configure = this._configure.bind(this);
  }

  _uninstall(idPlugin) {
    uninstallPlugin(idPlugin, this.props.idInstance);
  }

  _install(idPlugin) {
    installPlugin(idPlugin, this.props.idInstance);
  }

  _configure(template) {
    if (0 < template.user_macros.length) {
      var modal = (<PluginModal macros={template.user_macros} instanceId={this.props.idInstance} templateId={template.template} />);
      this.setState({
        pluginModal: modal,
      });
    }
  }

  render() {
    var rows = [];
    var install;
    for (var key in this.props.plugins) {
      if (this.props.plugins[key].is_installed) {
        install = (<span className="action-button nubity-red" onClick={this._uninstall.bind(this, this.props.plugins[key].template)}>Uninstall</span>);
      } else {
        install = (<span className="action-button nubity-green" onClick={this._install.bind(this, this.props.plugins[key].template)}>Install</span>);
      }
      rows.push(
        <tr key={key} className="content">
          <td>{this.props.plugins[key].name}</td>
          <td>Web Apps</td>
          <td className="icons"><span className={0 < this.props.plugins[key].user_macros.length ? 'action-button nubity-blue' : 'action-button nubity-grey disabled'} onClick={this._configure.bind(this, this.props.plugins[key])}>Configure</span></td>
          <td className="icons">{install}</td>
        </tr>
      );
    }
    if (0 >= rows.length) {
      return (<Preloader />);
    }
    return (
      <div className="container">
        <div className="col-md-10 col-md-offset-1">
          <table>
            <thead>
              <tr>
                <th>Plugin</th>
                <th>Group</th>
                <th className="column-button"></th>
                <th className="column-button"></th>
              </tr>
            </thead>
            <tbody>
              {rows}
            </tbody>
          </table>
          {this.state.pluginModal}
        </div>
      </div>
    );
  }
}

module.exports = PluginsTable;
