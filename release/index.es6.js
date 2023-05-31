import { useSyncExternalStore } from 'react';
import { Watch } from 'watch-state';

function useWatch(state) {
    var getValue = function (update) { return typeof state === 'function'
        ? state(update)
        : state.value; };
    return useSyncExternalStore(function (callback) {
        var watcher = new Watch(function (update) {
            getValue(update);
            if (update)
                callback();
        }, true);
        return function () {
            watcher.destroy();
        };
    }, function () { return getValue(false); });
}

export { useWatch };
