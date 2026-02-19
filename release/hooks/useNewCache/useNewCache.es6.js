import '../useNewCompute/index.es6.js';
import { useNewCompute } from '../useNewCompute/useNewCompute.es6.js';

/** @deprecated Use `useNewCompute` */
function useNewCache(watcher, deps) {
    if (deps === void 0) { deps = []; }
    return useNewCompute(watcher, deps);
}

export { useNewCache };
