Object.defineProperty(exports, '__esModule', {
  value: true
});
exports.getBufferPositionFromMouseEvent = getBufferPositionFromMouseEvent;
exports.mouseEventNearPosition = mouseEventNearPosition;
exports.hasParent = hasParent;

var TOOLTIP_WIDTH_HIDE_OFFSET = 30;

function getBufferPositionFromMouseEvent(event, editor, editorElement) {
  var pixelPosition = editorElement.component.pixelPositionForMouseEvent(event);
  var screenPosition = editorElement.component.screenPositionForPixelPosition(pixelPosition);
  if (Number.isNaN(screenPosition.row) || Number.isNaN(screenPosition.column)) return null;
  // ^ Workaround for NaN bug steelbrain/linter-ui-default#191
  var expectedPixelPosition = editorElement.pixelPositionForScreenPosition(screenPosition);
  var differenceTop = pixelPosition.top - expectedPixelPosition.top;
  var differenceLeft = pixelPosition.left - expectedPixelPosition.left;
  // Only allow offset of 20px - Fixes steelbrain/linter-ui-default#63
  if ((differenceTop === 0 || differenceTop > 0 && differenceTop < 20 || differenceTop < 0 && differenceTop > -20) && (differenceLeft === 0 || differenceLeft > 0 && differenceLeft < 20 || differenceLeft < 0 && differenceLeft > -20)) {
    return editor.bufferPositionForScreenPosition(screenPosition);
  }
  return null;
}

function mouseEventNearPosition(_ref) {
  var event = _ref.event;
  var editor = _ref.editor;
  var editorElement = _ref.editorElement;
  var tooltipElement = _ref.tooltipElement;
  var screenPosition = _ref.screenPosition;

  var pixelPosition = editorElement.component.pixelPositionForMouseEvent(event);
  var expectedPixelPosition = editorElement.pixelPositionForScreenPosition(screenPosition);
  var differenceTop = pixelPosition.top - expectedPixelPosition.top;
  var differenceLeft = pixelPosition.left - expectedPixelPosition.left;

  var editorLineHeight = editor.lineHeightInPixels;
  var elementHeight = tooltipElement.offsetHeight + editorLineHeight;
  var elementWidth = tooltipElement.offsetWidth;

  if (differenceTop > 0) {
    // Cursor is below the line
    if (differenceTop > elementHeight + 1.5 * editorLineHeight) {
      return false;
    }
  } else if (differenceTop < 0) {
    // Cursor is above the line
    if (differenceTop < -1.5 * editorLineHeight) {
      return false;
    }
  }
  if (differenceLeft > 0) {
    // Right of the start of highlight
    if (differenceLeft > elementWidth + TOOLTIP_WIDTH_HIDE_OFFSET) {
      return false;
    }
  } else if (differenceLeft < 0) {
    // Left of start of highlight
    if (differenceLeft < -1 * TOOLTIP_WIDTH_HIDE_OFFSET) {
      return false;
    }
  }
  return true;
}

