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
