var getRouter;

getRouter = function(exportToAspen) {
  var Router, exportEvent, getEventHandler, isFunction, isOldIE, supportsHashChange, supportsPushState;
  exportEvent = function(key) {
    return function() {
      var capsule;
      capsule = {
        event: document.location[key],
        handler: 'onHashChange',
        label: 'hash'
      };
      if (isFunction(exportToAspen)) {
        return exportToAspen(capsule);
      }
    };
  };
  getEventHandler = function(fn, key) {
    if (fn === true) {
      return exportEvent(key);
    }
    if (isFunction(fn)) {
      return fn;
    }
  };
  isFunction = function(val) {
    return typeof val === 'function';
  };
  isOldIE = function() {
    var docMode, isExplorer;
    docMode = document.documentMode;
    isExplorer = /msie [\w.]+/;
    return isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7);
  };
  Router = function(config) {
    var onHashChange, onPopState;
    onHashChange = config.onHashChange, onPopState = config.onPopState;
    if (onHashChange && supportsHashChange()) {
      window.onhashchange = getEventHandler(onHashChange, 'hash');
    }
    if (onPopState && supportsPushState()) {
      return window.onpopstate = getEventHandler(onPopState, 'pathname');
    }
  };
  supportsHashChange = function() {
    return window.hasOwnProperty('onhashchange') && !isOldIE();
  };
  supportsPushState = function() {
    var history;
    return (history = window.history) && history.pushState;
  };
  return Router;
};

module.exports = getRouter;
