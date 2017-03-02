var path = require('path');
var ssh = require('./js/config/config');
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);

  shipit.initConfig({
    default: {
      rsync: [
        '--include',' "js/bundle.js"',
        '--exclude',' "js/*"',
        '--exclude', '"node_modules"',
     ],
    },
    production: {
      servers: 'etech@144.76.34.244:4444',
      key: path.resolve(ssh.SSH_key_path),
    },
    develop: {
      servers: 'etech00@192.168.1.124',
    },
  });

  shipit.task('build', function () {
    shipit.emit('updated');
  });

  shipit.on('updated', function () {
    var buildDirectory = path.resolve('../web/*');
    var serverDirectory = 'public_html/spa/web/test/';
    shipit.remoteCopy(buildDirectory, serverDirectory);
  });

};
