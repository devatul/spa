var Dispatcher    = require('../dispatcher/Dispatcher');
var Constants     = require('../constants/Constants');
var EventEmitter  = require('events').EventEmitter;
var assign        = require('object-assign');
var router        = require('../router');

var ActionTypes   = Constants.ActionTypes;
var CHANGE_EVENT  = 'change';

var _currentID      = null;
var _confirmMessage = '';
var _confirmCode    = '';
var _threads        = {};
var _signupMessage  = '';
var _errorMessage = '';
var _errorCode    = '';
var _textError    = '';
var _search       = '';
var _graphTypes   = '';
var _companyInfo  = '';

var SessionStore  = assign({}, EventEmitter.prototype, {
  
  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  isLoggedIn: function () {
    return (!('' == localStorage.getItem('nubity-token') || !localStorage.getItem('nubity-token') || 'undefined' === typeof(localStorage.getItem('nubity-token'))));
  },

  getErrors: function () {
    return _errorMessage; 
  },

  getCodeError: function () {
    return _errorCode;
  },

  getTextError: function () {
    return _textError;
  },

  getConfirmMessage: function () {
    return _confirmMessage;
  },

  getConfirmCode: function () {
    return _confirmCode;
  },

  getAuthToken: function () {
    return localStorage.getItem('nubity-token');
  },

  setAuthToken: function (token) {
    localStorage.setItem('nubity-token', token);
  },

  signupMessage: function () {
    return _signupMessage;
  },

  search: function () {
    return _search;
  },
  getAvailableGraphTypes: function () {
    return _graphTypes;
  },

  getCompanyInfo: function () {
    return _companyInfo;
  },

});

SessionStore.dispatchToken = Dispatcher.register(function (payload) {

  var action = payload.action;

  switch (action.actionType) {

    case ActionTypes.LOGIN_RESPONSE:
      SessionStore.emitChange();
      break;

    case ActionTypes.SHOW_SIGNUP_MESSAGE:
      _signupMessage = action.res;
      _textError = '';
      _errorCode = '';
      SessionStore.emitChange();
      break;

    case ActionTypes.SHOW_CONFIRM_MESSAGE:
      _confirmMessage = action.res;
      _confirmCode = action.code;
      SessionStore.emitChange();
      break;

    case ActionTypes.ERROR:
      if (401 == action.code) {     
        router.transitionTo('login');
      }
      _textError = action.res;
      _errorCode = action.code;
      SessionStore.emitChange();
      break;

    case ActionTypes.LOGOUT:
      localStorage.removeItem('nubity-token');
      localStorage.removeItem('nubity-refresh-token');
      SessionStore.emitChange();
      break;

    case ActionTypes.SEARCH:
      _search = action.res;
      _textError = '';
      _errorCode = '';
      SessionStore.emitChange();
      break;

    case ActionTypes.SHOW_AVAILABLE_GRAPH_TYPES:
      _graphTypes = action.res;
      _textError = '';
      _errorCode = '';
      SessionStore.emitChange();
      break;

    case ActionTypes.SHOW_COMPANY:
      _companyInfo = action.res;
      _textError = '';
      _errorCode = '';
      SessionStore.emitChange();
      break;
    
    case ActionTypes.REDIRECT:
      router.transitionTo(action.route);
      break;

    default:
      if (null != action.res && null!= action.code && (401 == action.code)) {       
        router.transitionTo('login');
      }
      SessionStore.emitChange();
      break;
  }
  return true;
});

module.exports = SessionStore;
