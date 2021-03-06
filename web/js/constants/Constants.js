var keyMirror = require('keymirror');
var Root      = 'http://api.pricing.nubity.com';
var APIRoot   = Root;

module.exports = {
  ActionTypes: keyMirror({
    LOGIN_RESPONSE: null,
    LOGOUT: null,
    REDIRECT: null,
    SHOW_SIGNUP_MESSAGE: null,
    ERROR: null,
    SHOW_INFRASTRUCTURE_OVERVIEW: null,
    SHOW_INFRASTRUCTURE_PUBLIC_CLOUD: null,
    SHOW_INFRASTRUCTURE_PRIVATE_CLOUD: null,
    SHOW_INFRASTRUCTURE_ON_PREMISE: null,
    SHOW_ALERTS: null,
    SHOW_STATS: null,
    SHOW_HISTORY_ALERTS: null,
    SHOW_DASHBOARD_ALERTS: null,
    SHOW_CONFIRM_MESSAGE: null,
    SHOW_PROVIDERS: null,
    SHOW_NINJA: null,
    SHOW_DASHBOARDS: null,
    SHOW_DASHBOARD: null,
    SHOW_AVAILABLE_GRAPH_TYPES: null,
    SEARCH: null,
    CREATE_ALERT_TICKET: null,
    SHOW_TICKET: null,
    VIEW_TICKET: null,
    SHOW_COMPANY: null,
  }),

  PayloadSources: keyMirror({
    SERVER_ACTION: null,
    VIEW_ACTION: null,
  }),

  APIEndpoints: {
    PUBLIC: Root,
  },
};
