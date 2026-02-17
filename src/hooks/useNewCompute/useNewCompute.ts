import { type DependencyList, useEffect, useRef } from 'react'
import type { Watcher } from 'watch-state'
import { Compute } from 'watch-state'

export function useNewCompute <T> (watcher: Watcher<T>, deps?: DependencyList) {
  const result = useRef<Compute<T>>()
  const watcherRef = useRef(watcher)
  const updateRef = useRef(false)

  watcherRef.current = watcher

  useEffect(() => {
    if (deps && updateRef.current) {
      result.current.update()
    }
  }, deps)

  useEffect(() => {
    updateRef.current = true

    return () => result.current.destroy()
  }, [])

  return result.current || (result.current = new Compute(update => watcherRef.current(update), true))
}
