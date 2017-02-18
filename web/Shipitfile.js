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
      servers: 'etech00@192.168.1.144',
      deployTo: path.resolve('./tmp/prod.deploy')
    },
    develop: {
      servers: 'etech00@192.168.1.144',
      deployTo: path.resolve('./tmp/dev.deploy')
    },
  });
};
