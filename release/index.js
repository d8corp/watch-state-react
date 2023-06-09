'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var watchState = require('watch-state');

function useWatch(state) {
    return react.useSyncExternalStore(function (callback) {
        var watcher = new watchState.Watch(function (update) {
            if (update)
                callback();
            return state.value;
        }, true);
        return function () {
            watcher.destroy();
        };
    }, function () { return state.value; });
}
function useWatcher(state) {
    return react.useSyncExternalStore(function (callback) {
        var watcher = new watchState.Watch(function (update) {
            if (update)
                callback();
            return state(update);
        }, true);
        return function () {
            watcher.destroy();
        };
    }, function () { return state(false); });
}
function useNewState(defaultValue) {
    var ref = react.useRef();
    return ref.current || (ref.current = new watchState.State(defaultValue));
}
function useNewCache(watcher, deps) {
    var ref = react.useRef();
    react.useEffect(function () { return function () {
        ref.current.destroy();
    }; }, []);
    return react.useMemo(function () {
        var _a;
        (_a = ref.current) === null || _a === void 0 ? void 0 : _a.destroy();
        return (ref.current = new watchState.Cache(watcher, true));
    }, deps);
}

exports.useNewCache = useNewCache;
exports.useNewState = useNewState;
exports.useWatch = useWatch;
exports.useWatcher = useWatcher;
