(function(name, context, definition){
  context[name] = definition();
})("hircine", this, function(){
  var
  win        = this,
  doc        = win.document,
  getByClass = "getElementsByClassName",
  getByTag   = "getElementsByTagName",
  getByQSA   = "querySelectorAll",
  length     = "length",
  nodeType   = "nodeType",
  htmlString = /^\s*<(\w+|!)[^>]*>/,
  quickFind  = /^(?:\w*\#([\w\-]+)|\.([\w\-]+)|(\w+))$/,
  hircine;

  /**
   * Get elements by class name.
   */
  function byClass(context, klass) {
    var
    results = [],
    elements;

    if (context[getByClass]) {
      return toArray(context[getByClass](klass));
    }

    elements = context[getByTag]("*");

    each(elements, function(element) {
      if (element.className.match(new RegExp("(\\s|^)" + klass + "(\\s|$)"))) {
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

    context = isNode(context) ? context.ownerDocument : context;
    element = context.getElementById(id);

    if (isNode(element) && element.parentNode && element.id === id) {
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
    } else if (isDoc(context) || isNode(context) || likeArray(context)) {
      return context;
    }

    return doc;
  }

  /**
   * Looper.
   */
  function each(obj, fn, scope) {
    var
    index  = 0,
    langd = obj[length];

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
    html = doc.createElement("div"),
    results = [];

    html.innerHTML = string;

    each(html.childNodes, function(node) {
      if (isNode(node)) {
        results.push(node);
      }
    });

    return results;
  }

  /**
   * Check if object is a document.
   */
  function isDoc(obj) {
    return typeof obj !== "undefined" && obj[nodeType] === 9;
  }

  /**
   * Check if object is a node (element).
   */
  function isNode(obj) {
    return typeof obj !== "undefined" && obj[nodeType] === 1;
  }

  /**
   * Check if object is a window.
   */
  function isWindow(obj) {
    return typeof obj !== "undefined" && obj === obj.window;
  }

  /**
   * Check if item already exists in object (array).
   */
  function indexOf(obj, item) {
    var
    index = 0,
    langd = obj[length];

    for (; index < langd; index++) {
      if (obj[index] === item) {
        return true;
      }
    }

    return false;
  }

  /**
   * Check if object is like an array.
   */
  function likeArray(obj) {
    return typeof obj !== "undefined" && (
           typeOf(obj) === "array" || (
           typeof obj !== "string" &&
           typeof obj[length] === "number" &&
           obj[length] - 1 in obj));
  }

  /**
   * Create a nice unique array from an existing one.
   */
  function toArray(obj) {
    var
    results = [];

    each(obj, function(item) {
      if (indexOf(results, item) !== true) {
        results.push(item);
      }
    });

    return results;
  }

  /**
   * Check type for object; somewhat better than typeof, but slightly slower.
   */
  function typeOf(variable) {
    return ({}).toString.call(variable).replace(/^\[\w+\s(\w+)\]$/, "$1").toLowerCase();
  }

  /** */

  /**
   * Find elements by selector and context.
   */
  hircine = function(selector, context) {
    var
    results = [],
    match;

    if (typeof selector === "undefined") {
      return results;
    }

    if (isDoc(selector) || isNode(selector) || isWindow(selector)) {
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

    if (typeof selector !== "string" || !isDoc(context) && !isNode(context)) {
      return results;
    }

    match = quickFind.exec(selector);

    if (match) {
      if (match[1]) {
        return byId(context, match[1]);
      } else if (match[2]) {
        return byClass(context, match[2]);
      } else if (match[3]) {
        return toArray(context[getByTag](match[3]));
      }
    }

    if (htmlString.exec(selector)) {
      return htmlify(selector);
    }

    if (context[getByQSA]) {
      return toArray(context[getByQSA](selector));
    }

    return results;
  };

  return hircine;
});