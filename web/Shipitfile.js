var path = require('path');
module.exports = function (shipit) {
  require('shipit-deploy')(shipit);
/*****************
this is the dommy configration data need to change with actual when implented
**********************/
  shipit.initConfig({
    default: {
      workspace: path.resolve('./tmp/nubity-spa-deploy'),
      repositoryUrl: 'https://github.com/nubity/spa.git ',
      ignore: ['.git', 'node_modules'],
      keepReleases: 5,
      deleteOnRollback: false,
      shallowClone: true,
    },
    production: {
      servers: 'etech@144.76.34.244:4444',
      deployTo: 'public_html/spa',
      key: path.resolve('./server-key.ppk'),
    },
    develop: {
      servers: 'etech00@192.168.1.124',
      deployTo: path.resolve('./tmp/dev.deploy')
    },
  });

  shipit.task('build', function () {
    shipit.emit('updated');
  });

  shipit.on('updated', function () {
    var buildDirectory = path.resolve('./js/bundle.js');
    var serverDirectory = 'public_html/spa/web/js';
    shipit.remoteCopy(buildDirectory, serverDirectory);
  });

};
