import { useSyncExternalStore } from 'react'
import type { Watcher } from 'watch-state'
import { Watch } from 'watch-state'

/** @deprecated Use `useSelector` */
export function useWatcher<S> (state: Watcher<S>): S {
  return useSyncExternalStore(callback => {
    const watcher = new Watch(update => {
      if (update) callback()

      return state(update)
    }, true)

    return () => {
      watcher.destroy()
    }
  }, () => state(false))
}
