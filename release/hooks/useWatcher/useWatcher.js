'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var watchState = require('watch-state');

/** @deprecated Use `useSelector` */
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

exports.useWatcher = useWatcher;
