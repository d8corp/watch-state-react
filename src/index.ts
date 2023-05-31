import { useSyncExternalStore } from 'react'
import { type Observable, Watch, type Watcher } from 'watch-state'

export function useWatch<S> (state: Observable<S> | Watcher<S>): S {
  const getValue = (update: boolean) => typeof state === 'function'
    ? state(update)
    : state.value

  return useSyncExternalStore(callback => {
    const watcher = new Watch(update => {
      getValue(update)
      if (update) callback()
    }, true)

    return () => {
      watcher.destroy()
    }
  }, () => getValue(false))
}
