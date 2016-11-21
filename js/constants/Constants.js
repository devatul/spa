var keyMirror = require('keymirror');
var Root      = "http://api.pricing.nubity.com";
var APIRoot   = Root;

module.exports = {
  ActionTypes: keyMirror({
    LOGIN_RESPONSE: null,
    REDIRECT: null,
    ERROR: null,
    SHOW_INFRASTRUCTURE_OVERVIEW: null,
    SHOW_ALERTS: null,
    SHOW_NINJA: null,
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null,
  }),

  APIEndpoints: {
    PUBLIC: Root,
  }
};
