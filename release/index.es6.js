import { useSyncExternalStore, useRef, useEffect, useMemo } from 'react';
import { Watch, State, Cache } from 'watch-state';

function useWatch(state) {
    return useSyncExternalStore(function (callback) {
        var watcher = new Watch(function (update) {
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
    return useSyncExternalStore(function (callback) {
        var watcher = new Watch(function (update) {
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
    var ref = useRef();
    return ref.current || (ref.current = new State(defaultValue));
}
function useNewCache(watcher, deps) {
    var ref = useRef();
    useEffect(function () { return function () {
        ref.current.destroy();
    }; }, []);
    return useMemo(function () {
        var _a;
        (_a = ref.current) === null || _a === void 0 ? void 0 : _a.destroy();
        return (ref.current = new Cache(watcher, true));
    }, deps);
}

export { useNewCache, useNewState, useWatch, useWatcher };
