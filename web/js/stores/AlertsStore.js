var router       = require('../router');
var Dispatcher   = require('../dispatcher/Dispatcher');
var Constants    = require('../constants/Constants');
var SessionStore = require('./SessionStore');
var EventEmitter = require('events').EventEmitter;
var assign       = require('object-assign');
var ActionTypes  = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _alerts          = '';
var _stats           = '';
var _history         = '';
var _isAlertTicket   = false;
var _alertTicket     = '';
var _dashboardAlerts = '';
var _errorCode    = '';
var _textError    = '';

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

  getHistoryAlerts: function () {
    return _history;
  },

  getDashboardAlerts: function () {
    return _dashboardAlerts;
  },

  getDashboardStats: function () {
    return _stats;
  },

  getAlertTicket: function () {
    return _alertTicket;
  },

  setIsAlertTicket: function () {
    _isAlertTicket = true;
  },

  resetAlertTicket: function () {
    _isAlertTicket = false;
  },

  isAlertTicket: function () {
    return _isAlertTicket;
  },

  getCodeError: function () {
    return _errorCode;
  },

  getTextError: function () {
    return _textError;
  },
});

AlertsStore.dispatchToken = Dispatcher.register(function (payload) {
  Dispatcher.waitFor([
    SessionStore.dispatchToken,
  ]);

  var action = payload.action;
  switch (action.actionType) {

    case ActionTypes.SHOW_ALERTS:
      _alerts = action.res;
      _textError = '';
      _errorCode = '';
      AlertsStore.emitChange();
      break;

    case ActionTypes.SHOW_STATS:
      _stats = action.res;
      _textError = '';
      _errorCode = '';
      AlertsStore.emitChange();
      break;

    case ActionTypes.SHOW_HISTORY_ALERTS:
      _history   = action.res;
      _textError = '';
      _errorCode = '';
      AlertsStore.emitChange();
      break;

    case ActionTypes.SHOW_DASHBOARD_ALERTS:
      _dashboardAlerts = action.res;
      _textError = '';
      _errorCode = '';
      AlertsStore.emitChange();
      break;

    case ActionTypes.CREATE_ALERT_TICKET:
      _alertTicket = action.res;
      _isAlertTicket = true;
      _textError = '';
      _errorCode = '';
      break;

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
