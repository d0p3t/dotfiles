Object.defineProperty(exports, '__esModule', {
  value: true
});

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj['default'] = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { var callNext = step.bind(null, 'next'); var callThrow = step.bind(null, 'throw'); function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(callNext, callThrow); } } callNext(); }); }; }

// eslint-disable-next-line import/extensions, import/no-extraneous-dependencies

var _atom = require('atom');

var _fsPlus = require('fs-plus');

var _fsPlus2 = _interopRequireDefault(_fsPlus);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _atomLinter = require('atom-linter');

var helpers = _interopRequireWildcard(_atomLinter);

// Local variables
'use babel';var parseRegex = /(\d+):(\d+):\s(([A-Z])\d{2,3})\s+(.*)/g;

var applySubstitutions = function applySubstitutions(givenExecPath, projDir) {
  var execPath = givenExecPath;
  var projectName = _path2['default'].basename(projDir);
  execPath = execPath.replace(/\$PROJECT_NAME/ig, projectName);
  execPath = execPath.replace(/\$PROJECT/ig, projDir);
  var paths = execPath.split(';');
  for (var i = 0; i < paths.length; i += 1) {
    if (_fsPlus2['default'].existsSync(paths[i])) {
      return paths[i];
    }
  }
  return execPath;
};

var getVersionString = _asyncToGenerator(function* (versionPath) {
  if (!Object.hasOwnProperty.call(getVersionString, 'cache')) {
    getVersionString.cache = new Map();
  }
  if (!getVersionString.cache.has(versionPath)) {
    getVersionString.cache.set(versionPath, (yield helpers.exec(versionPath, ['--version'])));
  }
  return getVersionString.cache.get(versionPath);
});

var generateInvalidPointTrace = _asyncToGenerator(function* (execPath, match, filePath, textEditor, point) {
  var flake8Version = yield getVersionString(execPath);
  var issueURL = 'https://github.com/AtomLinter/linter-flake8/issues/new';
  var title = encodeURIComponent('Flake8 rule \'' + match[3] + '\' reported an invalid point');
  var body = encodeURIComponent(['Flake8 reported an invalid point for the rule `' + match[3] + '`, ' + ('with the messge `' + match[5] + '`.'), '', '', '<!-- If at all possible, please include code that shows this issue! -->', '', '', 'Debug information:', 'Atom version: ' + atom.getVersion(), 'Flake8 version: `' + flake8Version + '`'].join('\n'));
  var newIssueURL = issueURL + '?title=' + title + '&body=' + body;
  return {
    type: 'Error',
    severity: 'error',
    html: 'ERROR: Flake8 provided an invalid point! See the trace for details. ' + ('<a href="' + newIssueURL + '">Report this!</a>'),
    filePath: filePath,
    range: helpers.generateRange(textEditor, 0),
    trace: [{
      type: 'Trace',
      text: 'Original message: ' + match[3] + ' — ' + match[5],
      filePath: filePath,
      severity: 'info'
    }, {
      type: 'Trace',
      text: 'Requested point: ' + (point.line + 1) + ':' + (point.col + 1),
      filePath: filePath,
      severity: 'info'
    }]
  };
});

