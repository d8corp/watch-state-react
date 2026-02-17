import { Watch } from 'watch-state'

/**
 * Stable subscribe factory for `useSyncExternalStore` with watch-state.
 * Creates a `Watch` instance that calls the provided callback on state changes.
 *
 * @description
 * Memoized outside components to prevent recreation on every render.
 * Ensures React reuses the same subscription reference across re-renders.
 * Automatically cleans up with `watcher.destroy()` on unsubscribe.
 *
 * @example
 * ```ts
 * const state = new State(0)
 * const value = useSyncExternalStore(subscribe, () => state.value)
 * // same `useWatch(state)`
 * ```
 *
 * @param callback - Function to call when watch-state notifies changes
 * @returns Cleanup function that destroys the Watch instance
 */
export const subscribe = (callback: () => void) => {
  const watcher = new Watch(callback)

  return () => watcher.destroy()
}
