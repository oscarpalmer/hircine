doc   = this.document
quick = /^(?:\w*\#([\w\-]+)|\.([\w\-]+)|(\w+))$/

byId = (context, id) ->
  context = if context.nodeType is 1 then context.ownerDocument else context
  element = context.getElementById id
  if isNodeLike(element) and element.parentNode and element.id is id then [element] else []

defineContext = (context) ->
  if typeof context is "undefined"
    return doc
  else if typeof context is "string"
    return Hircine context
  else if isNodeLike(context)
    return context
  doc

isNodeLike = (obj) ->
  obj and (obj.nodeType is 1 || obj.nodeType is 9)

likeArray = (obj) ->
  obj and typeof obj is "object" and typeof obj.length is "number"

toArray = (obj) ->
  array = []
  (array.push(item) if array.indexOf(item) is -1) for item in obj
  array

Hircine = (selector, context) ->
  return [] if typeof selector is "undefined"

  return [selector] if isNodeLike(selector) or selector is selector.window

  return selector if likeArray(selector)

  context = defineContext context

  if likeArray(context)
    result = []
    (result = result.concat(Hircine(selector, node))) for node in context
    return toArray(result)

  return [] if typeof selector isnt "string" or not isNodeLike(context)

  if (match = quick.exec(selector))
    return byId(context, match[1]) if match[1]
    return toArray(context.getElementsByClassName(match[2])) if match[2]
    return toArray(context.getElementsByTagName(match[3])) if match[3]

  toArray context.querySelectorAll(selector)

if typeof module isnt "undefined" and module.exports
  module.exports = Hircine
else if typeof define is "function" and define.amd
  define Hircine
else
  this.hircine = Hircine