'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var watchState = require('watch-state');
var decorators = require('@watch-state/decorators');
var react = require('react');

var WATCHER = Symbol('watcher');
var UPDATING = Symbol('watcher');
function watch(target) {
    var _a;
    var originalRender = (_a = target.prototype) === null || _a === void 0 ? void 0 : _a.render;
    if (originalRender) {
        var originalComponentWillUnmount_1 = target.prototype.componentWillUnmount;
        target.prototype.componentWillUnmount = function componentWillUnmount() {
            this[WATCHER].destroy();
            this[WATCHER] = undefined;
            var values = decorators.getDecors(this);
            if (values) {
                for (var key in values) {
                    var value = values[key];
                    if (value instanceof watchState.Cache) {
                        value.destroy();
                    }
                }
            }
            originalComponentWillUnmount_1 === null || originalComponentWillUnmount_1 === void 0 ? void 0 : originalComponentWillUnmount_1.apply(this, arguments);
        };
        target.prototype.render = function render() {
            var _this = this;
            var _a;
            var result, args = arguments;
            if (this[UPDATING]) {
                result = originalRender.apply(this, args);
            }
            else {
                (_a = this[WATCHER]) === null || _a === void 0 ? void 0 : _a.destroy();
                var watcher_1;
                watcher_1 = this[WATCHER] = new watchState.Watch(function (update) {
                    if (!update) {
                        result = originalRender.apply(_this, args);
                    }
                    else if (watcher_1 === _this[WATCHER]) {
                        _this[UPDATING] = true;
                        _this.forceUpdate();
                        _this[UPDATING] = false;
                    }
                }, true);
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
                watcher.destroy();
                watcher = undefined;
            }; });
            return result;
        };
    }
}
function getState(target, key) {
    return decorators.getDecors(target)[key];
}
function getCache(target, key) {
    return decorators.getDecors(target)[key];
}
var CACHE = Symbol('Mixer cache');
function mixer(target, key, desc) {
    var originRender = target.render;
    target.render = function render() {
        delete this[CACHE];
        return originRender.apply(this, arguments);
    };
    var originGet = desc.get;
    desc.get = function () {
        if (!(CACHE in this)) {
            this[CACHE] = originGet.call(this);
        }
        return this[CACHE];
    };
    return desc;
}

Object.keys(watchState).forEach(function (k) {
  if (k !== 'default') Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () {
      return watchState[k];
    }
  });
});
Object.keys(decorators).forEach(function (k) {
  if (k !== 'default') Object.defineProperty(exports, k, {
    enumerable: true,
    get: function () {
      return decorators[k];
    }
  });
});
exports.UPDATING = UPDATING;
exports.WATCHER = WATCHER;
exports.default = watch;
exports.getCache = getCache;
exports.getState = getState;
exports.mixer = mixer;
