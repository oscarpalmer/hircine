(function() {
  var Hircine, byId, defineContext, doc, isNodeLike, likeArray, quick, toArray;

  doc = this.document;

  quick = /^(?:\w*\#([\w\-]+)|\.([\w\-]+)|(\w+))$/;

  byId = function(context, id) {
    var element;
    context = context.nodeType === 1 ? context.ownerDocument : context;
    element = context.getElementById(id);
    if (isNodeLike(element) && element.parentNode && element.id === id) {
      return [element];
    } else {
      return [];
    }
  };

  defineContext = function(context) {
    if (typeof context === "undefined") {
      return doc;
    } else if (typeof context === "string") {
      return Hircine(context);
    } else if (isNodeLike(context)) {
      return context;
    }
    return doc;
  };

  isNodeLike = function(obj) {
    return obj && (obj.nodeType === 1 || obj.nodeType === 9);
  };

  likeArray = function(obj) {
    return obj && typeof obj === "object" && typeof obj.length === "number";
  };

  toArray = function(obj) {
    var array, item, _i, _len;
    array = [];
    for (_i = 0, _len = obj.length; _i < _len; _i++) {
      item = obj[_i];
      if (array.indexOf(item) === -1) {
        array.push(item);
      }
    }
    return array;
  };

  Hircine = function(selector, context) {
    var match, node, result, _i, _len;
    if (typeof selector === "undefined") {
      return [];
    }
    if (isNodeLike(selector) || selector === selector.window) {
      return [selector];
    }
    if (likeArray(selector)) {
      return selector;
    }
    context = defineContext(context);
    if (likeArray(context)) {
      result = [];
      for (_i = 0, _len = context.length; _i < _len; _i++) {
        node = context[_i];
        result = result.concat(Hircine(selector, node));
      }
      return toArray(result);
    }
    if (typeof selector !== "string" || !isNodeLike(context)) {
      return [];
    }
    if ((match = quick.exec(selector))) {
      if (match[1]) {
        return byId(context, match[1]);
      }
      if (match[2]) {
        return toArray(context.getElementsByClassName(match[2]));
      }
      if (match[3]) {
        return toArray(context.getElementsByTagName(match[3]));
      }
    }
    return toArray(context.querySelectorAll(selector));
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = Hircine;
  } else if (typeof define === "function" && define.amd) {
    define(Hircine);
  } else {
    this.hircine = Hircine;
  }

}).call(this);
