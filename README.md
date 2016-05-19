# ace.improved

This package extends the [ace editor](http://ace.c9.io/) with useful functionality such as:

# Usage

## Setup

## Interface

### Editor object

- `editor.posToIndex(pos) => index`

  Converts `pos`, a `{column: NUMBER, line: NUMBER}` object, into the string
  `index` / offset of `editor.getValue()`.

- `editor.idxToPos(index) => pos`
  The reverse of `posToIndex`.

- `editor.getCursorIndex() => index`
  Index of the current cursor position.

- `editor.setSelection(...) => Range`
  - `editor.setSelection(rangeString)`
    Sets the selection range via a descriptive string, such as
    `editor.setSelection("[0/2]->[0/4]")` or
    `editor.setSelection("[0/4]->[0/2]")`. The first number designates the row,
    the second the column.
  - `editor.setSelection(startIndex, endIndex)`
    Sets the selection range via a start and end index into the
    `editor.getValue()` string, example: `ed.setSelection(3,10)`.
  - `editor.setSelection(range)`
    Also accepts a ace range object:
    ```js
    var Range = ace.require("ace/range").Range;
    var r = new Range(1,2,3, 10);
    editor.setSelection(r)
    ```

- `editor.addSelection(...) => Range`
  Like `setSelection` but for multiple selection ranges.

- `editor.saveExcursion(doFunction)`
  Remembers the current selection state and calls `doFunction` with one
  argument, a reset function. `doFunction` can modify the selection state and
  is able to revert all selection changes by calling the reset function in turn.
  Example:
  ```js
  editor.saveExcursion(function(resetFunc) {
    editor.setSelection("[0/0]->[0/10]");
    setTimeout(function() { editor.setSelection("[0/0]->[0/10]"); }, 500);
    setTimeout(function() { editor.setSelection("[1/0]->[1/10]"); }, 1000);
    setTimeout(function() { editor.setSelection("[2/0]->[2/10]"); }, 1500);
    setTimeout(resetFunc, 2000);
  }
  ```

### ace.ext.keys

Some helpers around key handling: Simulating pressing keys and key sequences,
looking up key bindings, easily adding and removing new key bindings.

- `ace.ext.keys.lookupKeys(editor, keyString) => Command`
  Simulates inputing `keyString` into editor and records the editor command
  this invokes without running the command. Returns the command.
  (Editor commands are defined in `editor.keyBinding.$handlers`)
  Example:
  ```js
  ace.ext.keys.lookupKeys(ed, "Alt-Left")
  // => {
  //   name: "gotowordleft",
  //   bindKey: {mac: "Option-Left", win: "Ctrl-Left"},
  //   exec: function(e) {/*...*/},
  //   ...
  // }
  ```
# Development

# License

[MIT](LICENSE)
