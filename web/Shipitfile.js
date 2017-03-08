var path        = require('path');
var YAML        = require('yamljs');
var fs          = require('fs');
var config      = {};
var config_path = '../../deploy_config.yml';
if (fs.existsSync(config_path)) {
  config        = YAML.load(config_path);
}
var dist        = YAML.load('parameters.dist.yml');
var shipit      = require('shipit-deploy');

module.exports = function (shipit) {

  shipit.initConfig({
    default: {
      rsync: config.rsync || dist.rsync,
    },
    production: {
      servers: config.host || dist.host,
      key: path.resolve(config.SSH_key || dist.SSH_key),
    },
  });

  shipit.task('deploy', function () {
    shipit.emit('updated');
  });

  shipit.on('updated', function () {
    var buildDirectory = path.resolve(config.src || dist.src);
    var serverDirectory = config.dest || dist.dest;
    shipit.remoteCopy(buildDirectory, serverDirectory);
  });

};
