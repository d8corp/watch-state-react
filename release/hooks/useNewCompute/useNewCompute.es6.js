import { useRef, useEffect } from 'react';
import { Compute } from 'watch-state';

/**
 * Creates a `Compute` instance that can be passed as a static prop to child components.
 * Reactivity is activated only in components that call `useWatch` on the Observable.
 * This pattern optimizes re-renders: parent components don't re-render when computed values change.
 *
 * @template T - The type of the computed value
 * @param watcher - A function that returns the computed value. This function can access reactive `State` or `Compute` instances.
 * @param deps - Optional dependency array that triggers recomputation when values change. Use this for props or external values that should trigger an update.
 * @returns A `Compute` instance containing the computed value.
 *
 * @example
 * ```tsx
 * // Basic usage //
 *
 * import { State } from 'watch-state'
 * import { useWatch, useNewCompute } from '@watch-state/react'
 *
 * const $name = new State('Mike')
 * const $surname = new State('Deight')
 *
 * const Parent = () => {
 *   const $fullName = useNewCompute(() => {
 *     return `${$name.value} ${$surname.value[0]}.`
 *   })
 *
 *   return <Child $fullName={$fullName} />
 * }
 *
 * const Child = ({ $fullName }) => {
 *   const fullName = useWatch($fullName)
 *
 *   return <div>{fullName}</div>
 * }
 * ```
 *
 * @example
 * ```tsx
 * // With dependencies //
 *
 * import { State } from 'watch-state'
 * import { useWatch, useNewCompute } from '@watch-state/react'
 *
 * const $name = new State('Mike')
 *
 * const Parent = ({ surname }) => {
 *   const $fullName = useNewCompute(() => {
 *     return `${$name.value} ${surname[0]}.`
 *   }, [surname])
 *
 *   return <Child $fullName={$fullName} />
 * }
 *
 * const Child = ({ $fullName }) => {
 *   const fullName = useWatch($fullName)
 *
 *   return <div>{fullName}</div>
 * }
 * ```
 */
function useNewCompute(watcher, deps) {
    var result = useRef();
    var watcherRef = useRef(watcher);
    var updateRef = useRef(false);
    watcherRef.current = watcher;
    useEffect(function () {
        if (deps && updateRef.current) {
            result.current.update();
        }
    }, deps);
    useEffect(function () {
        updateRef.current = true;
        return function () { return result.current.destroy(); };
    }, []);
    return result.current || (result.current = new Compute(function (update) { return watcherRef.current(update); }, true));
}

export { useNewCompute };
