var Dispatcher    = require('../dispatcher/Dispatcher');
var Constants     = require('../constants/Constants');
var EventEmitter  = require('events').EventEmitter;
var assign        = require('object-assign');
var router        = require('../router');

var ActionTypes   = Constants.ActionTypes;
var CHANGE_EVENT  = 'change';

var _currentID    = null;
var _threads      = {};
var _errorMessage = '';
var _errorCode    = '';
var _textError    = '';

var SessionStore  = assign({}, EventEmitter.prototype, {
  
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function(callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  isLoggedIn: function() {
    return (!(localStorage.getItem('nubity-token') == '' || !localStorage.getItem('nubity-token') || typeof(localStorage.getItem('nubity-token')) === 'undefined'));
  },

  getErrors: function() {
    return _errorMessage; 
  },

  getCodeError: function() {
    return _errorCode;
  },

  getTextError: function() {
    return _textError;
  },

  getAdminId: function() {
    return _adminID;
  },

  getAdminMail: function() {
    return _adminMail;
  },

  getAuthToken: function() {
    return localStorage.getItem('nubity-token');
  },

  setAuthToken: function(token) {
    localStorage.setItem('nubity-token', token);
  },

  getLinkOk: function() {
    return _linkOK;
  },

  resetLinkOk: function() {
    _linkOK = false;
  },

  logOut: function (argument) {
  }

});

SessionStore.dispatchToken = Dispatcher.register(function(payload) {

  var action = payload.action;

  switch (action.actionType) {

    case ActionTypes.LOGIN_RESPONSE:
      SessionStore.emitChange();
    break;

    case ActionTypes.ERROR:
      if (action.code == 401) {     
        router.transitionTo('login');
      }
      _textError = action.res;
      _errorCode = action.code;
      SessionStore.emitChange();
    break;

    case ActionTypes.LOGOUT:
      SessionStore.emitChange();
    break;
    
    case ActionTypes.REDIRECT:
      router.transitionTo(action.route);
    break;

    default:
      if (action.res != null && action.code != null && (action.code == 401)) {       
        router.transitionTo('login');
      }
      SessionStore.emitChange();
    break;
  }
  return true;
});

module.exports = SessionStore;
