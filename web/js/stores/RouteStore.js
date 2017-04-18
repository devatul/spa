var Dispatcher        = require('../dispatcher/Dispatcher');
var Constants         = require('../constants/Constants');
var SessionStore      = require('./SessionStore');
var AlertsStore       = require('./AlertsStore');
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
    AlertsStore.dispatchToken,
  ]);

  var action = payload.action;
  switch (action.actionType) {

    case ActionTypes.REDIRECT:
      router.transitionTo(action.route);
      RouteStore.emitChange();
      break;

    case ActionTypes.REDIRECT_WITH_PARAMS:
      router.transitionTo(action.route, {id: action.param});
      RouteStore.emitChange();
      break;

    case ActionTypes.CREATE_ALERT_TICKET:
      router.transitionTo('create_ticket');
      RouteStore.emitChange();
      break;

    case ActionTypes.VIEW_TICKET:
      router.transitionTo('view_ticket');
      RouteStore.emitChange();
      break;

    case ActionTypes.LOGOUT:
      router.transitionTo('login');
      break;
  }
  return true;
});

module.exports = RouteStore;