exports['default'] = {
  activate: function activate() {
    var _this = this;

    this.idleCallbacks = new Set();

    var packageDepsID = undefined;
    var linterFlake8Deps = function linterFlake8Deps() {
      _this.idleCallbacks['delete'](packageDepsID);

      // Request checking / installation of package dependencies
      if (!atom.inSpecMode()) {
        require('atom-package-deps').install('linter-flake8');
      }

      // FIXME: Remove after a few versions
      if (typeof atom.config.get('linter-flake8.disableTimeout') !== 'undefined') {
        atom.config.unset('linter-flake8.disableTimeout');
      }
    };
    packageDepsID = window.requestIdleCallback(linterFlake8Deps);
    this.idleCallbacks.add(packageDepsID);

    this.subscriptions = new _atom.CompositeDisposable();
    this.subscriptions.add(atom.config.observe('linter-flake8.projectConfigFile', function (value) {
      _this.projectConfigFile = value;
    }), atom.config.observe('linter-flake8.maxLineLength', function (value) {
      _this.maxLineLength = value;
    }), atom.config.observe('linter-flake8.ignoreErrorCodes', function (value) {
      _this.ignoreErrorCodes = value;
    }), atom.config.observe('linter-flake8.maxComplexity', function (value) {
      _this.maxComplexity = value;
    }), atom.config.observe('linter-flake8.selectErrors', function (value) {
      _this.selectErrors = value;
    }), atom.config.observe('linter-flake8.hangClosing', function (value) {
      _this.hangClosing = value;
    }), atom.config.observe('linter-flake8.executablePath', function (value) {
      _this.executablePath = value;
    }), atom.config.observe('linter-flake8.pycodestyleErrorsToWarnings', function (value) {
      _this.pycodestyleErrorsToWarnings = value;
    }), atom.config.observe('linter-flake8.flakeErrors', function (value) {
      _this.flakeErrors = value;
    }), atom.config.observe('linter-flake8.builtins', function (value) {
      _this.builtins = value;
    }));
  },

  deactivate: function deactivate() {
    this.idleCallbacks.forEach(function (callbackID) {
      return window.cancelIdleCallback(callbackID);
    });
    this.idleCallbacks.clear();
    this.subscriptions.dispose();
  },

  provideLinter: function provideLinter() {
    var _this2 = this;

    return {
      name: 'Flake8',
      grammarScopes: ['source.python', 'source.python.django'],
      scope: 'file',
      lintOnFly: true,
      lint: _asyncToGenerator(function* (textEditor) {
        var filePath = textEditor.getPath();
        var fileText = textEditor.getText();

        var parameters = ['--format=default'];

        var projectPath = atom.project.relativizePath(filePath)[0];
        var baseDir = projectPath !== null ? projectPath : _path2['default'].dirname(filePath);
        var configFilePath = yield helpers.findCachedAsync(baseDir, _this2.projectConfigFile);

        if (_this2.projectConfigFile && baseDir !== null && configFilePath !== null) {
          parameters.push('--config', configFilePath);
        } else {
          if (_this2.maxLineLength) {
            parameters.push('--max-line-length', _this2.maxLineLength);
          }
          if (_this2.ignoreErrorCodes.length) {
            parameters.push('--ignore', _this2.ignoreErrorCodes.join(','));
          }
          if (_this2.maxComplexity !== 79) {
            parameters.push('--max-complexity', _this2.maxComplexity);
          }
          if (_this2.hangClosing) {
            parameters.push('--hang-closing');
          }
          if (_this2.selectErrors.length) {
            parameters.push('--select', _this2.selectErrors.join(','));
          }
          if (_this2.builtins.length) {
            parameters.push('--builtins', _this2.builtins.join(','));
          }
        }

        parameters.push('-');

        var execPath = _fsPlus2['default'].normalize(applySubstitutions(_this2.executablePath, baseDir));
        var forceTimeout = 1000 * 60 * 5; // (ms * s * m) = Five minutes
        var options = {
          stdin: fileText,
          cwd: _path2['default'].dirname(textEditor.getPath()),
          ignoreExitCode: true,
          timeout: forceTimeout,
          uniqueKey: 'linter-flake8:' + filePath
        };

        var result = undefined;
        try {
          result = yield helpers.exec(execPath, parameters, options);
        } catch (e) {
          var pyTrace = e.message.split('\n');
          var pyMostRecent = pyTrace[pyTrace.length - 1];
          atom.notifications.addError('Flake8 crashed!', {
            detail: 'linter-flake8:: Flake8 threw an error related to:\n' + (pyMostRecent + '\n') + "Please check Atom's Console for more details"
          });
          // eslint-disable-next-line no-console
          console.error('linter-flake8:: Flake8 returned an error', e.message);
          // Tell Linter to not update any current messages it may have
          return null;
        }

        if (result === null) {
          // Process was killed by a future invocation
          return null;
        }

        if (textEditor.getText() !== fileText) {
          // Editor contents have changed, tell Linter not to update
          return null;
        }

        var messages = [];

        var match = parseRegex.exec(result);
        while (match !== null) {
          // Note that these positions are being converted to 0-indexed
          var line = Number.parseInt(match[1], 10) - 1 || 0;
          var col = Number.parseInt(match[2], 10) - 1 || undefined;

          var isErr = match[4] === 'E' && !_this2.pycodestyleErrorsToWarnings || match[4] === 'F' && _this2.flakeErrors;

          try {
            messages.push({
              type: isErr ? 'Error' : 'Warning',
              text: match[3] + ' — ' + match[5],
              filePath: filePath,
              range: helpers.generateRange(textEditor, line, col)
            });
          } catch (point) {
            // generateRange encountered an invalid point
            messages.push(generateInvalidPointTrace(execPath, match, filePath, textEditor, point));
          }

          match = parseRegex.exec(result);
        }
        // Ensure that any invalid point messages have finished resolving
        return Promise.all(messages);
      })
    };
  }
};
module.exports = exports['default'];
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3JlbWNvLy5hdG9tL3BhY2thZ2VzL2xpbnRlci1mbGFrZTgvbGliL21haW4uanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7O29CQUdvQyxNQUFNOztzQkFDM0IsU0FBUzs7OztvQkFDUCxNQUFNOzs7OzBCQUNFLGFBQWE7O0lBQTFCLE9BQU87OztBQU5uQixXQUFXLENBQUMsQUFTWixJQUFNLFVBQVUsR0FBRyx3Q0FBd0MsQ0FBQzs7QUFFNUQsSUFBTSxrQkFBa0IsR0FBRyxTQUFyQixrQkFBa0IsQ0FBSSxhQUFhLEVBQUUsT0FBTyxFQUFLO0FBQ3JELE1BQUksUUFBUSxHQUFHLGFBQWEsQ0FBQztBQUM3QixNQUFNLFdBQVcsR0FBRyxrQkFBSyxRQUFRLENBQUMsT0FBTyxDQUFDLENBQUM7QUFDM0MsVUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsa0JBQWtCLEVBQUUsV0FBVyxDQUFDLENBQUM7QUFDN0QsVUFBUSxHQUFHLFFBQVEsQ0FBQyxPQUFPLENBQUMsYUFBYSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0FBQ3BELE1BQU0sS0FBSyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7QUFDbEMsT0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxHQUFHLEtBQUssQ0FBQyxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUMsRUFBRTtBQUN4QyxRQUFJLG9CQUFHLFVBQVUsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRTtBQUMzQixhQUFPLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztLQUNqQjtHQUNGO0FBQ0QsU0FBTyxRQUFRLENBQUM7Q0FDakIsQ0FBQzs7QUFFRixJQUFNLGdCQUFnQixxQkFBRyxXQUFPLFdBQVcsRUFBSztBQUM5QyxNQUFJLENBQUMsTUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsZ0JBQWdCLEVBQUUsT0FBTyxDQUFDLEVBQUU7QUFDMUQsb0JBQWdC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RSxLQUFLLEVBQUUsUUFBUSxFQUFFLFVBQVUsRUFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDO1dBQ2xEOztBQUVELGVBQUssR0FBRyxVQUFVLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQ2pDOztBQUVELGVBQU8sT0FBTyxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsQ0FBQztPQUM5QixDQUFBO0tBQ0YsQ0FBQztHQUNIO0NBQ0YiLCJmaWxlIjoiL2hvbWUvcmVtY28vLmF0b20vcGFja2FnZXMvbGludGVyLWZsYWtlOC9saWIvbWFpbi5qcyIsInNvdXJjZXNDb250ZW50IjpbIid1c2UgYmFiZWwnO1xuXG4vLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgaW1wb3J0L2V4dGVuc2lvbnMsIGltcG9ydC9uby1leHRyYW5lb3VzLWRlcGVuZGVuY2llc1xuaW1wb3J0IHsgQ29tcG9zaXRlRGlzcG9zYWJsZSB9IGZyb20gJ2F0b20nO1xuaW1wb3J0IGZzIGZyb20gJ2ZzLXBsdXMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgKiBhcyBoZWxwZXJzIGZyb20gJ2F0b20tbGludGVyJztcblxuLy8gTG9jYWwgdmFyaWFibGVzXG5jb25zdCBwYXJzZVJlZ2V4ID0gLyhcXGQrKTooXFxkKyk6XFxzKChbQS1aXSlcXGR7MiwzfSlcXHMrKC4qKS9nO1xuXG5jb25zdCBhcHBseVN1YnN0aXR1dGlvbnMgPSAoZ2l2ZW5FeGVjUGF0aCwgcHJvakRpcikgPT4ge1xuICBsZXQgZXhlY1BhdGggPSBnaXZlbkV4ZWNQYXRoO1xuICBjb25zdCBwcm9qZWN0TmFtZSA9IHBhdGguYmFzZW5hbWUocHJvakRpcik7XG4gIGV4ZWNQYXRoID0gZXhlY1BhdGgucmVwbGFjZSgvXFwkUFJPSkVDVF9OQU1FL2lnLCBwcm9qZWN0TmFtZSk7XG4gIGV4ZWNQYXRoID0gZXhlY1BhdGgucmVwbGFjZSgvXFwkUFJPSkVDVC9pZywgcHJvakRpcik7XG4gIGNvbnN0IHBhdGhzID0gZXhlY1BhdGguc3BsaXQoJzsnKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBwYXRocy5sZW5ndGg7IGkgKz0gMSkge1xuICAgIGlmIChmcy5leGlzdHNTeW5jKHBhdGhzW2ldKSkge1xuICAgICAgcmV0dXJuIHBhdGhzW2ldO1xuICAgIH1cbiAgfVxuICByZXR1cm4gZXhlY1BhdGg7XG59O1xuXG5jb25zdCBnZXRWZXJzaW9uU3RyaW5nID0gYXN5bmMgKHZlcnNpb25QYXRoKSA9PiB7XG4gIGlmICghT2JqZWN0Lmhhc093blByb3BlcnR5LmNhbGwoZ2V0VmVyc2lvblN0cmluZywgJ2NhY2hlJykpIHtcbiAgICBnZXRWZXJzaW9uU3RyaW5nLmNhY2hlID0gbmV3IE1hcCgpO1xuICB9XG4gIGlmICghZ2V0VmVyc2lvblN0cmluZy5jYWNoZS5oYXModmVyc2lvblBhdGgpKSB7XG4gICAgZ2V0VmVyc2lvblN0cmluZy5jYWNoZS5zZXQodmVyc2lvblBhdGgsXG4gICAgICBhd2FpdCBoZWxwZXJzLmV4ZWModmVyc2lvblBhdGgsIFsnLS12ZXJzaW9uJ10pKTtcbiAgfVxuICByZXR1cm4gZ2V0VmVyc2lvblN0cmluZy5jYWNoZS5nZXQodmVyc2lvblBhdGgpO1xufTtcblxuY29uc3QgZ2VuZXJhdGVJbnZhbGlkUG9pbnRUcmFjZSA9IGFzeW5jIChleGVjUGF0aCwgbWF0Y2gsIGZpbGVQYXRoLCB0ZXh0RWRpdG9yLCBwb2ludCkgPT4ge1xuICBjb25zdCBmbGFrZThWZXJzaW9uID0gYXdhaXQgZ2V0VmVyc2lvblN0cmluZyhleGVjUGF0aCk7XG4gIGNvbnN0IGlzc3VlVVJMID0gJ2h0dHBzOi8vZ2l0aHViLmNvbS9BdG9tTGludGVyL2xpbnRlci1mbGFrZTgvaXNzdWVzL25ldyc7XG4gIGNvbnN0IHRpdGxlID0gZW5jb2RlVVJJQ29tcG9uZW50KGBGbGFrZTggcnVsZSAnJHttYXRjaFszXX0nIHJlcG9ydGVkIGFuIGludmFsaWQgcG9pbnRgKTtcbiAgY29uc3QgYm9keSA9IGVuY29kZVVSSUNvbXBvbmVudChbXG4gICAgYEZsYWtlOCByZXBvcnRlZCBhbiBpbnZhbGlkIHBvaW50IGZvciB0aGUgcnVsZSBcXGAke21hdGNoWzNdfVxcYCwgYCArXG4gICAgYHdpdGggdGhlIG1lc3NnZSBcXGAke21hdGNoWzVdfVxcYC5gLFxuICAgICcnLCAnJyxcbiAgICAnPCEtLSBJZiBhdCBhbGwgcG9zc2libGUsIHBsZWFzZSBpbmNsdWRlIGNvZGUgdGhhdCBzaG93cyB0aGlzIGlzc3VlISAtLT4nLFxuICAgICcnLCAnJyxcbiAgICAnRGVidWcgaW5mb3JtYXRpb246JyxcbiAgICBgQXRvbSB2ZXJzaW9uOiAke2F0b20uZ2V0VmVyc2lvbigpfWAsXG4gICAgYEZsYWtlOCB2ZXJzaW9uOiBcXGAke2ZsYWtlOFZlcnNpb259XFxgYCxcbiAgXS5qb2luKCdcXG4nKSk7XG4gIGNvbnN0IG5ld0lzc3VlVVJMID0gYCR7aXNzdWVVUkx9P3RpdGxlPSR7dGl0bGV9JmJvZHk9JHtib2R5fWA7XG4gIHJldHVybiB7XG4gICAgdHlwZTogJ0Vycm9yJyxcbiAgICBzZXZlcml0eTogJ2Vycm9yJyxcbiAgICBodG1sOiAnRVJST1I6IEZsYWtlOCBwcm92aWRlZCBhbiBpbnZhbGlkIHBvaW50ISBTZWUgdGhlIHRyYWNlIGZvciBkZXRhaWxzLiAnICtcbiAgICAgIGA8YSBocmVmPVwiJHtuZXdJc3N1ZVVSTH1cIj5SZXBvcnQgdGhpcyE8L2E+YCxcbiAgICBmaWxlUGF0aCxcbiAgICByYW5nZTogaGVscGVycy5nZW5lcmF0ZVJhbmdlKHRleHRFZGl0b3IsIDApLFxuICAgIHRyYWNlOiBbXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdUcmFjZScsXG4gICAgICAgIHRleHQ6IGBPcmlnaW5hbCBtZXNzYWdlOiAke21hdGNoWzNdfSDigJQgJHttYXRjaFs1XX1gLFxuICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgc2V2ZXJpdHk6ICdpbmZvJyxcbiAgICAgIH0sXG4gICAgICB7XG4gICAgICAgIHR5cGU6ICdUcmFjZScsXG4gICAgICAgIHRleHQ6IGBSZXF1ZXN0ZWQgcG9pbnQ6ICR7cG9pbnQubGluZSArIDF9OiR7cG9pbnQuY29sICsgMX1gLFxuICAgICAgICBmaWxlUGF0aCxcbiAgICAgICAgc2V2ZXJpdHk6ICdpbmZvJyxcbiAgICAgIH0sXG4gICAgXSxcbiAgfTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IHtcbiAgYWN0aXZhdGUoKSB7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzID0gbmV3IFNldCgpO1xuXG4gICAgbGV0IHBhY2thZ2VEZXBzSUQ7XG4gICAgY29uc3QgbGludGVyRmxha2U4RGVwcyA9ICgpID0+IHtcbiAgICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5kZWxldGUocGFja2FnZURlcHNJRCk7XG5cbiAgICAgIC8vIFJlcXVlc3QgY2hlY2tpbmcgLyBpbnN0YWxsYXRpb24gb2YgcGFja2FnZSBkZXBlbmRlbmNpZXNcbiAgICAgIGlmICghYXRvbS5pblNwZWNNb2RlKCkpIHtcbiAgICAgICAgcmVxdWlyZSgnYXRvbS1wYWNrYWdlLWRlcHMnKS5pbnN0YWxsKCdsaW50ZXItZmxha2U4Jyk7XG4gICAgICB9XG5cbiAgICAgIC8vIEZJWE1FOiBSZW1vdmUgYWZ0ZXIgYSBmZXcgdmVyc2lvbnNcbiAgICAgIGlmICh0eXBlb2YgYXRvbS5jb25maWcuZ2V0KCdsaW50ZXItZmxha2U4LmRpc2FibGVUaW1lb3V0JykgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgIGF0b20uY29uZmlnLnVuc2V0KCdsaW50ZXItZmxha2U4LmRpc2FibGVUaW1lb3V0Jyk7XG4gICAgICB9XG4gICAgfTtcbiAgICBwYWNrYWdlRGVwc0lEID0gd2luZG93LnJlcXVlc3RJZGxlQ2FsbGJhY2sobGludGVyRmxha2U4RGVwcyk7XG4gICAgdGhpcy5pZGxlQ2FsbGJhY2tzLmFkZChwYWNrYWdlRGVwc0lEKTtcblxuICAgIHRoaXMuc3Vic2NyaXB0aW9ucyA9IG5ldyBDb21wb3NpdGVEaXNwb3NhYmxlKCk7XG4gICAgdGhpcy5zdWJzY3JpcHRpb25zLmFkZChcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTgucHJvamVjdENvbmZpZ0ZpbGUnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5wcm9qZWN0Q29uZmlnRmlsZSA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZmxha2U4Lm1heExpbmVMZW5ndGgnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5tYXhMaW5lTGVuZ3RoID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTguaWdub3JlRXJyb3JDb2RlcycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmlnbm9yZUVycm9yQ29kZXMgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5tYXhDb21wbGV4aXR5JywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMubWF4Q29tcGxleGl0eSA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZmxha2U4LnNlbGVjdEVycm9ycycsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLnNlbGVjdEVycm9ycyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZmxha2U4LmhhbmdDbG9zaW5nJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuaGFuZ0Nsb3NpbmcgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICAgYXRvbS5jb25maWcub2JzZXJ2ZSgnbGludGVyLWZsYWtlOC5leGVjdXRhYmxlUGF0aCcsICh2YWx1ZSkgPT4ge1xuICAgICAgICB0aGlzLmV4ZWN1dGFibGVQYXRoID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTgucHljb2Rlc3R5bGVFcnJvcnNUb1dhcm5pbmdzJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMucHljb2Rlc3R5bGVFcnJvcnNUb1dhcm5pbmdzID0gdmFsdWU7XG4gICAgICB9KSxcbiAgICAgIGF0b20uY29uZmlnLm9ic2VydmUoJ2xpbnRlci1mbGFrZTguZmxha2VFcnJvcnMnLCAodmFsdWUpID0+IHtcbiAgICAgICAgdGhpcy5mbGFrZUVycm9ycyA9IHZhbHVlO1xuICAgICAgfSksXG4gICAgICBhdG9tLmNvbmZpZy5vYnNlcnZlKCdsaW50ZXItZmxha2U4LmJ1aWx0aW5zJywgKHZhbHVlKSA9PiB7XG4gICAgICAgIHRoaXMuYnVpbHRpbnMgPSB2YWx1ZTtcbiAgICAgIH0pLFxuICAgICk7XG4gIH0sXG5cbiAgZGVhY3RpdmF0ZSgpIHtcbiAgICB0aGlzLmlkbGVDYWxsYmFja3MuZm9yRWFjaChjYWxsYmFja0lEID0+IHdpbmRvdy5jYW5jZWxJZGxlQ2FsbGJhY2soY2FsbGJhY2tJRCkpO1xuICAgIHRoaXMuaWRsZUNhbGxiYWNrcy5jbGVhcigpO1xuICAgIHRoaXMuc3Vic2NyaXB0aW9ucy5kaXNwb3NlKCk7XG4gIH0sXG5cbiAgcHJvdmlkZUxpbnRlcigpIHtcbiAgICByZXR1cm4ge1xuICAgICAgbmFtZTogJ0ZsYWtlOCcsXG4gICAgICBncmFtbWFyU2NvcGVzOiBbJ3NvdXJjZS5weXRob24nLCAnc291cmNlLnB5dGhvbi5kamFuZ28nXSxcbiAgICAgIHNjb3BlOiAnZmlsZScsXG4gICAgICBsaW50T25GbHk6IHRydWUsXG4gICAgICBsaW50OiBhc3luYyAodGV4dEVkaXRvcikgPT4ge1xuICAgICAgICBjb25zdCBmaWxlUGF0aCA9IHRleHRFZGl0b3IuZ2V0UGF0aCgpO1xuICAgICAgICBjb25zdCBmaWxlVGV4dCA9IHRleHRFZGl0b3IuZ2V0VGV4dCgpO1xuXG4gICAgICAgIGNvbnN0IHBhcmFtZXRlcnMgPSBbJy0tZm9ybWF0PWRlZmF1bHQnXTtcblxuICAgICAgICBjb25zdCBwcm9qZWN0UGF0aCA9IGF0b20ucHJvamVjdC5yZWxhdGl2aXplUGF0aChmaWxlUGF0aClbMF07XG4gICAgICAgIGNvbnN0IGJhc2VEaXIgPSBwcm9qZWN0UGF0aCAhPT0gbnVsbCA/IHByb2plY3RQYXRoIDogcGF0aC5kaXJuYW1lKGZpbGVQYXRoKTtcbiAgICAgICAgY29uc3QgY29uZmlnRmlsZVBhdGggPSBhd2FpdCBoZWxwZXJzLmZpbmRDYWNoZWRBc3luYyhiYXNlRGlyLCB0aGlzLnByb2plY3RDb25maWdGaWxlKTtcblxuICAgICAgICBpZiAodGhpcy5wcm9qZWN0Q29uZmlnRmlsZSAmJiBiYXNlRGlyICE9PSBudWxsICYmIGNvbmZpZ0ZpbGVQYXRoICE9PSBudWxsKSB7XG4gICAgICAgICAgcGFyYW1ldGVycy5wdXNoKCctLWNvbmZpZycsIGNvbmZpZ0ZpbGVQYXRoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBpZiAodGhpcy5tYXhMaW5lTGVuZ3RoKSB7XG4gICAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0tbWF4LWxpbmUtbGVuZ3RoJywgdGhpcy5tYXhMaW5lTGVuZ3RoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMuaWdub3JlRXJyb3JDb2Rlcy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1pZ25vcmUnLCB0aGlzLmlnbm9yZUVycm9yQ29kZXMuam9pbignLCcpKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKHRoaXMubWF4Q29tcGxleGl0eSAhPT0gNzkpIHtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1tYXgtY29tcGxleGl0eScsIHRoaXMubWF4Q29tcGxleGl0eSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLmhhbmdDbG9zaW5nKSB7XG4gICAgICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0taGFuZy1jbG9zaW5nJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0aGlzLnNlbGVjdEVycm9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1zZWxlY3QnLCB0aGlzLnNlbGVjdEVycm9ycy5qb2luKCcsJykpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodGhpcy5idWlsdGlucy5sZW5ndGgpIHtcbiAgICAgICAgICAgIHBhcmFtZXRlcnMucHVzaCgnLS1idWlsdGlucycsIHRoaXMuYnVpbHRpbnMuam9pbignLCcpKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwYXJhbWV0ZXJzLnB1c2goJy0nKTtcblxuICAgICAgICBjb25zdCBleGVjUGF0aCA9IGZzLm5vcm1hbGl6ZShhcHBseVN1YnN0aXR1dGlvbnModGhpcy5leGVjdXRhYmxlUGF0aCwgYmFzZURpcikpO1xuICAgICAgICBjb25zdCBmb3JjZVRpbWVvdXQgPSAxMDAwICogNjAgKiA1OyAvLyAobXMgKiBzICogbSkgPSBGaXZlIG1pbnV0ZXNcbiAgICAgICAgY29uc3Qgb3B0aW9ucyA9IHtcbiAgICAgICAgICBzdGRpbjogZmlsZVRleHQsXG4gICAgICAgICAgY3dkOiBwYXRoLmRpcm5hbWUodGV4dEVkaXRvci5nZXRQYXRoKCkpLFxuICAgICAgICAgIGlnbm9yZUV4aXRDb2RlOiB0cnVlLFxuICAgICAgICAgIHRpbWVvdXQ6IGZvcmNlVGltZW91dCxcbiAgICAgICAgICB1bmlxdWVLZXk6IGBsaW50ZXItZmxha2U4OiR7ZmlsZVBhdGh9YCxcbiAgICAgICAgfTtcblxuICAgICAgICBsZXQgcmVzdWx0O1xuICAgICAgICB0cnkge1xuICAgICAgICAgIHJlc3VsdCA9IGF3YWl0IGhlbHBlcnMuZXhlYyhleGVjUGF0aCwgcGFyYW1ldGVycywgb3B0aW9ucyk7XG4gICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICBjb25zdCBweVRyYWNlID0gZS5tZXNzYWdlLnNwbGl0KCdcXG4nKTtcbiAgICAgICAgICBjb25zdCBweU1vc3RSZWNlbnQgPSBweVRyYWNlW3B5VHJhY2UubGVuZ3RoIC0gMV07XG4gICAgICAgICAgYXRvbS5ub3RpZmljYXRpb25zLmFkZEVycm9yKCdGbGFrZTggY3Jhc2hlZCEnLCB7XG4gICAgICAgICAgICBkZXRhaWw6ICdsaW50ZXItZmxha2U4OjogRmxha2U4IHRocmV3IGFuIGVycm9yIHJlbGF0ZWQgdG86XFxuJyArXG4gICAgICAgICAgICAgIGAke3B5TW9zdFJlY2VudH1cXG5gICtcbiAgICAgICAgICAgICAgXCJQbGVhc2UgY2hlY2sgQXRvbSdzIENvbnNvbGUgZm9yIG1vcmUgZGV0YWlsc1wiLFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby1jb25zb2xlXG4gICAgICAgICAgY29uc29sZS5lcnJvcignbGludGVyLWZsYWtlODo6IEZsYWtlOCByZXR1cm5lZCBhbiBlcnJvcicsIGUubWVzc2FnZSk7XG4gICAgICAgICAgLy8gVGVsbCBMaW50ZXIgdG8gbm90IHVwZGF0ZSBhbnkgY3VycmVudCBtZXNzYWdlcyBpdCBtYXkgaGF2ZVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHJlc3VsdCA9PT0gbnVsbCkge1xuICAgICAgICAgIC8vIFByb2Nlc3Mgd2FzIGtpbGxlZCBieSBhIGZ1dHVyZSBpbnZvY2F0aW9uXG4gICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGV4dEVkaXRvci5nZXRUZXh0KCkgIT09IGZpbGVUZXh0KSB7XG4gICAgICAgICAgLy8gRWRpdG9yIGNvbnRlbnRzIGhhdmUgY2hhbmdlZCwgdGVsbCBMaW50ZXIgbm90IHRvIHVwZGF0ZVxuICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgbWVzc2FnZXMgPSBbXTtcblxuICAgICAgICBsZXQgbWF0Y2ggPSBwYXJzZVJlZ2V4LmV4ZWMocmVzdWx0KTtcbiAgICAgICAgd2hpbGUgKG1hdGNoICE9PSBudWxsKSB7XG4gICAgICAgICAgLy8gTm90ZSB0aGF0IHRoZXNlIHBvc2l0aW9ucyBhcmUgYmVpbmcgY29udmVydGVkIHRvIDAtaW5kZXhlZFxuICAgICAgICAgIGNvbnN0IGxpbmUgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMV0sIDEwKSAtIDEgfHwgMDtcbiAgICAgICAgICBjb25zdCBjb2wgPSBOdW1iZXIucGFyc2VJbnQobWF0Y2hbMl0sIDEwKSAtIDEgfHwgdW5kZWZpbmVkO1xuXG4gICAgICAgICAgY29uc3QgaXNFcnIgPSAobWF0Y2hbNF0gPT09ICdFJyAmJiAhdGhpcy5weWNvZGVzdHlsZUVycm9yc1RvV2FybmluZ3MpXG4gICAgICAgICAgICB8fCAobWF0Y2hbNF0gPT09ICdGJyAmJiB0aGlzLmZsYWtlRXJyb3JzKTtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICBtZXNzYWdlcy5wdXNoKHtcbiAgICAgICAgICAgICAgdHlwZTogaXNFcnIgPyAnRXJyb3InIDogJ1dhcm5pbmcnLFxuICAgICAgICAgICAgICB0ZXh0OiBgJHttYXRjaFszXX0g4oCUICR7bWF0Y2hbNV19YCxcbiAgICAgICAgICAgICAgZmlsZVBhdGgsXG4gICAgICAgICAgICAgIHJhbmdlOiBoZWxwZXJzLmdlbmVyYXRlUmFuZ2UodGV4dEVkaXRvciwgbGluZSwgY29sKSxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gY2F0Y2ggKHBvaW50KSB7XG4gICAgICAgICAgICAvLyBnZW5lcmF0ZVJhbmdlIGVuY291bnRlcmVkIGFuIGludmFsaWQgcG9pbnRcbiAgICAgICAgICAgIG1lc3NhZ2VzLnB1c2goZ2VuZXJhdGVJbnZhbGlkUG9pbnRUcmFjZShcbiAgICAgICAgICAgICAgZXhlY1BhdGgsIG1hdGNoLCBmaWxlUGF0aCwgdGV4dEVkaXRvciwgcG9pbnQpKTtcbiAgICAgICAgICB9XG5cbiAgICAgICAgICBtYXRjaCA9IHBhcnNlUmVnZXguZXhlYyhyZXN1bHQpO1xuICAgICAgICB9XG4gICAgICAgIC8vIEVuc3VyZSB0aGF0IGFueSBpbnZhbGlkIHBvaW50IG1lc3NhZ2VzIGhhdmUgZmluaXNoZWQgcmVzb2x2aW5nXG4gICAgICAgIHJldHVybiBQcm9taXNlLmFsbChtZXNzYWdlcyk7XG4gICAgICB9LFxuICAgIH07XG4gIH0sXG59O1xuIl19