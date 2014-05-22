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
   * Get elements by class name.
   */
  function byClass(context, klass) {
    var
    results = [],
    elements;

    if (context.getElementsByClassName) {
      return toArray(context.getElementsByClassName(klass));
    }

    elements = context.getElementsByTagName("*");

    each(elements, function(element) {
      if (element.className.match(new RegExp("(^|\\s)" + klass + "(\\s|$)"))) {
        results.push(element);
      }
    });

    return toArray(results);
  }

  /**
   * Get elements by ID.
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
      fn.call(scope || obj[index], obj[index], index, obj);
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
    return obj && (obj.nodeType === 1 || obj.nodeType === 9 || obj === obj.window);
  }

  /**
   * Check if object is like an array.
   */
  function likeArray(obj) {
    return obj && (
           obj instanceof Array || (
           typeof obj !== "string" &&
           typeof obj.length === "number" &&
           obj.length - 1 in obj));
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
   */
  Hircine = function(selector, context) {
    var
    results = [],
    match;

    if (typeof selector === "undefined") {
      return results;
    }

    if (isNodeLike(selector)) {
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

    if (typeof selector !== "string" || !isNodeLike(context)) {
      return results;
    }

    match = quickFind.exec(selector);

    if (match) {
      if (match[1]) {
        return byId(context, match[1]);
      } else if (match[2]) {
        return byClass(context, match[2]);
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