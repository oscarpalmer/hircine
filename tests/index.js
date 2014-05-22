var
assertion = 0;

function equal(a, b) {
  console.log((a === b ? "ok " : "not ok ") + (++ assertion));
}

console.log("TAP version 13");
console.log("1..8");

// Regular searches.
equal(hircine("h1").length, 1);
equal(hircine("#bee").length, 1);
equal(hircine(".even").length, 2);
equal(hircine("p.even").length, 2);

// Searches in element.
equal(hircine("p", "article").length, 4);
equal(hircine("#bee", "article").length, 1);
equal(hircine(".even", "article").length, 2);
equal(hircine("p.even", "article").length, 2);