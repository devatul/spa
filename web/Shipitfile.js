var path        = require('path');
var YAML        = require('yamljs');
var fs          = require('fs');
var shipitScript = require('../scripts.js').shipitScript;

module.exports = function (shipit) {

  shipitScript(shipit, YAML, path, fs);

};
