module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      prod: {
        src: 'js/config/live.js',
        dest: 'js/config/config.js',
      },
      dev: {
        src: 'js/config/dev.js',
        dest: 'js/config/config.js',
      },
    },
  });
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.registerTask('config_prod', ['copy:prod']);
  grunt.registerTask('config_dev', ['copy:dev']);
};
