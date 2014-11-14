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
   * Get elements by class name.
   */
  function byClass(context, klass) {
    var
    index  = 0,
    result = [],
    elements,
    langd;

    if (context.getElementsByClassName) {
      return unique(context.getElementsByClassName(klass));
    }

    elements = context.getElementsByTagName("*");
    langd = elements.length;

    for (; index < langd; index++) {
      if (elements[index].className.match(new RegExp("(^|\\s)" + klass + "(\\s|$)"))) {
        result.push(elements[index]);
      }
    }

    return unique(result);
  }

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
   * Check if item exists in array.
   */
  function inArray(array, item) {
    var
    index = 0,
    langd = array.length;

    for (; index < langd; index++) {
      if (array[index] == item) {
        return true;
      }
    }

    return false;
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
      if (inArray(result, obj[index]) === false) {
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

    if ((match = quick.exec(selector))) {
      if (match[1]) {
        return byId(context, match[1]);
      } else if (match[2]) {
        return byClass(context, match[2]);
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