'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var watchState = require('watch-state');

function useWatch(state) {
    var getValue = function (update) { return typeof state === 'function'
        ? state(update)
        : state.value; };
    return react.useSyncExternalStore(function (callback) {
        var watcher = new watchState.Watch(function (update) {
            getValue(update);
            if (update)
                callback();
        }, true);
        return function () {
            watcher.destroy();
        };
    }, function () { return getValue(false); });
}

exports.useWatch = useWatch;
