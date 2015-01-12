/*global process, expect, beforeEach, afterEach, describe, it*/

describe('ace.ext.keys', function() {

  var ed;
  beforeEach(function() {
    ed = createEditor("this is a\ntest\n\ntext\n");
  });

  afterEach(function() {
    if (ed) {
      ed.destroy();
      ed.container.parentNode.removeChild(ed.container);
    }
  });

  describe("find command for key", function() {

    it("finds commands bound in key handler", function() {
      var run = false;
      var cmd = {name: "test-command", bindKey: "Alt-t", exec: function() { run = true; }};
      var keyHandler = new (ace.require("ace/keyboard/hash_handler")).HashHandler([cmd]);
      ed.setKeyboardHandler(keyHandler);
      expect(cmd).to.equal(ace.ext.keys.lookupKeys(ed, "Alt-t"));
      expect(run).to.equal(false);
    });

    it("finds commands bound in commands", function() {
      var cmd = {name: "test-command", bindKey: "Alt-t", exec: function() {}};
      ed.commands.addCommands([cmd])
      expect(cmd).to.equal(ace.ext.keys.lookupKeys(ed, "Alt-t"));
    });

  });

  describe("key input simulation", function() {

    var keys = ace.ext.keys, platform, commandKey;
    before(function() {
      platform = ed.commands.platform;
      commandKey = platform === 'mac' ? 'Command' : 'Control';
    })

    it("simulate simple input", function() {
        ed.setValue('foo\nbar'); ed.selection.clearSelection();
        ed.moveCursorToPosition({row: 1, column: 0});

        keys.simulateKey(ed, 'a');
        keys.simulateKey(ed, ' ');
        expect(ed).to.have.rangeAndContent(1,2,1,2, 'foo\na bar');
    });

    it("simulateKey select all", function() {
        ed.setValue('foo\nbar'); ed.moveCursorToPosition({row: 0, column: 0});
        ed.moveCursorToPosition({row: 1, column: 0});

        keys.simulateKey(ed, commandKey + '-a');
        expect(ed).to.have.rangeAndContent(0,0,1,3, 'foo\nbar');
    });

    it("simulateKey compound command", function() {
        ed.setValue('foo\nbar'); ed.moveCursorToPosition({row: 0, column: 0});

        keys.simulateKey(ed, 'Right');
        expect(ed).to.have.rangeAndContent(0,1,0,1, 'foo\nbar');

        keys.simulateKey(ed, 'Left');
        var selectToEndKeys = ed.commands.byName.selecttoend.bindKey[platform];
        keys.simulateKey(ed, selectToEndKeys);
        expect(ed).to.have.rangeAndContent(0,0,1,3, 'foo\nbar');

        ed.moveCursorToPosition({row: 0, column: 0});
        var dupKeys = ed.commands.byName.duplicateSelection.bindKey[platform];
        keys.simulateKey(ed, dupKeys);
        expect(ed).to.have.rangeAndContent(0,0,0,0, 'foo\nfoo\nbar');
    });

    it("simulate multiple keys at once", function() {
        ed.setValue(''); ed.moveCursorToPosition({row: 0, column: 0});
        keys.simulateKeys(ed, "h i  t h e e Left r");
        expect(ed).to.have.rangeAndContent(0,7,0,7, 'hi there');
    });

  });
  
  describe("key customization", function() {

    it("can defien new keybindings for exisiting commands", function() {
      var run = false;
      var cmd = {name: "test-command", exec: function() { run = true; }};
      ed.commands.addCommands([cmd]);
      ace.ext.keys.addKeyCustomizationLayer("test-layer", {"test-command": "alt-t"})
      expect(cmd).to.equal(ace.ext.keys.lookupKeys(ed, "Alt-t"));
      expect(ed.keyBinding.$handlers.length).to.equal(1);
    });

  })
});
