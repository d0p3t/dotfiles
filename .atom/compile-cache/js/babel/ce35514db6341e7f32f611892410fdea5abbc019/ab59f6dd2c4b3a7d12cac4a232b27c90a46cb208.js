'use babel';

var _ref = [];
var workspaceElement = _ref[0];
var editor = _ref[1];
var editorElement = _ref[2];
var pack = _ref[3];

var path = require('path');

function sharedSetup() {

  atom.project.setPaths([path.join(__dirname, 'fixtures')]);
  workspaceElement = atom.views.getView(atom.workspace);

  waitsForPromise(function () {

    return new Promise(function (resolve, reject) {

      atom.workspace.open('test.js').then(function () {

        pack = atom.packages.enablePackage('atom-ternjs');

        resolve();
      });
    });
  });

  runs(function () {

    editor = atom.workspace.getActiveTextEditor();
    editorElement = atom.views.getView(editor);
  });
}

describe('atom-ternjs', function () {

  beforeEach(function () {

    sharedSetup(true);
  });

  describe('activate()', function () {

    it('activates the atom-ternjs-manager', function () {

      expect(pack.config).toBeDefined();
    });
  });

  describe('deactivate()', function () {

    beforeEach(function () {

      editor.setCursorBufferPosition([4, 15]);
      atom.packages.deactivatePackage('atom-ternjs');
    });

    it('destroys all views', function () {

      expect(workspaceElement.querySelectorAll('atom-ternjs-reference').length).toBe(0);
      expect(workspaceElement.querySelectorAll('atom-ternjs-rename').length).toBe(0);
      expect(workspaceElement.querySelectorAll('.atom-ternjs-config').length).toBe(0);
      expect(workspaceElement.querySelectorAll('atom-ternjs-documentation').length).toBe(0);
      expect(workspaceElement.querySelectorAll('atom-ternjs-type').length).toBe(0);
      expect(editorElement.querySelectorAll('atom-text-editor .atom-ternjs-definition-marker').length).toBe(0);
    });
  });
});

