var YAML = require('yamljs');

module.exports = function (grunt) {

  grunt.initConfig({

  });

  grunt.registerTask('env','setup app "env"', function (env){
    var isExists = grunt.file.exists('../../deploy_config.yml');
    var dist = grunt.file.readYAML('parameters.dist.yml');
    if (isExists) {
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

};
