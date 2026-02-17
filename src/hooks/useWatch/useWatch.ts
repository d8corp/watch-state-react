import { useSyncExternalStore } from 'react'
import type { Observable } from 'watch-state'

import { subscribe } from '../../utils'

/**
 * Argument type for the `useWatch` hook. Supports **watch-state** `Observable` or computed function.
 * @template T The type of the state value
 */
export type UseWatchArgument<T> = Observable<T> | (() => T)

/**
 * React hook to subscribe a component to changes in a **watch-state** `Observable` or computed function.
 *
 * @description
 * Uses `useSyncExternalStore` for correct synchronization of external stores with React.
 * Automatically subscribes via `Watch` and unsubscribes on unmount.
 * React automatically optimizes re-renders — component only updates when the `snapshot` actually changes
 * (compared using `Object.is`).
 *
 * @example
 * ```ts
 * const $num = new State(42)
 *
 * const increase = () => {
 *   $num.value++
 * }
 *
 * const Button = () => {
 *   const num = useWatch($num)
 *   const computed = useWatch(() => $num.value * 2)
 *
 *   return <button onClick={increase}>{num} * 2 = {computed}</button>
 * }
 * ```
 *
 * @param state - **watch-state** `Observable` or function returning current value
 * @returns Current state value. Re-render occurs only when value actually changes.
 * @template T The type of the state value
 */
export function useWatch<T> (state: UseWatchArgument<T>): T {
  return useSyncExternalStore(
    subscribe,
    () => typeof state === 'function' ? state() : state.value,
  )
}
