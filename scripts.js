
module.exports = {
  gruntScript: function (grunt, YAML) {
    var NODE_ENV = process.env.NODE_ENV;

    var dist = grunt.file.readYAML('../parameters.yml.dist');
    var parameters ;
    grunt.registerTask('start', 'setup app "env"', function () {
      var i = true;
      for (var key in dist) {
        if (key === NODE_ENV) {
          i = false;
          parameters = dist[key];
        }
      }
      if (i) {
        console.error('===========================================');
        console.error('WARNING: '+NODE_ENV+' envionment not available.\nRunning in default envionment');
        console.error('===========================================');
        parameters = dist.dev;
      }
      grunt.file.write('./parameters.yml', YAML.stringify(parameters, null, 1));
    });
  },

  shipitScript: function (shipit, YAML, path) {
    var env = YAML.load('./parameters.yml');

    shipit.initConfig({
      default: {
        rsync: [
          '--include', '"js/bundle.js"',
          '--exclude', '"js/*"',
          '--exclude', '"node_modules"'
        ]
      },
      envionment: {
        servers: env.host,
        key:     path.resolve(env.SSH_key),
      }
    });

    shipit.task('deploy', function () {
      shipit.emit('updated');
    });

    shipit.on('updated', function () {
      var buildDirectory = path.resolve('../web/*');
      var serverDirectory = '/var/www/html/spa';
      shipit.remoteCopy(buildDirectory, serverDirectory).then(function () {
        console.error('STATUS: Files upload successful.');
        shipit.emit('install_dependency');
      });
    });

    shipit.on('install_dependency', function () {
      shipit.remote('npm install',{cwd: '/var/www/html/spa'}).then(function () {
        console.error('STATUS: npm install successful. \nDeployed successfully.');
      });
    });
  },
};
