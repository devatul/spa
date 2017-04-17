var React                      = require('react');
var PluginMonitoring           = require('./Plugins_monitoring.react');
var PluginConfigure            = require('./Configure_triggers.react');
var PluginsCarousel            = require('./Plugins_carousel.react');

module.exports = React.createClass({

  getInitialState: function () {
    return {
      tabs:            'hidden',
      content:         '',
      templateContent: '',
    };
  },

  componentWillReceiveProps: function (nextProps) {
    for (var key in nextProps.templates) {
      if (this.state.templateContent.template == nextProps.templates[key].template && this.state.templateContent.is_installed != nextProps.templates[key].is_installed) {
        var content = (
          <div className="tab-content section-content">
            <div id="pluginMonitoring" className="tab-pane fade in active">
              <PluginMonitoring template={nextProps.templates[key]} idInstance={nextProps.idInstance} />
            </div>
            <div id="pluginConfigure" className={0 < nextProps.templates[key].triggers.length ? 'tab-pane fade' : 'hidden'}>
              <PluginConfigure template={nextProps.templates[key]} idInstance={nextProps.idInstance} />
            </div>
          </div>
        );
        this.setState({
          tabs:            'nav nav-tabs section-tabs',
          content:         content,
          templateContent: nextProps.templates[key],
          configureClass:  0 < nextProps.templates[key].triggers.length ? '' : 'hidden',
        });
      }
    }

    var url = window.location.href.split('#');
    if (3 < url.length) {
      var urlContent = '';
      var id = url[3];
      for (var cont in nextProps.templates) {
        if (nextProps.templates[cont].template == id) {
          urlContent = (
            <div className="tab-content section-content">
              <div id="pluginMonitoring" className="tab-pane fade in active">
                <PluginMonitoring template={nextProps.templates[cont]} idInstance={nextProps.idInstance} />
              </div>
              <div id="pluginConfigure" className={0 < nextProps.templates[cont].triggers.length ? 'tab-pane fade' : 'hidden'}>
                <PluginConfigure template={nextProps.templates[cont]} idInstance={nextProps.idInstance} />
              </div>
            </div>
          );
          this.setState({
            tabs:            'nav nav-tabs section-tabs',
            content:         urlContent,
            templateContent: nextProps.templates[cont],
            configureClass:  0 < nextProps.templates[cont].triggers.length ? '' : 'hidden',
          });
        }
      }
    }
  },

  clickTemplate: function (template) {
    var content = (
      <div className="tab-content section-content">
        <div id="pluginMonitoring" className="tab-pane fade in active">
          <PluginMonitoring template={template} idInstance={this.props.idInstance} />
        </div>
        <div id="pluginConfigure" className={0 < template.triggers.length ? 'tab-pane fade' : 'hidden'}>
          <PluginConfigure template={template} idInstance={this.props.idInstance} />
        </div>
      </div>
    );
    this.setState({
      tabs:            'nav nav-tabs section-tabs',
      content:         content,
      templateContent: template,
      configureClass:  0 < template.triggers.length ? '' : 'hidden',
    });
  },

  render: function () {
    return (
      <div>
        <PluginsCarousel templates={this.props.templates} clickTemplate={this.clickTemplate} />
        <div>
          <ul className={this.state.tabs}>
            <li role="presentation" className="active">
              <a className="grey-color" data-toggle="tab" href="#pluginMonitoring">
                <span> Monitoring</span>
              </a>
            </li>
            <li role="presentation" className={this.state.configureClass}>
              <a className="grey-color" data-toggle="tab" href="#pluginConfigure">
                <span> Configure</span>
              </a>
            </li>
          </ul>
        </div>
        {this.state.content}
      </div>
    );
  },
});
