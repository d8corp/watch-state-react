import { type DependencyList } from 'react';
import type { Watcher } from 'watch-state';
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
export declare function useNewCompute<T>(watcher: Watcher<T>, deps?: DependencyList): Compute<T>;
