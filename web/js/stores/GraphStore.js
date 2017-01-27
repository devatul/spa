var router       = require('../router');
var Dispatcher   = require('../dispatcher/Dispatcher');
var Constants    = require('../constants/Constants');
var SessionStore = require('../stores/SessionStore');
var EventEmitter = require('events').EventEmitter;
var assign       = require('object-assign');
var ActionTypes  = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _dashboards  = '';
var _dashboard   = '';
var _textError   = '';
var _errorCode   = '';
var _graphTypes  = '';

var GraphStore = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getDashboards: function () {
    return _dashboards.member;
  },

  getDashboard: function () {
    return _dashboard.member;
  },

  getGraphTypes: function () {
    return _graphTypes;
  }
});

GraphStore.dispatchToken = Dispatcher.register(function (payload) {
  var action = payload.action;

  switch (action.actionType) {

    case ActionTypes.SHOW_DASHBOARDS:
      _dashboards = action.res;
      _textError  = '';
      _errorCode  = '';
      GraphStore.emitChange();
    break;

    case ActionTypes.SHOW_DASHBOARD:
      _dashboard = action.res;
      _textError  = '';
      _errorCode  = '';
      GraphStore.emitChange();
    break;

    case ActionTypes.SHOW_AVAILABLE_GRAPH_TYPES:
      _graphTypes = action.res;
      GraphStore.emitChange();
    break;

    case ActionTypes.ERROR:
      if (401 == action.code) {
          router.transitionTo('login');
      }
      if (SessionStore.isLoggedIn()) {
        _textError = action.res.message;
        _errorCode = action.code;
        GraphStore.emitChange();
      }
    break;
  }

  return true;
});

module.exports = GraphStore;
