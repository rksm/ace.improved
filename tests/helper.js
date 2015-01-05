function loadUncached(urls, thenDo) {
  if (!urls.length) { thenDo && thenDo(); return; }
  var url = urls.shift();
  var script = document.createElement('script');
  script.src = url + (url.indexOf('?') > -1 ? '&' : '?' + Date.now());
  document.head.appendChild(script);
  script.addEventListener('load', function() { loadUncached(urls, thenDo); });
}

chai.Assertion.prototype.selection = function(str) {
  var actual = String(this._obj.selection.getRange()).replace(/Range:/,"").replace(/\s*/g, "");
  var expected = str.replace(/Range:/).replace(/\s*/g, "");
  new chai.Assertion(actual).to.be.equal(expected);
}

function createEditorEl() {
  var div = document.createElement("div");
  div.setAttribute("id", "editor");
  div.style.position = "absolute";
  div.style.top = "0"; div.style.left = "0";
  div.style.width = "400px"; div.style.height = "400px";
  document.body.insertBefore(div, document.body.childNodes[0]);
  return div;
}

function createEditor(inittext, options) {
  options = options || {};
  var ed = ace.edit(createEditorEl());
  if (options.theme) ed.setTheme(options.theme);
  ed.getSession().setMode(options.mode || "ace/mode/text");
  ed.setValue(inittext);
  ed.selection.clearSelection()
  return ed;
}
