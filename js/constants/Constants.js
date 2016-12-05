var keyMirror = require('keymirror');
var Root      = 'http://api.pricing.nubity.com';
var APIRoot   = Root;

module.exports = {
  ActionTypes: keyMirror({
    LOGIN_RESPONSE: null,
    LOGOUT: null,
    REDIRECT: null,
    ERROR: null,
    SHOW_INFRASTRUCTURE_OVERVIEW: null,
    SHOW_ALERTS: null,
    SHOW_DASHBOARD_ALERTS: null,
    SHOW_PROVIDERS: null,
    SHOW_NINJA: null,
    SHOW_DASHBOARDS: null,
    SHOW_DASHBOARD: null,
    SHOW_AVAILABLE_GRAPH_TYPES: null,
    SEARCH: null,
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null,
  }),

  APIEndpoints: {
    PUBLIC: Root,
  },
};