describe('atom-ternjs', function () {

  beforeEach(function () {

    sharedSetup(false);
  });

  describe('activate()', function () {});
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3JlbWNvLy5hdG9tL3BhY2thZ2VzL2F0b20tdGVybmpzL3NwZWMvYXRvbS10ZXJuanMtc3BlYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQSxXQUFXLENBQUE7O1dBRTJDLEVBQUU7SUFBbkQsZ0JBQWdCO0lBQUUsTUFBTTtJQUFFLGFBQWE7SUFBRSxJQUFJOztBQUNsRCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7O0FBRTNCLFNBQVMsV0FBVyxHQUFHOztBQUVyQixNQUFJLENBQUMsT0FBTyxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUyxFQUFFLFVBQVUsQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMxRCxrQkFBZ0IsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7O0FBRXRELGlCQUFlLENBQUMsWUFBTTs7QUFFcEIsV0FBTyxJQUFJLE9BQU8sQ0FBQyxVQUFDLE9BQU8sRUFBRSxNQUFNLEVBQUs7O0FBRXRDLFVBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUM3QixJQUFJLENBQUMsWUFBTTs7QUFFVixZQUFJLEdBQUcsSUFBSSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLENBQUM7O0FBRWxELGVBQU8sRUFBRSxDQUFDO09BQ1gsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0osQ0FBQyxDQUFDOztBQUVILE1BQUksQ0FBQyxZQUFNOztBQUVULFVBQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLG1CQUFtQixFQUFFLENBQUM7QUFDOUMsaUJBQWEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUM1QyxDQUFDLENBQUM7Q0FDSjs7QUFFRCxRQUFRLENBQUMsYUFBYSxFQUFFLFlBQU07O0FBRTVCLFlBQVUsQ0FBQyxZQUFNOztBQUVmLGVBQVcsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNuQixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLFlBQVksRUFBRSxZQUFNOztBQUUzQixNQUFFLENBQUMsbUNBQW1DLEVBQUUsWUFBTTs7QUFFNUMsWUFBTSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQyxXQUFXLEVBQUUsQ0FBQztLQUNuQyxDQUFDLENBQUM7R0FDSixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLGNBQWMsRUFBRSxZQUFNOztBQUU3QixjQUFVLENBQUMsWUFBTTs7QUFFZixZQUFNLENBQUMsdUJBQXVCLENBQUMsQ0FBQyxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQztBQUN4QyxVQUFJLENBQUMsUUFBUSxDQUFDLGlCQUFpQixDQUFDLGFBQWEsQ0FBQyxDQUFDO0tBQ2hELENBQUMsQ0FBQzs7QUFFSCxNQUFFLENBQUMsb0JBQW9CLEVBQUUsWUFBTTs7QUFFN0IsWUFBTSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLHVCQUF1QixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ2xGLFlBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUMvRSxZQUFNLENBQUMsZ0JBQWdCLENBQUMsZ0JBQWdCLENBQUMscUJBQXFCLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDaEYsWUFBTSxDQUFDLGdCQUFnQixDQUFDLGdCQUFnQixDQUFDLDJCQUEyQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBQ3RGLFlBQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxnQkFBZ0IsQ0FBQyxrQkFBa0IsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUM3RSxZQUFNLENBQUMsYUFBYSxDQUFDLGdCQUFnQixDQUFDLGlEQUFpRCxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzFHLENBQUMsQ0FBQztHQUNKLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQzs7QUFFSCxRQUFRLENBQUMsYUFBYSxFQUFFLFlBQU07O0FBRTVCLFlBQVUsQ0FBQyxZQUFNOztBQUVmLGVBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNwQixDQUFDLENBQUM7O0FBRUgsVUFBUSxDQUFDLFlBQVksRUFBRSxZQUFNLEVBRzVCLENBQUMsQ0FBQztDQUNKLENBQUMsQ0FBQyIsImZpbGUiOiIvaG9tZS9yZW1jby8uYXRvbS9wYWNrYWdlcy9hdG9tLXRlcm5qcy9zcGVjL2F0b20tdGVybmpzLXNwZWMuanMiLCJzb3VyY2VzQ29udGVudCI6WyIndXNlIGJhYmVsJ1xuXG5sZXQgW3dvcmtzcGFjZUVsZW1lbnQsIGVkaXRvciwgZWRpdG9yRWxlbWVudCwgcGFja10gPSBbXTtcbmxldCBwYXRoID0gcmVxdWlyZSgncGF0aCcpO1xuXG5mdW5jdGlvbiBzaGFyZWRTZXR1cCgpIHtcblxuICBhdG9tLnByb2plY3Quc2V0UGF0aHMoW3BhdGguam9pbihfX2Rpcm5hbWUsICdmaXh0dXJlcycpXSk7XG4gIHdvcmtzcGFjZUVsZW1lbnQgPSBhdG9tLnZpZXdzLmdldFZpZXcoYXRvbS53b3Jrc3BhY2UpO1xuXG4gIHdhaXRzRm9yUHJvbWlzZSgoKSA9PiB7XG5cbiAgICByZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXG4gICAgICBhdG9tLndvcmtzcGFjZS5vcGVuKCd0ZXN0LmpzJylcbiAgICAgIC50aGVuKCgpID0+IHtcblxuICAgICAgICBwYWNrID0gYXRvbS5wYWNrYWdlcy5lbmFibGVQYWNrYWdlKCdhdG9tLXRlcm5qcycpO1xuXG4gICAgICAgIHJlc29sdmUoKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcblxuICBydW5zKCgpID0+IHtcblxuICAgIGVkaXRvciA9IGF0b20ud29ya3NwYWNlLmdldEFjdGl2ZVRleHRFZGl0b3IoKTtcbiAgICBlZGl0b3JFbGVtZW50ID0gYXRvbS52aWV3cy5nZXRWaWV3KGVkaXRvcik7XG4gIH0pO1xufVxuXG5kZXNjcmliZSgnYXRvbS10ZXJuanMnLCAoKSA9PiB7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG5cbiAgICBzaGFyZWRTZXR1cCh0cnVlKTtcbiAgfSk7XG5cbiAgZGVzY3JpYmUoJ2FjdGl2YXRlKCknLCAoKSA9PiB7XG5cbiAgICBpdCgnYWN0aXZhdGVzIHRoZSBhdG9tLXRlcm5qcy1tYW5hZ2VyJywgKCkgPT4ge1xuXG4gICAgICBleHBlY3QocGFjay5jb25maWcpLnRvQmVEZWZpbmVkKCk7XG4gICAgfSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdkZWFjdGl2YXRlKCknLCAoKSA9PiB7XG5cbiAgICBiZWZvcmVFYWNoKCgpID0+IHtcblxuICAgICAgZWRpdG9yLnNldEN1cnNvckJ1ZmZlclBvc2l0aW9uKFs0LCAxNV0pO1xuICAgICAgYXRvbS5wYWNrYWdlcy5kZWFjdGl2YXRlUGFja2FnZSgnYXRvbS10ZXJuanMnKTtcbiAgICB9KTtcblxuICAgIGl0KCdkZXN0cm95cyBhbGwgdmlld3MnLCAoKSA9PiB7XG5cbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2F0b20tdGVybmpzLXJlZmVyZW5jZScpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2F0b20tdGVybmpzLXJlbmFtZScpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgIGV4cGVjdCh3b3Jrc3BhY2VFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5hdG9tLXRlcm5qcy1jb25maWcnKS5sZW5ndGgpLnRvQmUoMCk7XG4gICAgICBleHBlY3Qod29ya3NwYWNlRWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKCdhdG9tLXRlcm5qcy1kb2N1bWVudGF0aW9uJykubGVuZ3RoKS50b0JlKDApO1xuICAgICAgZXhwZWN0KHdvcmtzcGFjZUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnYXRvbS10ZXJuanMtdHlwZScpLmxlbmd0aCkudG9CZSgwKTtcbiAgICAgIGV4cGVjdChlZGl0b3JFbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ2F0b20tdGV4dC1lZGl0b3IgLmF0b20tdGVybmpzLWRlZmluaXRpb24tbWFya2VyJykubGVuZ3RoKS50b0JlKDApO1xuICAgIH0pO1xuICB9KTtcbn0pO1xuXG5kZXNjcmliZSgnYXRvbS10ZXJuanMnLCAoKSA9PiB7XG5cbiAgYmVmb3JlRWFjaCgoKSA9PiB7XG5cbiAgICBzaGFyZWRTZXR1cChmYWxzZSk7XG4gIH0pO1xuXG4gIGRlc2NyaWJlKCdhY3RpdmF0ZSgpJywgKCkgPT4ge1xuXG5cbiAgfSk7XG59KTtcbiJdfQ==