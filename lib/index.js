'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var watchState = require('watch-state');
var react = require('react');

var WATCHER = Symbol('watcher');
function watch(target) {
    var _a, _b;
    var originalRender = (_a = target.prototype) === null || _a === void 0 ? void 0 : _a.render;
    if (originalRender) {
        var originalComponentWillUnmount_1 = (_b = target.prototype) === null || _b === void 0 ? void 0 : _b.componentWillUnmount;
        target.prototype.componentWillUnmount = function componentWillUnmount() {
            this[WATCHER].destructor();
            this[WATCHER] = undefined;
            var values = watchState.stateValues(this);
            if (values) {
                for (var key in values) {
                    var value = values[key];
                    if (value instanceof watchState.Cache || value instanceof watchState.Mixer) {
                        value.destructor();
                    }
                }
            }
            originalComponentWillUnmount_1 === null || originalComponentWillUnmount_1 === void 0 ? void 0 : originalComponentWillUnmount_1.apply(this, arguments);
        };
        target.prototype.render = function render() {
            var _this = this;
            var _a, _b;
            var result, args = arguments;
            if ((_a = this[WATCHER]) === null || _a === void 0 ? void 0 : _a.updating) {
                result = originalRender.apply(this, args);
            }
            else {
                (_b = this[WATCHER]) === null || _b === void 0 ? void 0 : _b.destructor();
                this[WATCHER] = new watchState.Watch(function (update) {
                    if (update) {
                        _this.forceUpdate();
                    }
                    else {
                        result = originalRender.apply(_this, args);
                    }
                });
            }
            return result;
        };
        return target;
    }
    else {
        return function Component() {
            var _this = this;
            var setValue = react.useState({})[1];
            var args = arguments;
            var result;
            var watcher = new watchState.Watch(function (update) {
                if (update) {
                    setValue({});
                }
                else {
                    result = target.apply(_this, args);
                }
            });
            react.useEffect(function () { return function () {
                watcher.destructor();
                watcher = undefined;
            }; });
            return result;
        };
    }
}

Object.keys(watchState).forEach(function (k) {
  if (k !== 'default') Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () {
      return watchState[k];
    }
  });
});
exports.default = watch;
