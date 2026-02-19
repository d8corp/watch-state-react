import { useSyncExternalStore } from 'react';
import { Watch } from 'watch-state';

/** @deprecated Use `useSelector` */
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

export { useWatcher };
