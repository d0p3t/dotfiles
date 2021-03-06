function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _libIndieRegistry = require('../lib/indie-registry');

var _libIndieRegistry2 = _interopRequireDefault(_libIndieRegistry);

var _common = require('./common');

describe('IndieRegistry', function () {
  var indieRegistry = undefined;

  beforeEach(function () {
    indieRegistry = new _libIndieRegistry2['default']();
  });
  afterEach(function () {
    indieRegistry.dispose();
  });

  it('triggers observe with existing and new delegates', function () {
    var observeCalled = 0;
    indieRegistry.register({ name: 'Chi' }, 2);
    indieRegistry.observe(function () {
      observeCalled++;
    });
    expect(observeCalled).toBe(1);
    indieRegistry.register({ name: 'Ping' }, 2);
    expect(observeCalled).toBe(2);
    indieRegistry.register({ name: 'Pong' }, 2);
    expect(observeCalled).toBe(3);
  });
  it('removes delegates from registry as soon as they are dispose', function () {
    expect(indieRegistry.delegates.size).toBe(0);
    var delegate = indieRegistry.register({ name: 'Chi' }, 2);
    expect(indieRegistry.delegates.size).toBe(1);
    delegate.dispose();
    expect(indieRegistry.delegates.size).toBe(0);
  });
  it('triggers update as delegates are updated', function () {
    var timesUpdated = 0;
    indieRegistry.onDidUpdate(function () {
      timesUpdated++;
    });
    expect(timesUpdated).toBe(0);
    var delegate = indieRegistry.register({ name: 'Panda' }, 2);
    expect(timesUpdated).toBe(0);
    delegate.setAllMessages([(0, _common.getMessage)()]);
    expect(timesUpdated).toBe(1);
    delegate.setAllMessages([(0, _common.getMessage)()]);
    expect(timesUpdated).toBe(2);
    delegate.dispose();
    delegate.setAllMessages([(0, _common.getMessage)()]);
    expect(timesUpdated).toBe(2);
  });
  it('passes on version correctly to the delegates', function () {
    expect(indieRegistry.register({ name: 'Ola' }, 2).version).toBe(2);
    expect(indieRegistry.register({ name: 'Hello' }, 1).version).toBe(1);
  });
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi9ob21lL3JlbWNvLy5hdG9tL3BhY2thZ2VzL2xpbnRlci9zcGVjL2luZGllLXJlZ2lzdHJ5LXNwZWMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Z0NBRTBCLHVCQUF1Qjs7OztzQkFDdEIsVUFBVTs7QUFFckMsUUFBUSxDQUFDLGVBQWUsRUFBRSxZQUFXO0FBQ25DLE1BQUksYUFBYSxZQUFBLENBQUE7O0FBRWpCLFlBQVUsQ0FBQyxZQUFXO0FBQ3BCLGlCQUFhLEdBQUcsbUNBQW1CLENBQUE7R0FDcEMsQ0FBQyxDQUFBO0FBQ0YsV0FBUyxDQUFDLFlBQVc7QUFDbkIsaUJBQWEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtHQUN4QixDQUFDLENBQUE7O0FBRUYsSUFBRSxDQUFDLGtEQUFrRCxFQUFFLFlBQVc7QUFDaEUsUUFBSSxhQUFhLEdBQUcsQ0FBQyxDQUFBO0FBQ3JCLGlCQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzFDLGlCQUFhLENBQUMsT0FBTyxDQUFDLFlBQVc7QUFDL0IsbUJBQWEsRUFBRSxDQUFBO0tBQ2hCLENBQUMsQ0FBQTtBQUNGLFVBQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDN0IsaUJBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUE7QUFDM0MsVUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM3QixpQkFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUMzQyxVQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQzlCLENBQUMsQ0FBQTtBQUNGLElBQUUsQ0FBQyw2REFBNkQsRUFBRSxZQUFXO0FBQzNFLFVBQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1QyxRQUFNLFFBQVEsR0FBRyxhQUFhLENBQUMsUUFBUSxDQUFDLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFBO0FBQzNELFVBQU0sQ0FBQyxhQUFhLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtBQUM1QyxZQUFRLENBQUMsT0FBTyxFQUFFLENBQUE7QUFDbEIsVUFBTSxDQUFDLGFBQWEsQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQzdDLENBQUMsQ0FBQTtBQUNGLElBQUUsQ0FBQywwQ0FBMEMsRUFBRSxZQUFXO0FBQ3hELFFBQUksWUFBWSxHQUFHLENBQUMsQ0FBQTtBQUNwQixpQkFBYSxDQUFDLFdBQVcsQ0FBQyxZQUFXO0FBQ25DLGtCQUFZLEVBQUUsQ0FBQTtLQUNmLENBQUMsQ0FBQTtBQUNGLFVBQU0sQ0FBQyxZQUFZLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDNUIsUUFBTSxRQUFRLEdBQUcsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQTtBQUM3RCxVQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVCLFlBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyx5QkFBWSxDQUFDLENBQUMsQ0FBQTtBQUN2QyxVQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVCLFlBQVEsQ0FBQyxjQUFjLENBQUMsQ0FBQyx5QkFBWSxDQUFDLENBQUMsQ0FBQTtBQUN2QyxVQUFNLENBQUMsWUFBWSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0FBQzVCLFlBQVEsQ0FBQyxPQUFPLEVBQUUsQ0FBQTtBQUNsQixZQUFRLENBQUMsY0FBYyxDQUFDLENBQUMseUJBQVksQ0FBQyxDQUFDLENBQUE7QUFDdkMsVUFBTSxDQUFDLFlBQVksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQTtHQUM3QixDQUFDLENBQUE7QUFDRixJQUFFLENBQUMsOENBQThDLEVBQUUsWUFBVztBQUM1RCxVQUFNLENBQUMsYUFBYSxDQUFDLFFBQVEsQ0FBQyxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUE7QUFDbEUsVUFBTSxDQUFDLGFBQWEsQ0FBQyxRQUFRLENBQUMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFBO0dBQ3JFLENBQUMsQ0FBQTtDQUNILENBQUMsQ0FBQSIsImZpbGUiOiIvaG9tZS9yZW1jby8uYXRvbS9wYWNrYWdlcy9saW50ZXIvc3BlYy9pbmRpZS1yZWdpc3RyeS1zcGVjLmpzIiwic291cmNlc0NvbnRlbnQiOlsiLyogQGZsb3cgKi9cblxuaW1wb3J0IEluZGllUmVnaXN0cnkgZnJvbSAnLi4vbGliL2luZGllLXJlZ2lzdHJ5J1xuaW1wb3J0IHsgZ2V0TWVzc2FnZSB9IGZyb20gJy4vY29tbW9uJ1xuXG5kZXNjcmliZSgnSW5kaWVSZWdpc3RyeScsIGZ1bmN0aW9uKCkge1xuICBsZXQgaW5kaWVSZWdpc3RyeVxuXG4gIGJlZm9yZUVhY2goZnVuY3Rpb24oKSB7XG4gICAgaW5kaWVSZWdpc3RyeSA9IG5ldyBJbmRpZVJlZ2lzdHJ5KClcbiAgfSlcbiAgYWZ0ZXJFYWNoKGZ1bmN0aW9uKCkge1xuICAgIGluZGllUmVnaXN0cnkuZGlzcG9zZSgpXG4gIH0pXG5cbiAgaXQoJ3RyaWdnZXJzIG9ic2VydmUgd2l0aCBleGlzdGluZyBhbmQgbmV3IGRlbGVnYXRlcycsIGZ1bmN0aW9uKCkge1xuICAgIGxldCBvYnNlcnZlQ2FsbGVkID0gMFxuICAgIGluZGllUmVnaXN0cnkucmVnaXN0ZXIoeyBuYW1lOiAnQ2hpJyB9LCAyKVxuICAgIGluZGllUmVnaXN0cnkub2JzZXJ2ZShmdW5jdGlvbigpIHtcbiAgICAgIG9ic2VydmVDYWxsZWQrK1xuICAgIH0pXG4gICAgZXhwZWN0KG9ic2VydmVDYWxsZWQpLnRvQmUoMSlcbiAgICBpbmRpZVJlZ2lzdHJ5LnJlZ2lzdGVyKHsgbmFtZTogJ1BpbmcnIH0sIDIpXG4gICAgZXhwZWN0KG9ic2VydmVDYWxsZWQpLnRvQmUoMilcbiAgICBpbmRpZVJlZ2lzdHJ5LnJlZ2lzdGVyKHsgbmFtZTogJ1BvbmcnIH0sIDIpXG4gICAgZXhwZWN0KG9ic2VydmVDYWxsZWQpLnRvQmUoMylcbiAgfSlcbiAgaXQoJ3JlbW92ZXMgZGVsZWdhdGVzIGZyb20gcmVnaXN0cnkgYXMgc29vbiBhcyB0aGV5IGFyZSBkaXNwb3NlJywgZnVuY3Rpb24oKSB7XG4gICAgZXhwZWN0KGluZGllUmVnaXN0cnkuZGVsZWdhdGVzLnNpemUpLnRvQmUoMClcbiAgICBjb25zdCBkZWxlZ2F0ZSA9IGluZGllUmVnaXN0cnkucmVnaXN0ZXIoeyBuYW1lOiAnQ2hpJyB9LCAyKVxuICAgIGV4cGVjdChpbmRpZVJlZ2lzdHJ5LmRlbGVnYXRlcy5zaXplKS50b0JlKDEpXG4gICAgZGVsZWdhdGUuZGlzcG9zZSgpXG4gICAgZXhwZWN0KGluZGllUmVnaXN0cnkuZGVsZWdhdGVzLnNpemUpLnRvQmUoMClcbiAgfSlcbiAgaXQoJ3RyaWdnZXJzIHVwZGF0ZSBhcyBkZWxlZ2F0ZXMgYXJlIHVwZGF0ZWQnLCBmdW5jdGlvbigpIHtcbiAgICBsZXQgdGltZXNVcGRhdGVkID0gMFxuICAgIGluZGllUmVnaXN0cnkub25EaWRVcGRhdGUoZnVuY3Rpb24oKSB7XG4gICAgICB0aW1lc1VwZGF0ZWQrK1xuICAgIH0pXG4gICAgZXhwZWN0KHRpbWVzVXBkYXRlZCkudG9CZSgwKVxuICAgIGNvbnN0IGRlbGVnYXRlID0gaW5kaWVSZWdpc3RyeS5yZWdpc3Rlcih7IG5hbWU6ICdQYW5kYScgfSwgMilcbiAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDApXG4gICAgZGVsZWdhdGUuc2V0QWxsTWVzc2FnZXMoW2dldE1lc3NhZ2UoKV0pXG4gICAgZXhwZWN0KHRpbWVzVXBkYXRlZCkudG9CZSgxKVxuICAgIGRlbGVnYXRlLnNldEFsbE1lc3NhZ2VzKFtnZXRNZXNzYWdlKCldKVxuICAgIGV4cGVjdCh0aW1lc1VwZGF0ZWQpLnRvQmUoMilcbiAgICBkZWxlZ2F0ZS5kaXNwb3NlKClcbiAgICBkZWxlZ2F0ZS5zZXRBbGxNZXNzYWdlcyhbZ2V0TWVzc2FnZSgpXSlcbiAgICBleHBlY3QodGltZXNVcGRhdGVkKS50b0JlKDIpXG4gIH0pXG4gIGl0KCdwYXNzZXMgb24gdmVyc2lvbiBjb3JyZWN0bHkgdG8gdGhlIGRlbGVnYXRlcycsIGZ1bmN0aW9uKCkge1xuICAgIGV4cGVjdChpbmRpZVJlZ2lzdHJ5LnJlZ2lzdGVyKHsgbmFtZTogJ09sYScgfSwgMikudmVyc2lvbikudG9CZSgyKVxuICAgIGV4cGVjdChpbmRpZVJlZ2lzdHJ5LnJlZ2lzdGVyKHsgbmFtZTogJ0hlbGxvJyB9LCAxKS52ZXJzaW9uKS50b0JlKDEpXG4gIH0pXG59KVxuIl19