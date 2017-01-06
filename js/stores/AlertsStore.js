var router       = require('../router');
var Dispatcher   = require('../dispatcher/Dispatcher');
var Constants    = require('../constants/Constants');
var SessionStore = require('../stores/SessionStore');
var EventEmitter = require('events').EventEmitter;
var assign       = require('object-assign');
var ActionTypes  = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _alerts = '';
var _dashboardAlerts = '';
var _textError = '';
var _errorCode = '';

var AlertsStore = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getAlerts: function () {
    return _alerts;
  },

  getDashboardAlerts: function () {
    return _dashboardAlerts;
  },
});

AlertsStore.dispatchToken = Dispatcher.register(function (payload) {
  var action = payload.action;

  switch (action.actionType) {

    case ActionTypes.SHOW_ALERTS:
      _alerts = action.res;
      _textError = '';
      _errorCode = '';
      AlertsStore.emitChange();
      break;

    case ActionTypes.SHOW_DASHBOARD_ALERTS:
      _dashboardAlerts = action.res;
      _textError = '';
      _errorCode = '';
      AlertsStore.emitChange();

    case ActionTypes.SHOW_DASHBOARD_ALERTS:
      _dashboardAlerts = action.res;
      _textError = '';
      _errorCode = '';
      AlertsStore.emitChange();

    case ActionTypes.ERROR:
      if (401 == action.code) {
        router.transitionTo('login');
      }
      if (SessionStore.isLoggedIn()) {
        _textError = action.res.message;
        _errorCode = action.code;
        AlertsStore.emitChange();
      }
      break;
  }

  return true;
});

module.exports = AlertsStore;
