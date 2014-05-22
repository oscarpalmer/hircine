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
  htmlString = /^\s*<(\w+|!)[^>]*>/,
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
      return hircine(context);
    } else if (isNodeLike(context)) {
      return context;
    }

    return doc;
  }

  /**
   * Looper.
   */
  function each(obj, fn, scope) {
    var
    index = 0,
    langd = obj.length;

    for (; index < langd; index++) {
      fn(obj[index], index);
    }

    return obj;
  }

  /**
   * Create real HTML from a string.
   */
  function htmlify(string) {
    var
    html    = doc.createElement("div"),
    results = [];

    html.innerHTML = string;

    each(html.childNodes, function(node) {
      if (isNodeLike(node)) {
        results.push(node);
      }
    });

    return results;
  }

  /**
   * Check if item exists in array.
   */
  function inArray(obj, item) {
    var
    index = 0,
    langd = obj.length;

    for (; index < langd; index++) {
      if (obj[index] === item) {
        return true;
      }
    }

    return false;
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
    results = [];

    each(obj, function(item) {
      if (inArray(results, item) !== true) {
        results.push(item);
      }
    });

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
    match;

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
      each(context, function(node) {
        results = results.concat(hircine(selector, node));
      });

      return toArray(results);
    }

    if ((typeof selector === "string" || isNodeLike(context)) === false) {
      return results;
    }

    match = quickFind.exec(selector);

    if (match) {
      if (match[1]) {
        return byId(context, match[1]);
      } else if (match[2] && context.getElementsByClassName) {
        return toArray(context.getElementsByClassName(match[2]));
      } else if (match[3]) {
        return toArray(context.getElementsByTagName(match[3]));
      }
    }

    if (htmlString.exec(selector)) {
      return htmlify(selector);
    }

    if (context.querySelectorAll) {
      return toArray(context.querySelectorAll(selector));
    }

    return results;
  };

  return Hircine;
});