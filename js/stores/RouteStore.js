var Dispatcher        = require('../dispatcher/Dispatcher');
var Constants         = require('../constants/Constants');
var SessionStore      = require('../stores/SessionStore');
var EventEmitter      = require('events').EventEmitter;
var assign            = require('object-assign');

var ActionTypes = Constants.ActionTypes;
var CHANGE_EVENT = 'change';
var router = require('../router');

var RouteStore = assign({}, EventEmitter.prototype, {

  emitChange: function () {
    this.emit(CHANGE_EVENT);
  },

  addChangeListener: function (callback) {
    this.on(CHANGE_EVENT, callback);
  },

  removeChangeListener: function (callback) {
    this.removeListener(CHANGE_EVENT, callback);
  },

  getRouter: function () {
    return router;
  },
});


RouteStore.dispatchToken = Dispatcher.register(function (payload) {
  Dispatcher.waitFor([
    SessionStore.dispatchToken,
  ]);

  var action = payload.action;
  switch (action.actionType) {

    case ActionTypes.REDIRECT:
      router.transitionTo(action.route);
      RouteStore.emitChange();
      break;

    case ActionTypes.REDIRECT_WITH_PARAMS:
      if (SessionStore.isLoggedIn()) {
        router.transitionTo('');
      }
      RouteStore.emitChange();
      break;

    case ActionTypes.LOGOUT:
      router.transitionTo('login');
      break;
  }
  return true;
});

module.exports = RouteStore;
