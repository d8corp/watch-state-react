import type { DependencyList } from 'react'
import type { Cache, Reaction, Watcher } from 'watch-state'

import { useNewCompute } from '../useNewCompute'

/** @deprecated Use `useNewCompute` */
export function useNewCache<S> (watcher?: Watcher<S>, deps: DependencyList = []): Cache<S> {
  return useNewCompute(watcher as Reaction<S>, deps)
}