function hasParent(givenElement, selector) {
  var element = givenElement;
  do {
    if (element.matches(selector)) {
      return true;
    }
    element = element.parentElement;
  } while (element && element.nodeName !== 'HTML');
  return false;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3JlbWNvLy5hdG9tL3BhY2thZ2VzL2xpbnRlci11aS1kZWZhdWx0L2xpYi9lZGl0b3IvaGVscGVycy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7O0FBSUEsSUFBTSx5QkFBeUIsR0FBRyxFQUFFLENBQUE7O0FBRTdCLFNBQVMsK0JBQStCLENBQUMsS0FBaUIsRUFBRSxNQUFrQixFQUFFLGFBQXFCLEVBQVU7QUFDcEgsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLFNBQVMsQ0FBQywwQkFBMEIsQ0FBQyxLQUFLLENBQUMsQ0FBQTtBQUMvRSxNQUFNLGNBQWMsR0FBRyxhQUFhLENBQUMsU0FBUyxDQUFDLDhCQUE4QixDQUFDLGFBQWEsQ0FBQyxDQUFBO0FBQzVGLE1BQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsR0FBRyxDQUFDLElBQUksTUFBTSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLEVBQUUsT0FBTyxJQUFJLENBQUE7O0FBRXhGLE1BQU0scUJBQXFCLEdBQUcsYUFBYSxDQUFDLDhCQUE4QixDQUFDLGNBQWMsQ0FBQyxDQUFBO0FBQzFGLE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQyxHQUFHLEdBQUcscUJBQXFCLENBQUMsR0FBRyxDQUFBO0FBQ25FLE1BQU0sY0FBYyxHQUFHLGFBQWEsQ0FBQyxJQUFJLEdBQUcscUJBQXFCLENBQUMsSUFBSSxDQUFBOztBQUV0RSxNQUNFLENBQUMsYUFBYSxLQUFLLENBQUMsSUFBSyxhQUFhLEdBQUcsQ0FBQyxJQUFJLGFBQWEsR0FBRyxFQUFFLEFBQUMsSUFBSyxhQUFhLEdBQUcsQ0FBQyxJQUFJLGFBQWEsR0FBRyxDQUFDLEVBQUUsQ0FBQyxLQUM5RyxjQUFjLEtBQUssQ0FBQyxJQUFLLGNBQWMsR0FBRyxDQUFDLElBQUksY0FBYyxHQUFHLEVBQUUsQUFBQyxJQUFLLGNBQWMsR0FBRyxDQUFDLElBQUksY0FBYyxHQUFHLENBQUMsRUFBRSxDQUFDLEFBQUMsRUFDckg7QUFDQSxXQUFPLE1BQU0sQ0FBQywrQkFBK0IsQ0FBQyxjQUFjLENBQUMsQ0FBQTtHQUM5RDtBQUNELFNBQU8sSUFBSSxDQUFBO0NBQ1o7O0FBRU0sU0FBUyxzQkFBc0IsQ0FBQyxJQUF3RSxFQUFXO01BQWpGLEtBQUssR0FBUCxJQUF3RSxDQUF0RSxLQUFLO01BQUUsTUFBTSxHQUFmLElBQXdFLENBQS9ELE1BQU07TUFBRSxhQUFhLEdBQTlCLElBQXdFLENBQXZELGFBQWE7TUFBRSxjQUFjLEdBQTlDLElBQXdFLENBQXhDLGNBQWM7TUFBRSxjQUFjLEdBQTlELElBQXdFLENBQXhCLGNBQWM7O0FBQ25HLE1BQU0sYUFBYSxHQUFHLGFBQWEsQ0FBQyxTQUFTLENBQUMsMEJBQTBCLENBQUMsS0FBSyxDQUFDLENBQUE7QUFDL0UsTUFBTSxxQkFBcUIsR0FBRyxhQUFhLENBQUMsOEJBQThCLENBQUMsY0FBYyxDQUFDLENBQUE7QUFDMUYsTUFBTSxhQUFhLEdBQUcsYUFBYSxDQUFDLEdBQUcsR0FBRyxxQkFBcUIsQ0FBQyxHQUFHLENBQUE7QUFDbkUsTUFBTSxjQUFjLEdBQUcsYUFBYSxDQUFDLElBQUksR0FBRyxxQkFBcUIsQ0FBQyxJQUFJLENBQUE7O0FBRXRFLE1BQU0sZ0JBQWdCLEdBQUcsTUFBTSxDQUFDLGtCQUFrQixDQUFBO0FBQ2xELE1BQU0sYUFBYSxHQUFHLGNBQWMsQ0FBQyxZQUFZLEdBQUcsZ0JBQWdCLENBQUE7QUFDcEUsTUFBTSxZQUFZLEdBQUcsY0FBYyxDQUFDLFdBQVcsQ0FBQTs7QUFFL0MsTUFBSSxhQUFhLEdBQUcsQ0FBQyxFQUFFOztBQUVyQixRQUFJLGFBQWEsR0FBSSxhQUFhLEdBQUksR0FBRyxHQUFHLGdCQUFnQixBQUFDLEFBQUMsRUFBRTtBQUM5RCxhQUFPLEtBQUssQ0FBQTtLQUNiO0dBQ0YsTUFBTSxJQUFJLGFBQWEsR0FBRyxDQUFDLEVBQUU7O0FBRTVCLFFBQUksYUFBYSxHQUFJLENBQUMsR0FBRyxHQUFHLGdCQUFnQixBQUFDLEVBQUU7QUFDN0MsYUFBTyxLQUFLLENBQUE7S0FDYjtHQUNGO0FBQ0QsTUFBSSxjQUFjLEdBQUcsQ0FBQyxFQUFFOztBQUV0QixRQUFJLGNBQWMsR0FBSSxZQUFZLEdBQUcseUJBQXlCLEFBQUMsRUFBRTtBQUMvRCxhQUFPLEtBQUssQ0FBQTtLQUNiO0dBQ0YsTUFBTSxJQUFJLGNBQWMsR0FBRyxDQUFDLEVBQUU7O0FBRTdCLFFBQUksY0FBYyxHQUFJLENBQUMsQ0FBQyxHQUFHLHlCQUF5QixBQUFDLEVBQUU7QUFDckQsYUFBTyxLQUFLLENBQUE7S0FDYjtHQUNGO0FBQ0QsU0FBTyxJQUFJLENBQUE7Q0FDWjs7QUFFTSxTQUFTLFNBQVMsQ0FBQyxZQUF5QixFQUFFLFFBQWdCLEVBQVc7QUFDOUUsTUFBSSxPQUFPLEdBQUcsWUFBWSxDQUFBO0FBQzFCLEtBQUc7QUFDRCxRQUFJLE9BQU8sQ0FBQyxPQUFPLENBQUMsUUFBUSxDQUFDLEVBQUU7QUFDN0IsYUFBTyxJQUFJLENBQUE7S0FDWjtBQUNELFdBQU8sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFBO0dBQ2hDLFFBQVEsT0FBTyxJQUFJLE9BQU8sQ0FBQyxRQUFRLEtBQUssTUFBTSxFQUFDO0FBQ2hELFNBQU8sS0FBSyxDQUFBO0NBQ2IiLCJmaWxlIjoiL2hvbWUvcmVtY28vLmF0b20vcGFja2FnZXMvbGludGVyLXVpLWRlZmF1bHQvbGliL2VkaXRvci9oZWxwZXJzLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IHR5cGUgeyBQb2ludCwgVGV4dEVkaXRvciB9IGZyb20gJ2F0b20nXG5cbmNvbnN0IFRPT0xUSVBfV0lEVEhfSElERV9PRkZTRVQgPSAzMFxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0QnVmZmVyUG9zaXRpb25Gcm9tTW91c2VFdmVudChldmVudDogTW91c2VFdmVudCwgZWRpdG9yOiBUZXh0RWRpdG9yLCBlZGl0b3JFbGVtZW50OiBPYmplY3QpOiA/UG9pbnQge1xuICBjb25zdCBwaXhlbFBvc2l0aW9uID0gZWRpdG9yRWxlbWVudC5jb21wb25lbnQucGl4ZWxQb3NpdGlvbkZvck1vdXNlRXZlbnQoZXZlbnQpXG4gIGNvbnN0IHNjcmVlblBvc2l0aW9uID0gZWRpdG9yRWxlbWVudC5jb21wb25lbnQuc2NyZWVuUG9zaXRpb25Gb3JQaXhlbFBvc2l0aW9uKHBpeGVsUG9zaXRpb24pXG4gIGlmIChOdW1iZXIuaXNOYU4oc2NyZWVuUG9zaXRpb24ucm93KSB8fCBOdW1iZXIuaXNOYU4oc2NyZWVuUG9zaXRpb24uY29sdW1uKSkgcmV0dXJuIG51bGxcbiAgLy8gXiBXb3JrYXJvdW5kIGZvciBOYU4gYnVnIHN0ZWVsYnJhaW4vbGludGVyLXVpLWRlZmF1bHQjMTkxXG4gIGNvbnN0IGV4cGVjdGVkUGl4ZWxQb3NpdGlvbiA9IGVkaXRvckVsZW1lbnQucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKHNjcmVlblBvc2l0aW9uKVxuICBjb25zdCBkaWZmZXJlbmNlVG9wID0gcGl4ZWxQb3NpdGlvbi50b3AgLSBleHBlY3RlZFBpeGVsUG9zaXRpb24udG9wXG4gIGNvbnN0IGRpZmZlcmVuY2VMZWZ0ID0gcGl4ZWxQb3NpdGlvbi5sZWZ0IC0gZXhwZWN0ZWRQaXhlbFBvc2l0aW9uLmxlZnRcbiAgLy8gT25seSBhbGxvdyBvZmZzZXQgb2YgMjBweCAtIEZpeGVzIHN0ZWVsYnJhaW4vbGludGVyLXVpLWRlZmF1bHQjNjNcbiAgaWYgKFxuICAgIChkaWZmZXJlbmNlVG9wID09PSAwIHx8IChkaWZmZXJlbmNlVG9wID4gMCAmJiBkaWZmZXJlbmNlVG9wIDwgMjApIHx8IChkaWZmZXJlbmNlVG9wIDwgMCAmJiBkaWZmZXJlbmNlVG9wID4gLTIwKSkgJiZcbiAgICAoZGlmZmVyZW5jZUxlZnQgPT09IDAgfHwgKGRpZmZlcmVuY2VMZWZ0ID4gMCAmJiBkaWZmZXJlbmNlTGVmdCA8IDIwKSB8fCAoZGlmZmVyZW5jZUxlZnQgPCAwICYmIGRpZmZlcmVuY2VMZWZ0ID4gLTIwKSlcbiAgKSB7XG4gICAgcmV0dXJuIGVkaXRvci5idWZmZXJQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKHNjcmVlblBvc2l0aW9uKVxuICB9XG4gIHJldHVybiBudWxsXG59XG5cbmV4cG9ydCBmdW5jdGlvbiBtb3VzZUV2ZW50TmVhclBvc2l0aW9uKHsgZXZlbnQsIGVkaXRvciwgZWRpdG9yRWxlbWVudCwgdG9vbHRpcEVsZW1lbnQsIHNjcmVlblBvc2l0aW9uIH06IE9iamVjdCk6IGJvb2xlYW4ge1xuICBjb25zdCBwaXhlbFBvc2l0aW9uID0gZWRpdG9yRWxlbWVudC5jb21wb25lbnQucGl4ZWxQb3NpdGlvbkZvck1vdXNlRXZlbnQoZXZlbnQpXG4gIGNvbnN0IGV4cGVjdGVkUGl4ZWxQb3NpdGlvbiA9IGVkaXRvckVsZW1lbnQucGl4ZWxQb3NpdGlvbkZvclNjcmVlblBvc2l0aW9uKHNjcmVlblBvc2l0aW9uKVxuICBjb25zdCBkaWZmZXJlbmNlVG9wID0gcGl4ZWxQb3NpdGlvbi50b3AgLSBleHBlY3RlZFBpeGVsUG9zaXRpb24udG9wXG4gIGNvbnN0IGRpZmZlcmVuY2VMZWZ0ID0gcGl4ZWxQb3NpdGlvbi5sZWZ0IC0gZXhwZWN0ZWRQaXhlbFBvc2l0aW9uLmxlZnRcblxuICBjb25zdCBlZGl0b3JMaW5lSGVpZ2h0ID0gZWRpdG9yLmxpbmVIZWlnaHRJblBpeGVsc1xuICBjb25zdCBlbGVtZW50SGVpZ2h0ID0gdG9vbHRpcEVsZW1lbnQub2Zmc2V0SGVpZ2h0ICsgZWRpdG9yTGluZUhlaWdodFxuICBjb25zdCBlbGVtZW50V2lkdGggPSB0b29sdGlwRWxlbWVudC5vZmZzZXRXaWR0aFxuXG4gIGlmIChkaWZmZXJlbmNlVG9wID4gMCkge1xuICAgIC8vIEN1cnNvciBpcyBiZWxvdyB0aGUgbGluZVxuICAgIGlmIChkaWZmZXJlbmNlVG9wID4gKGVsZW1lbnRIZWlnaHQgKyAoMS41ICogZWRpdG9yTGluZUhlaWdodCkpKSB7XG4gICAgICByZXR1cm4gZmFsc2VcbiAgICB9XG4gIH0gZWxzZSBpZiAoZGlmZmVyZW5jZVRvcCA8IDApIHtcbiAgICAvLyBDdXJzb3IgaXMgYWJvdmUgdGhlIGxpbmVcbiAgICBpZiAoZGlmZmVyZW5jZVRvcCA8ICgtMS41ICogZWRpdG9yTGluZUhlaWdodCkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuICBpZiAoZGlmZmVyZW5jZUxlZnQgPiAwKSB7XG4gICAgLy8gUmlnaHQgb2YgdGhlIHN0YXJ0IG9mIGhpZ2hsaWdodFxuICAgIGlmIChkaWZmZXJlbmNlTGVmdCA+IChlbGVtZW50V2lkdGggKyBUT09MVElQX1dJRFRIX0hJREVfT0ZGU0VUKSkge1xuICAgICAgcmV0dXJuIGZhbHNlXG4gICAgfVxuICB9IGVsc2UgaWYgKGRpZmZlcmVuY2VMZWZ0IDwgMCkge1xuICAgIC8vIExlZnQgb2Ygc3RhcnQgb2YgaGlnaGxpZ2h0XG4gICAgaWYgKGRpZmZlcmVuY2VMZWZ0IDwgKC0xICogVE9PTFRJUF9XSURUSF9ISURFX09GRlNFVCkpIHtcbiAgICAgIHJldHVybiBmYWxzZVxuICAgIH1cbiAgfVxuICByZXR1cm4gdHJ1ZVxufVxuXG5leHBvcnQgZnVuY3Rpb24gaGFzUGFyZW50KGdpdmVuRWxlbWVudDogSFRNTEVsZW1lbnQsIHNlbGVjdG9yOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IGVsZW1lbnQgPSBnaXZlbkVsZW1lbnRcbiAgZG8ge1xuICAgIGlmIChlbGVtZW50Lm1hdGNoZXMoc2VsZWN0b3IpKSB7XG4gICAgICByZXR1cm4gdHJ1ZVxuICAgIH1cbiAgICBlbGVtZW50ID0gZWxlbWVudC5wYXJlbnRFbGVtZW50XG4gIH0gd2hpbGUgKGVsZW1lbnQgJiYgZWxlbWVudC5ub2RlTmFtZSAhPT0gJ0hUTUwnKVxuICByZXR1cm4gZmFsc2Vcbn1cbiJdfQ==