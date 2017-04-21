
module.exports = {
  gruntScript: function (grunt, YAML) {
    grunt.initConfig({

    });
    grunt.registerTask('env', 'setup app "env"', function (env) {
      var isFileExists = grunt.file.exists('../../deploy_config.yml');
      var dist = grunt.file.readYAML('parameters.dist.yml');
      if (isFileExists) {
        var config = grunt.file.readYAML('../../deploy_config.yml');
        if ('prod' === env) {
          dist.baseURL = config.prodBaseURL || dist.defaultBaseURL;
        } else if ('dev' === env) {
          dist.baseURL = config.devBaseURL || dist.defaultBaseURL;
        }
      } else {
        if ('prod' === env) {
          console.error('===========================================');
          console.error('Error: Production envionment not available.\nRunning in default envionment');
          console.error('===========================================');
        }
        dist.baseURL = dist.defaultBaseURL;
      }
      grunt.file.write('parameters.dist.yml', YAML.stringify(dist, null, 1));
    });
  },

  shipitScript: function (shipit, YAML, path, fs) {
    var config      = {};
    var config_path = '../../deploy_config.yml';
    if (fs.existsSync(config_path)) {
      config = YAML.load(config_path);
    }
    var dist        = YAML.load('parameters.dist.yml');

    shipit.initConfig({
      default: {
        rsync: config.rsync || dist.rsync,
      },
      production: {
        servers: config.host || dist.host,
        key:     path.resolve(config.SSH_key || dist.SSH_key),
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
  },
};
