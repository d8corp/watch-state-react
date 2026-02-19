'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../useNewCompute/index.js');
var useNewCompute = require('../useNewCompute/useNewCompute.js');

/** @deprecated Use `useNewCompute` */
function useNewCache(watcher, deps) {
    if (deps === void 0) { deps = []; }
    return useNewCompute.useNewCompute(watcher, deps);
}

exports.useNewCache = useNewCache;
