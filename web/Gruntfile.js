module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    copy: {
      live: {
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
  grunt.registerTask('config_live', ['copy:live']);
  grunt.registerTask('config_dev', ['copy:dev']);
};
