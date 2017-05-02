
module.exports = {
  gruntScript: function (grunt, YAML) {
    var fileExists = grunt.file.exists('../parameters.yml');
    var dist = grunt.file.readYAML('../parameters.yml.dist');
    var parameters = grunt.file.readJSON('../parameters.json');
    if (fileExists) {
      var config = grunt.file.readYAML('../parameters.yml');
    }

    grunt.registerTask('env', 'setup app "env"', function (env) {
      if ('prod' === env && fileExists) {
        parameters.baseURL = config.baseURL || dist.baseURL;
      } else if ('prod' === env && !fileExists) {
        console.error('===========================================');
        console.error('Error: Production envionment not available.\nRunning in default envionment');
        console.error('===========================================');
        parameters.baseURL = dist.baseURL;
      } else {
        parameters.baseURL = dist.baseURL;
      }
      grunt.file.write('../parameters.json', JSON.stringify(parameters, null, 1));
    });
  },

  shipitScript: function (shipit, YAML, path, fs) {
    var config      = {};
    var config_path = '../parameters.yml';
    if (fs.existsSync(config_path)) {
      config = YAML.load(config_path);
    }
    var dist        = YAML.load('../parameters.yml.dist');

    shipit.initConfig({
      default: {
        rsync: config.rsync || dist.rsync,
      },
      development: {
        servers: dist.host,
        key:     path.resolve(dist.SSH_key),
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
