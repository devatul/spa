var router       = require('../router');
var Dispatcher   = require('../dispatcher/Dispatcher');
var Constants    = require('../constants/Constants');
var SessionStore = require('../stores/SessionStore');
var EventEmitter = require('events').EventEmitter;
var assign       = require('object-assign');
var ActionTypes  = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _overview = '';
var _public = '';
var _textError = '';
var _errorCode = '';

var InfrastructureStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getInfrastructureOverview: function() {
    return _overview;
  },
  getInfrastructurePublicCloud: function() {
    return _public;
  }
});

InfrastructureStore.dispatchToken = Dispatcher.register(function(payload) {
  var action = payload.action;

  switch (action.actionType) {

    case ActionTypes.SHOW_INFRASTRUCTURE_OVERVIEW:
      _overview = action.res;
      _textError = '';
      _errorCode = '';
      InfrastructureStore.emitChange();
    break;

    case ActionTypes.SHOW_INFRASTRUCTURE_PUBLIC_CLOUD:
      _public = action.res;
      _textError = '';
      _errorCode = '';
      InfrastructureStore.emitChange();
    break;

    case ActionTypes.ERROR:
      if (action.code == 401) {
          router.transitionTo('login');
      }
      if (SessionStore.isLoggedIn()) {
        _textError = action.res.message;
        _errorCode = action.code;
        InfrastructureStore.emitChange();
      }
    break;
  }

  return true;
});

module.exports = InfrastructureStore;
