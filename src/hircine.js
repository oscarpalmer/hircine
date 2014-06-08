(function(name, context, definition){
  if (typeof module !== "undefined" && module.exports) {
    module.exports = definition();
  } else if (typeof define === "function" && define.amd) {
    define(definition);
  } else {
    context[name] = definition();
  }
})("hircine", this, function(){
  var
  win        = this,
  doc        = win.document,
  quickFind  = /^(?:\w*\#([\w\-]+)|\.([\w\-]+)|(\w+))$/,
  Hircine;

  /**
   * Get element by ID.
   */
  function byId(context, id) {
    var
    element;

    context = context.nodeType === 1 ? context.ownerDocument : context;
    element = context.getElementById(id);

    if (isNodeLike(element) && element.parentNode && element.id === id) {
      return [element];
    }

    return [];
  }

  /**
   * Define a context in which we search for elements.
   */
  function defineContext(context) {
    if (typeof context === "undefined") {
      return doc;
    } else if (typeof context === "string") {
      return Hircine(context);
    } else if (isNodeLike(context)) {
      return context;
    }

    return doc;
  }

  /**
   * Check if object is a node (element).
   */
  function isNodeLike(obj) {
    return obj && (obj.nodeType === 1 || obj.nodeType === 9);
  }

  /**
   * Check if object is like an array.
   */
  function likeArray(obj) {
    return obj && typeof obj === "object" && typeof obj.length === "number";
  }

  /**
   * Create a nice unique array from an existing one.
   */
  function toArray(obj) {
    var
    index   = 0,
    langd   = obj.length,
    results = [];

    for (; index < langd; index++) {
      if (results.indexOf(obj[index]) === -1) {
        results.push(obj[index]);
      }
    }

    return results;
  }

  /**
   * Find elements by selector and context.
   *
   * @param {*} selector
   * @param {*} context
   * @return {Array}
   */
  Hircine = function(selector, context) {
    var
    results = [],
    index,
    langd;

    if (typeof selector === "undefined") {
      return results;
    }

    if (isNodeLike(selector) || selector === selector.window) {
      return [selector];
    }

    if (likeArray(selector)) {
      return toArray(selector);
    }

    context = defineContext(context);

    if (likeArray(context)) {
      index = 0;
      langd = context.length;

      for (; index < langd; index++) {
        results = results.concat(Hircine(selector, context[index]));
      }

      return toArray(results);
    }

    if ((typeof selector === "string" || isNodeLike(context)) === false) {
      return results;
    }

    if ((match = quickFind.exec(selector))) {
      if (match[1]) {
        return byId(context, match[1]);
      } else if (match[2] && context.getElementsByClassName) {
        return toArray(context.getElementsByClassName(match[2]));
      } else if (match[3]) {
        return toArray(context.getElementsByTagName(match[3]));
      }
    }

    if (context.querySelectorAll) {
      return toArray(context.querySelectorAll(selector));
    }

    return results;
  };

  return Hircine;
});