(function($){
  var
  hircine = require("hircine");

  $._select = hircine;

  $.ender({
    children: function(selector) {
      return $(selector || "*", this);
    },
    find: function(selector) {
      return $(selector, this);
    }
  }, true);
}(ender));