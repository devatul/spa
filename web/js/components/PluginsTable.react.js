var React                      = require('react');
var uninstallPlugin            = require('../actions/RequestActions').uninstallPlugin;
var installPlugin              = require('../actions/RequestActions').installPlugin;
var PluginModal                = require('./PluginModal.react');
var Preloader                  = require('./Preloader.react');
var alertify                   = require('alertify.js');

module.exports = React.createClass({
  getInitialState: function () {
    return {
      pluginForm:  'hola',
      pluginModal: '',
    };
  },

  _uninstall: function (idPlugin) {
    uninstallPlugin(idPlugin, this.props.idInstance);
  },

  _install: function (idPlugin) {
    installPlugin(idPlugin, this.props.idInstance);
  },

  _configure: function (template) {
    if (0 < template.user_macros.length) {
      var modal = (<PluginModal macros={template.user_macros} instanceId={this.props.idInstance} templateId={template.template} />);
      this.setState({
        pluginModal: modal,
      });
    }
  },

  render: function () {
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
  },
});
