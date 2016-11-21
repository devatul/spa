var router       = require('../router');
var Dispatcher   = require('../dispatcher/Dispatcher');
var Constants    = require('../constants/Constants');
var SessionStore = require('../stores/SessionStore');
var EventEmitter = require('events').EventEmitter;
var assign       = require('object-assign');
var ActionTypes  = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _ninja = '';
var _textError = '';
var _errorCode = '';

var NinjaStore = assign({}, EventEmitter.prototype, {

  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getNinja: function() {
    return _ninja;
  },
});

NinjaStore.dispatchToken = Dispatcher.register(function(payload) {
  var action = payload.action;

  switch (action.actionType) {

    case ActionTypes.SHOW_NINJA:
      _ninja = action.res;
      _textError = '';
      _errorCode = '';
      NinjaStore.emitChange();
    break;

    case ActionTypes.ERROR:
      if (401 == action.code) {
          router.transitionTo('login');
      }
      if (SessionStore.isLoggedIn()) {
        _textError = action.res.message;
        _errorCode = action.code;
        NinjaStore.emitChange();
      }
    break;
  }

  return true;
});

module.exports = NinjaStore;
