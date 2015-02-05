'use strict';
var getRouteElement;

getRouteElement = function(exportToAspen) {
  var Route, changeRouteToHash, exportEvent, getCurrentHashRoute, getEventHandler, getEventValue, getLegacyConfig, handlers, history, isFunction, isPopStateEvent, isString, isViableHash, isViablePath, labels, manageHashRouting, managePathRouting, refusesHashRouting, setHash, setHashMonitoring, setPath, setPathHandler, supportsHashChange, supportsPushState, useIFrameAndPolling;
  if (typeof window === "undefined" || window === null) {
    return (function() {});
  }
  changeRouteToHash = function(route) {
    return '#' + route;
  };
  exportEvent = function(key) {
    return function(event) {
      var capsule;
      if (isFunction(exportToAspen)) {
        capsule = {
          event: getEventValue(event),
          handler: handlers[key],
          label: labels[key]
        };
        return exportToAspen(capsule);
      }
    };
  };
  getCurrentHashRoute = function(window) {
    var match;
    match = window.location.href.match(/#(.*)$/);
    if (match) {
      return match[1];
    } else {
      return '';
    }
  };
  getEventHandler = function(fn, key) {
    switch (false) {
      case !(fn === true):
        return exportEvent(key);
      case !(isFunction(fn)):
        return fn;
      default:
        return null;
    }
  };
  getEventValue = function(event) {
    if (isPopStateEvent(event)) {
      return event.state;
    } else {
      return getCurrentHashRoute(window);
    }
  };
  getLegacyConfig = function() {
    return {
      exportToAspen: exportToAspen,
      getCurrentHashRoute: getCurrentHashRoute,
      handler: handlers.hash,
      label: labels.hash,
      setHash: setHash
    };
  };
  isFunction = function(val) {
    return typeof val === 'function';
  };
  isPopStateEvent = function(event) {
    return event && event.state;
  };
  isString = function(val) {
    return Object.prototype.toString.call(val) === '[object String]';
  };
  isViableHash = function(route) {
    return isString(route) && route !== getCurrentHashRoute(window);
  };
  isViablePath = function(route) {
    return isString(route) && route !== window.location.pathname;
  };
  manageHashRouting = function(route, hashHandler) {
    if (isViableHash(route)) {
      setHash(route, window);
      return setHashMonitoring(hashHandler);
    }
  };
  managePathRouting = function(route, pathHandler) {
    if (isViablePath(route)) {
      setPath(route);
    }
    return setPathHandler(pathHandler);
  };
  refusesHashRouting = function(hash) {
    return !hash;
  };
  Route = function(config) {
    var hash, onHashChange, onPathChange, path;
    hash = config.hash, onHashChange = config.onHashChange, onPathChange = config.onPathChange, path = config.path;
    if (refusesHashRouting(hash) && supportsPushState) {
      return managePathRouting(path, onPathChange);
    } else {
      return manageHashRouting(hash, onHashChange);
    }
  };
  setHash = function(route, window) {
    if (window) {
      return window.location.hash = changeRouteToHash(route);
    }
  };
  setHashMonitoring = function(hashHandler) {
    if (supportsHashChange) {
      return window.onhashchange = getEventHandler(hashHandler, 'hash');
    } else {
      return useIFrameAndPolling();
    }
  };
  setPath = function(path) {
    return history.pushState(path, document.title, path);
  };
  setPathHandler = function(pathHandler) {
    return window.onpopstate = getEventHandler(pathHandler, 'pathname');
  };
  useIFrameAndPolling = function() {
    var getLegacySupport;
    getLegacySupport = require('./legacySupport');
    useIFrameAndPolling = getLegacySupport(getLegacyConfig());
    return useIFrameAndPolling();
  };
  handlers = {
    hash: 'onHashChange',
    pathname: 'onPathChange'
  };
  history = window.history;
  labels = {
    hash: 'Hash',
    pathname: 'Path'
  };
  supportsHashChange = !!('onhashchange' in window);
  supportsPushState = !!(history && history.pushState);
  return Route;
};

module.exports = getRouteElement;
