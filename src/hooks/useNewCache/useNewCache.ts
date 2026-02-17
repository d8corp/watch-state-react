import type { DependencyList } from 'react'
import { useEffect, useMemo, useRef } from 'react'
import type { Watcher } from 'watch-state'
import { Cache } from 'watch-state'

/** @deprecated Use `useNewCompute` */
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
