import { useRef } from 'react';
import { State } from 'watch-state';

/**
 * Creates a `State` instance that can be passed as a static prop to child components.
 * Reactivity is activated only in components that call `useWatch` on the Observable.
 * This pattern optimizes re-renders: parent components don't re-render when state changes.
 *
 * @template S - The type of the state value
 * @param defaultValue - Optional initial value for the state
 * @returns A `State` instance
 *
 * @example
 * ```tsx
 * // Basic usage //
 *
 * import { useWatch, useNewState } from '@watch-state/react'
 *
 * const Parent = () => {
 *   const $count = useNewState(0)
 *
 *   return <Child $count={$count} />
 * }
 *
 * const Child = ({ $count }) => {
 *   const count = useWatch($count)
 *
 *   return (
 *     <div>
 *       <span>{count}</span>
 *       <button onClick={() => $count.value++}>+</button>
 *     </div>
 *   )
 * }
 * ```
 */
function useNewState(defaultValue) {
    var ref = useRef();
    return ref.current || (ref.current = new State(defaultValue));
}

export { useNewState };
