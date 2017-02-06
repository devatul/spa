var router       = require('../router');
var Dispatcher   = require('../dispatcher/Dispatcher');
var Constants    = require('../constants/Constants');
var SessionStore = require('../stores/SessionStore');
var EventEmitter = require('events').EventEmitter;
var assign       = require('object-assign');
var ActionTypes  = Constants.ActionTypes;
var CHANGE_EVENT = 'change';

var _providers = '';
var _textError = '';
var _errorCode = '';
var _credetials_public = '';
var _credetials_private = '';
var _credetials_onpremise = '';

var OnBoardingStore = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getProviders: function () {
    return _providers;
  },

  getCodeError: function () {
    return _errorCode;
  },

  getTextError: function () {
    return _textError;
  },

  getProviderCredentialPublic: function () {
    return _credetials_public;
  },

  getProviderCredentialPrivate: function () {
    return _credetials_private;
  },

  getProviderCredentialOnpremise: function () {
    return _credetials_onpremise;
  },
});

OnBoardingStore.dispatchToken = Dispatcher.register(function (payload) {
  var action = payload.action;

  switch (action.actionType) {

    case ActionTypes.SHOW_PROVIDERS:
      _providers = action.res;
      _textError = '';
      _errorCode = '';
      OnBoardingStore.emitChange();
      break;

    case ActionTypes.SHOW_PROPVIDER_CREDENTIAL_PUBLIC:
      _credetials_public = action.res;
      _textError = '';
      _errorCode = '';
      OnBoardingStore.emitChange();
      break;

    case ActionTypes.SHOW_PROPVIDER_CREDENTIAL_PRIVATE:
      _credetials_private = action.res;
      _textError = '';
      _errorCode = '';
      OnBoardingStore.emitChange();
      break;

    case ActionTypes.SHOW_PROPVIDER_CREDENTIAL_ONPREMISE:
      _credetials_onpremise = action.res;
      _textError = '';
      _errorCode = '';
      OnBoardingStore.emitChange();
      break;
      
    case ActionTypes.ERROR:
      if (401 == action.code) {
        router.transitionTo('login');
      }
      if (SessionStore.isLoggedIn()) {
        _textError = action.res.message;
        _errorCode = action.code;
        OnBoardingStore.emitChange();
      }
      break;
  }

  return true;
});

module.exports = OnBoardingStore;
