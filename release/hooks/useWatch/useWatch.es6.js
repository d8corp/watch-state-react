import '../useObservable/index.es6.js';
import { useObservable } from '../useObservable/useObservable.es6.js';

/** @deprecated Use `useObservable` */
function useWatch(state) {
    return useObservable(state);
}

export { useWatch };
