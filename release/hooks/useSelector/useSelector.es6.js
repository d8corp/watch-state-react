import { useSyncExternalStore } from 'react';
import '../../utils/index.es6.js';
import { subscribe } from '../../utils/subscribe/subscribe.es6.js';

/**
 * React hook to select a portion of state or derive data from the current state.
 *
 * @description
 * Uses `useSyncExternalStore` for correct synchronization of external stores with React.
 * Automatically subscribes via `Watch` and unsubscribes on unmount.
 * React automatically optimizes re-renders — component only updates when the selected value actually changes
 * (compared using `Object.is`).
 *
 * @example
 * ```ts
 * const $user = new State({ name: 'Alice', age: 30 })
 *
 * const UserProfile = () => {
 *   const name = useSelector(() => $user.value.name)
 *   const isAdult = useSelector(() => $user.value.age >= 18)
 *
 *   return (
 *     <div>
 *       <h1>{name}</h1>
 *       <p>Adult: {isAdult ? 'Yes' : 'No'}</p>
 *     </div>
 *   )
 * }
 * ```
 *
 * @param selector - A function that selects or derives a value from the current state.
 * @returns The selected or derived value. Re-render occurs only when the value actually changes.
 * @template T The type of the selected value
 */
function useSelector(selector) {
    return useSyncExternalStore(subscribe, selector);
}

export { useSelector };
