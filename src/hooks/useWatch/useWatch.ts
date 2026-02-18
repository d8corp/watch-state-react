import type { Observable } from 'watch-state'

import { useObservable } from '../useObservable'

/** @deprecated Use `useObservable` */
export function useWatch<T> (state: Observable<T>): T {
  return useObservable(state)
}
