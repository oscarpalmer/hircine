hircine = require "hircine"

ender._select = hircine

ender.ender({
  children: (selector) ->
    ender selector || "*", this
  find: (selector) ->
    ender selector, this
})