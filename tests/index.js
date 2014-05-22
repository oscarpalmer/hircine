var
assertion = 0;

function equal(a, b) {
  console.log((a === b ? "ok " : "not ok ") + (++ assertion));
}

console.log("TAP version 13");
console.log("1..1");

equal(hircine("h1").length, 1);