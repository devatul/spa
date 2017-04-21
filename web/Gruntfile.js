var YAML = require('yamljs');
var gruntScript = require('../scripts.js').gruntScript;

module.exports = function (grunt) {

  gruntScript(grunt, YAML);

};
