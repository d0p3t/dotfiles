function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

var _atom = require('atom');

var _jasmineFix = require('jasmine-fix');

var _libEditor = require('../lib/editor');

var _libEditor2 = _interopRequireDefault(_libEditor);

var _helpers = require('./helpers');

describe('Editor', function () {
  var editor = undefined;
  var message = undefined;
  var textEditor = undefined;

  (0, _jasmineFix.beforeEach)(_asyncToGenerator(function* () {
    message = (0, _helpers.getMessage)();
    message.range = [[2, 0], [2, 1]];
    message.filePath = __filename;
    yield atom.workspace.open(__filename);
    textEditor = atom.workspace.getActiveTextEditor();
    editor = new _libEditor2['default'](textEditor);
    atom.packages.loadPackage('linter-ui-default');
  }));
  afterEach(function () {
    editor.dispose();
    atom.workspace.destroyActivePaneItem();
  });

  describe('apply', function () {
    it('applies the messages to the editor', function () {
      expect(textEditor.getBuffer().getMarkerCount()).toBe(0);
      editor.apply([message], []);
      expect(textEditor.getBuffer().getMarkerCount()).toBe(1);
      editor.apply([], [message]);
      expect(textEditor.getBuffer().getMarkerCount()).toBe(0);
    });
    it('makes sure that the message is updated if text is manipulated', function () {
      expect(textEditor.getBuffer().getMarkerCount()).toBe(0);
      editor.apply([message], []);
      expect(textEditor.getBuffer().getMarkerCount()).toBe(1);
      expect(_atom.Range.fromObject(message.range)).toEqual({ start: { row: 2, column: 0 }, end: { row: 2, column: 1 } });
      textEditor.getBuffer().insert([2, 0], 'Hello');
      expect(_atom.Range.fromObject(message.range)).toEqual({ start: { row: 2, column: 0 }, end: { row: 2, column: 6 } });
      editor.apply([], [message]);
      expect(_atom.Range.fromObject(message.range)).toEqual({ start: { row: 2, column: 0 }, end: { row: 2, column: 6 } });
      expect(textEditor.getBuffer().getMarkerCount()).toBe(0);
    });
  });
  describe('Response to config', function () {
    it('responds to `gutterPosition`', function () {
      atom.config.set('linter-ui-default.gutterPosition', 'Left');
      expect(editor.gutter && editor.gutter.priority).toBe(-100);
      atom.config.set('linter-ui-default.gutterPosition', 'Right');
      expect(editor.gutter && editor.gutter.priority).toBe(100);
    });
    it('responds to `showDecorations`', function () {
      atom.config.set('linter-ui-default.showDecorations', false);
      expect(editor.gutter).toBe(null);
      atom.config.set('linter-ui-default.showDecorations', true);
      expect(editor.gutter).not.toBe(null);
    });
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3JlbWNvLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L3NwZWMvZWRpdG9yLXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7OztvQkFFc0IsTUFBTTs7MEJBQ0QsYUFBYTs7eUJBQ3JCLGVBQWU7Ozs7dUJBQ1AsV0FBVzs7QUFFdEMsUUFBUSxDQUFDLFFBQVEsRUFBRSxZQUFXO0FBQzVCLE1BQUksTUFBTSxZQUFBLENBQUE7QUFDVixNQUFJLE9BQU8sWUFBQSxDQUFBO0FBQ1gsTUFBSSxVQUFVLFlBQUEsQ0FBQTs7QUFFZCxnREFBVyxhQUFpQjtBQUMxQixXQUFPLEdBQUcsMEJBQVksQ0FBQTtBQUN0QixXQUFPLENBQUMsS0FBSyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUNoQyxXQUFPLENBQUMsUUFBUSxHQUFHLFVBQVUsQ0FBQTtBQUM3QixVQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO0FBQ3JDLGNBQVUsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUE7QUFDakQsVUFBTSxHQUFHLDJCQUFXLFVBQVUsQ0FBQyxDQUFBO0FBQy9CLFFBQUksQ0FBQyxRQUFRLENBQUMsV0FBVyxDQUFDLG1CQUFtQixDQUFDLENBQUE7R0FDL0MsRUFBQyxDQUFBO0FBQ0YsV0FBUyxDQUFDLFlBQVc7QUFDbkIsVUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFBO0FBQ2hCLFFBQUksQ0FBQyxTQUFTLENBQUMscUJBQXFCLEVBQUUsQ0FBQTtHQUN2QyxDQUFDLENBQUE7O0FBRUYsVUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFXO0FBQzNCLE1BQUUsQ0FBQyxvQ0FBb0MsRUFBRSxZQUFXO0FBQ2xELFlBQU0sQ0FBQyxVQUFVLENBQUMsU0FBUyxFQUFFLENBQUMsY0FBYyxFQUFFLENBQUMs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LENBQUMsTUFBTSxJQUFJLE1BQU0sQ0FBQyxNQUFNLENBQUMsUUFBUSxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFBO0tBQzFELENBQUMsQ0FBQTtBQUNGLE1BQUUsQ0FBQywrQkFBK0IsRUFBRSxZQUFXO0FBQzdDLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLEtBQUssQ0FBQyxDQUFBO0FBQzNELFlBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFBO0FBQ2hDLFVBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLG1DQUFtQyxFQUFFLElBQUksQ0FBQyxDQUFBO0FBQzFELFlBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQTtLQUNyQyxDQUFDLENBQUE7R0FDSCxDQUFDLENBQUE7Q0FDSCxDQUFDLENBQUEiLCJmaWxlIjoiL2hvbWUvcmVtY28vLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvc3BlYy9lZGl0b3Itc3BlYy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIEBmbG93ICovXG5cbmltcG9ydCB7IFJhbmdlIH0gZnJvbSAnYXRvbSdcbmltcG9ydCB7IGJlZm9yZUVhY2ggfSBmcm9tICdqYXNtaW5lLWZpeCdcbmltcG9ydCBFZGl0b3IgZnJvbSAnLi4vbGliL2VkaXRvcidcbmltcG9ydCB7IGdldE1lc3NhZ2UgfSBmcm9tICcuL2hlbHBlcnMnXG5cbmRlc2NyaWJlKCdFZGl0b3InLCBmdW5jdGlvbigpIHtcbiAgbGV0IGVkaXRvclxuICBsZXQgbWVzc2FnZVxuICBsZXQgdGV4dEVkaXRvclxuXG4gIGJlZm9yZUVhY2goYXN5bmMgZnVuY3Rpb24oKSB7XG4gICAgbWVzc2FnZSA9IGdldE1lc3NhZ2UoKVxuICAgIG1lc3NhZ2UucmFuZ2UgPSBbWzIsIDBdLCBbMiwgMV1dXG4gICAgbWVzc2FnZS5maWxlUGF0aCA9IF9fZmlsZW5hbWVcbiAgICBhd2FpdCBhdG9tLndvcmtzcGFjZS5vcGVuKF9fZmlsZW5hbWUpXG4gICAgdGV4dEVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKVxuICAgIGVkaXRvciA9IG5ldyBFZGl0b3IodGV4dEVkaXRvcilcbiAgICBhdG9tLnBhY2thZ2VzLmxvYWRQYWNrYWdlKCdsaW50ZXItdWktZGVmYXVsdCcpXG4gIH0pXG4gIGFmdGVyRWFjaChmdW5jdGlvbigpIHtcbiAgICBlZGl0b3IuZGlzcG9zZSgpXG4gICAgYXRvbS53b3Jrc3BhY2UuZGVzdHJveUFjdGl2ZVBhbmVJdGVtKClcbiAgfSlcblxuICBkZXNjcmliZSgnYXBwbHknLCBmdW5jdGlvbigpIHtcbiAgICBpdCgnYXBwbGllcyB0aGUgbWVzc2FnZXMgdG8gdGhlIGVkaXRvcicsIGZ1bmN0aW9uKCkge1xuICAgICAgZXhwZWN0KHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0TWFya2VyQ291bnQoKSkudG9CZSgwKVxuICAgICAgZWRpdG9yLmFwcGx5KFttZXNzYWdlXSwgW10pXG4gICAgICBleHBlY3QodGV4dEVkaXRvci5nZXRCdWZmZXIoKS5nZXRNYXJrZXJDb3VudCgpKS50b0JlKDEpXG4gICAgICBlZGl0b3IuYXBwbHkoW10sIFttZXNzYWdlXSlcbiAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmdldE1hcmtlckNvdW50KCkpLnRvQmUoMClcbiAgICB9KVxuICAgIGl0KCdtYWtlcyBzdXJlIHRoYXQgdGhlIG1lc3NhZ2UgaXMgdXBkYXRlZCBpZiB0ZXh0IGlzIG1hbmlwdWxhdGVkJywgZnVuY3Rpb24oKSB7XG4gICAgICBleHBlY3QodGV4dEVkaXRvci5nZXRCdWZmZXIoKS5nZXRNYXJrZXJDb3VudCgpKS50b0JlKDApXG4gICAgICBlZGl0b3IuYXBwbHkoW21lc3NhZ2VdLCBbXSlcbiAgICAgIGV4cGVjdCh0ZXh0RWRpdG9yLmdldEJ1ZmZlcigpLmdldE1hcmtlckNvdW50KCkpLnRvQmUoMSlcbiAgICAgIGV4cGVjdChSYW5nZS5mcm9tT2JqZWN0KG1lc3NhZ2UucmFuZ2UpKS50b0VxdWFsKHsgc3RhcnQ6IHsgcm93OiAyLCBjb2x1bW46IDAgfSwgZW5kOiB7IHJvdzogMiwgY29sdW1uOiAxIH0gfSlcbiAgICAgIHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuaW5zZXJ0KFsyLCAwXSwgJ0hlbGxvJylcbiAgICAgIGV4cGVjdChSYW5nZS5mcm9tT2JqZWN0KG1lc3NhZ2UucmFuZ2UpKS50b0VxdWFsKHsgc3RhcnQ6IHsgcm93OiAyLCBjb2x1bW46IDAgfSwgZW5kOiB7IHJvdzogMiwgY29sdW1uOiA2IH0gfSlcbiAgICAgIGVkaXRvci5hcHBseShbXSwgW21lc3NhZ2VdKVxuICAgICAgZXhwZWN0KFJhbmdlLmZyb21PYmplY3QobWVzc2FnZS5yYW5nZSkpLnRvRXF1YWwoeyBzdGFydDogeyByb3c6IDIsIGNvbHVtbjogMCB9LCBlbmQ6IHsgcm93OiAyLCBjb2x1bW46IDYgfSB9KVxuICAgICAgZXhwZWN0KHRleHRFZGl0b3IuZ2V0QnVmZmVyKCkuZ2V0TWFya2VyQ291bnQoKSkudG9CZSgwKVxuICAgIH0pXG4gIH0pXG4gIGRlc2NyaWJlKCdSZXNwb25zZSB0byBjb25maWcnLCBmdW5jdGlvbigpIHtcbiAgICBpdCgncmVzcG9uZHMgdG8gYGd1dHRlclBvc2l0aW9uYCcsIGZ1bmN0aW9uKCkge1xuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5ndXR0ZXJQb3NpdGlvbicsICdMZWZ0JylcbiAgICAgIGV4cGVjdChlZGl0b3IuZ3V0dGVyICYmIGVkaXRvci5ndXR0ZXIucHJpb3JpdHkpLnRvQmUoLTEwMClcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuZ3V0dGVyUG9zaXRpb24nLCAnUmlnaHQnKVxuICAgICAgZXhwZWN0KGVkaXRvci5ndXR0ZXIgJiYgZWRpdG9yLmd1dHRlci5wcmlvcml0eSkudG9CZSgxMDApXG4gICAgfSlcbiAgICBpdCgncmVzcG9uZHMgdG8gYHNob3dEZWNvcmF0aW9uc2AnLCBmdW5jdGlvbigpIHtcbiAgICAgIGF0b20uY29uZmlnLnNldCgnbGludGVyLXVpLWRlZmF1bHQuc2hvd0RlY29yYXRpb25zJywgZmFsc2UpXG4gICAgICBleHBlY3QoZWRpdG9yLmd1dHRlcikudG9CZShudWxsKVxuICAgICAgYXRvbS5jb25maWcuc2V0KCdsaW50ZXItdWktZGVmYXVsdC5zaG93RGVjb3JhdGlvbnMnLCB0cnVlKVxuICAgICAgZXhwZWN0KGVkaXRvci5ndXR0ZXIpLm5vdC50b0JlKG51bGwpXG4gICAgfSlcbiAgfSlcbn0pXG4iXX0=