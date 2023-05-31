import { type DependencyList, useEffect, useMemo, useRef, useSyncExternalStore } from 'react'
import { Cache, type Observable, State, Watch, type Watcher } from 'watch-state'

export function useWatch<S> (state: Observable<S>): S {
  return useSyncExternalStore(callback => {
    const watcher = new Watch(update => {
      if (update) callback()
      return state.value
    }, true)

    return () => {
      watcher.destroy()
    }
  }, () => state.value)
}

export function useNewState<S> (defaultValue?: S): State<S> {
  const ref = useRef<State<S>>()

  return ref.current || (ref.current = new State(defaultValue))
}

export function useNewCache<S> (watcher?: Watcher<S>, deps?: DependencyList): Cache<S> {
  const ref = useRef<Cache<S>>()

  useEffect(() => () => {
    ref.current.destroy()
  }, [])

  return useMemo(() => {
    ref.current?.destroy()

    return (ref.current = new Cache<S>(watcher, true))
  }, deps)
}
