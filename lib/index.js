'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var watchState = require('watch-state');
var decorators = require('@watch-state/decorators');
var react = require('react');

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

function __read(o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
}

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
    }
    return target;
}
function getState(target, key) {
    return decorators.getDecors(target)[key];
}
function getCache(target, key) {
    return decorators.getDecors(target)[key];
}
var NULL = Symbol('Super Null');
function mixer(target, key, desc) {
    var VALUE = Symbol('Mixer cache');
    target[VALUE] = NULL;
    var originGet = desc.get;
    desc.get = function () {
        var _this = this;
        var _a;
        (_a = watchState.scope.activeWatcher) === null || _a === void 0 ? void 0 : _a.onDestroy(function () { return _this[VALUE] = NULL; });
        return this[VALUE] === NULL
            ? this[VALUE] = originGet.call(this)
            : this[VALUE];
    };
    return desc;
}
function useWatch(target) {
    var result;
    var watcher = react.useMemo(function () { return new watchState.Watch(function (update) {
        if (target instanceof watchState.State || target instanceof watchState.Cache) {
            result = target.value;
        }
        else {
            result = target(update);
        }
        if (update) {
            setValue(result);
        }
    }); }, [target]);
    var _a = __read(react.useState(result), 2), value = _a[0], setValue = _a[1];
    react.useEffect(function () { return function () {
        watcher.destroy();
    }; }, [watcher]);
    return value;
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
exports.useWatch = useWatch;
