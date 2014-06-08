(function() {
  var hircine;

  hircine = require("hircine");

  ender._select = hircine;

  ender.ender({
    children: function(selector) {
      return ender(selector || "*", this);
    },
    find: function(selector) {
      return ender(selector, this);
    }
  });

}).call(this);
