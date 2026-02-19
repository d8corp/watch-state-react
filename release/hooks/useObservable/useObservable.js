'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

require('../useSelector/index.js');
var useSelector = require('../useSelector/useSelector.js');

/**
 * React hook to subscribe a component to changes in a **watch-state** `Observable`.
 *
 * @description
 * Uses `useSyncExternalStore` for correct synchronization of external stores with React.
 * Automatically subscribes via `Watch` and unsubscribes on unmount.
 * React automatically optimizes re-renders — component only updates when the `snapshot` actually changes
 * (compared using `Object.is`).
 *
 * @example
 * ```ts
 * const $count = new State(42)
 *
 * const increase = () => {
 *   $count.value++
 * }
 *
 * const Button = () => {
 *   const num = useObservable($count)
 *
 *   return <button onClick={increase}>{num}</button>
 * }
 * ```
 *
 * @param state - **watch-state** `Observable`
 * @returns Current state value. Re-render occurs only when value actually changes.
 * @template T The type of the state value
 */
function useObservable(state) {
    return useSelector.useSelector(function () { return state.value; });
}

exports.useObservable = useObservable;
