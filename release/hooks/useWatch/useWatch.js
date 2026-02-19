'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../useObservable/index.js');
var useObservable = require('../useObservable/useObservable.js');

/** @deprecated Use `useObservable` */
function useWatch(state) {
    return useObservable.useObservable(state);
}

exports.useWatch = useWatch;
