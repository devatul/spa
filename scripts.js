
module.exports = {
  gruntScript: function (grunt, YAML) {
    grunt.registerTask('env', 'setup app "env"', function (env) {
      var fileExists = grunt.file.exists('../parameters.yml');
      var dist = grunt.file.readYAML('parameters.yml.dist');
      var rootConfig = grunt.file.readYAML('js/config.yml');
      if (fileExists) {
        var config = grunt.file.readYAML('../parameters.yml');
        if ('prod' === env) {
          rootConfig.baseURL = config.baseURL || dist.baseURL;
        } else if ('dev' === env) {
          rootConfig.baseURL = dist.baseURL;
        }
      } else {
        if ('prod' === env) {
          console.error('===========================================');
          console.error('Error: Production envionment not available.\nRunning in default envionment');
          console.error('===========================================');
        }
        rootConfig.baseURL = dist.baseURL
      }
      grunt.file.write('js/config.yml', YAML.stringify(rootConfig, null, 1));
    });
  },

  shipitScript: function (shipit, YAML, path, fs) {
    var config      = {};
    var config_path = '../parameters.yml';
    if (fs.existsSync(config_path)) {
      config = YAML.load(config_path);
    }
    var dist        = YAML.load('parameters.yml.dist');

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
