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
  function toArray(obj) {
    var
    array = [];

    [].forEach.call(obj, function(item) {
      if (array.indexOf(item) === -1) {
        array.push(item);
      }
    });

    return array;
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

      [].forEach.call(context, function(node) {
        result = result.concat(hircine(selector, node));
      });

      return result;
    }

    if (typeof selector !== "string" || !isNodeLike(context)) {
      return [];
    }

    if ((match = quick.exec(selector))) {
      if (match[1]) {
        return toArray(byId(context, match[1]));
      } else if (match[2]) {
        return toArray(context.getElementsByClassName(match[2]));
      } else if (match[3]) {
        return toArray(context.getElementsByTagName(match[3]));
      }
    }

    return toArray(context.querySelectorAll(selector));
  }

  return hircine;
});