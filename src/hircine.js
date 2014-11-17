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
  doc   = this.document,
  html  = /^\s*<([^\s>]+)/,
  quick = /^(?:\w*\#([\w\-]+)|\.([\w\-]+)|(\w+))$/;


  /**
   * Get element by ID.
   */
  function byId(context, id) {
    var
    element;

    context = context.nodeType === 1 ? context.ownerDocument : context;
    element = context.getElementById(id);

    return isNodeLike(element) && element.parentNode && element.id === id ? [element] : [];
  }

  /**
   * Define a context in which we search for nodes.
   */
  function defineContext(context) {
    if (typeof context === "undefined") {
      return doc;
    } else if (isNodeLike(context)) {
      return context;
    } else if (typeof context === "string") {
      return hircine(context);
    }

    return doc;
  }

  /**
   * Convert string to actual HTML.
   */
  function htmlify(string) {
    var
    div;

    div = doc.createElement("div");
    div.innerHTML = string;

    return [].slice.call(div.childNodes);
  }

  /**
   * Check if object is a node.
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
  function unique(obj) {
    var
    index  = 0,
    langd  = obj.length,
    result = [];

    for (; index < langd; index++) {
      if (result.indexOf(obj[index]) === -1) {
        result.push(obj[index]);
      }
    }

    return result;
  }

  /**
   * Find elements by selector and context.
   *
   * @param {*} selector
   * @param {*} context
   * @return {Array}
   */
  function hircine(selector, context) {
    var
    index,
    langd,
    match,
    result;

    if (isNodeLike(selector) || selector === selector.window) {
      return [selector];
    }

    if (likeArray(selector)) {
      return selector;
    }

    context = defineContext(context);

    if (likeArray(context)) {
      result = [];

      for (index = 0, langd = context.length; index < langd; index++) {
        result = result.concat(hircine(selector, context[index]));
      }

      return unique(result);
    }

    if (typeof selector !== "string" || isNodeLike(context) === false) {
      return [];
    }

    if (html.test(selector)) {
      return htmlify(selector);
    }

    if ((match = quick.exec(selector))) {
      if (match[1]) {
        return byId(context, match[1]);
      } else if (match[2]) {
        return unique(context.getElementsByClassName(match[2]));
      } else if (match[3]) {
        return unique(context.getElementsByTagName(match[3]));
      }
    }

    if (context.querySelectorAll) {
      return unique(context.querySelectorAll(selector));
    }

    return [];
  }

  return hircine;
});