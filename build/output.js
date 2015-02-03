!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.ReactiveAspenRoute=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
'use strict';
var getRouteElement;

getRouteElement = function(exportToAspen) {
  var ObjProto, Route, changeRouteToHash, exportEvent, getCurrentHashRoute, getEventHandler, getEventValue, getLegacyConfig, handlers, hashPrefix, hashRegex, history, isFunction, isPopStateEvent, isString, isViableHash, isViablePath, labels, location, manageHashRouting, managePathRouting, refusesHashRouting, setHash, setHashMonitoring, setPath, setPathHandler, stringIdentifier, supportsHashChange, supportsPushState, title, useIFrameAndPolling;
  if (typeof window === "undefined" || window === null) {
    return (function() {});
  }
  changeRouteToHash = function(route) {
    return hashPrefix + route;
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
    match = window.location.href.match(hashRegex);
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
    return ObjProto.toString.call(val) === stringIdentifier;
  };
  isViableHash = function(route) {
    return isString(route) && route !== getCurrentHashRoute(window);
  };
  isViablePath = function(route) {
    return isString(route) && route !== location.pathname;
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
    return history.pushState(path, title, path);
  };
  setPathHandler = function(pathHandler) {
    return window.onpopstate = getEventHandler(pathHandler, 'pathname');
  };
  useIFrameAndPolling = function() {
    var getLegacySupport;
    getLegacySupport = _dereq_('./legacySupport');
    useIFrameAndPolling = getLegacySupport(getLegacyConfig());
    return useIFrameAndPolling();
  };
  handlers = {
    hash: 'onHashChange',
    pathname: 'onPathChange'
  };
  hashPrefix = '#';
  hashRegex = /#(.*)$/;
  history = window.history;
  labels = {
    hash: 'Hash',
    pathname: 'Path'
  };
  location = document.location;
  ObjProto = Object.prototype;
  stringIdentifier = '[object String]';
  supportsHashChange = !!('onhashchange' in window);
  supportsPushState = !!(history && history.pushState);
  title = document.title;
  return Route;
};

module.exports = getRouteElement;



},{"./legacySupport":2}],2:[function(_dereq_,module,exports){
'use strict';
var getLegacySupport;

getLegacySupport = function(config) {
  var cachedRoute, checkHash, checkHashInterval, createIFrame, exportHash, exportToAspen, getCurrentHashRoute, handler, interval, isCached, isStale, label, navigateAndExport, navigateTo, pollingStarted, setHash, setIFrameHash, startPolling, useIFrameAndPolling;
  exportToAspen = config.exportToAspen, getCurrentHashRoute = config.getCurrentHashRoute, handler = config.handler, label = config.label, setHash = config.setHash;
  cachedRoute = null;
  checkHashInterval = null;
  pollingStarted = false;
  checkHash = function(iframe) {
    return function() {
      var iframeRoute, route;
      route = getCurrentHashRoute(window);
      console.log('checkHash cachedRoute: ', cachedRoute, ' route: ', route);
      if (isCached(route)) {
        iframeRoute = getCurrentHashRoute(iframe);
        if (!isCached(iframeRoute)) {
          return navigateAndExport(iframeRoute, iframe);
        }
      } else {
        return navigateAndExport(route, iframe);
      }
    };
  };
  createIFrame = function(route) {
    var $iframe, body, iframe;
    iframe = document.createElement('iframe');
    iframe.src = 'javascript:0';
    iframe.style.display = 'none';
    iframe.tabIndex = -1;
    body = document.body;
    $iframe = body.insertBefore(iframe, body.firstChild).contentWindow;
    $iframe.document.open().close();
    setHash(route, $iframe);
    return $iframe;
  };
  exportHash = function() {
    var event;
    event = getCurrentHashRoute(window);
    console.log('exportHash event: ', event);
    return exportToAspen({
      event: event,
      handler: handler,
      label: label
    });
  };
  isCached = function(route) {
    return route === cachedRoute;
  };
  isStale = function(route, iframe) {
    return route === getCurrentHashRoute(iframe);
  };
  navigateTo = function(route, iframe) {
    cachedRoute = route;
    setHash(route, window);
    if (!isStale(route, iframe)) {
      return setIFrameHash(iframe, route);
    }
  };
  navigateAndExport = function(route, iframe) {
    navigateTo(route, iframe);
    return exportHash();
  };
  setIFrameHash = function(iframe, route) {
    iframe.document.open().close();
    return setHash(route, iframe);
  };
  startPolling = function(iframe) {
    checkHashInterval = setInterval(checkHash(iframe), interval);
    return pollingStarted = true;
  };
  useIFrameAndPolling = function() {
    var iframe;
    if (!pollingStarted) {
      cachedRoute = getCurrentHashRoute(window);
      iframe = createIFrame(cachedRoute);
      return startPolling(iframe);
    }
  };
  interval = 50;
  return useIFrameAndPolling;
};

module.exports = getLegacySupport;



},{}]},{},[1])(1)
});
