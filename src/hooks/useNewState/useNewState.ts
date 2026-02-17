import { useRef } from 'react'
import { State } from 'watch-state'

export function useNewState<S> (defaultValue?: S): State<S> {
  const ref = useRef<State<S>>()

  return ref.current || (ref.current = new State(defaultValue))
}
