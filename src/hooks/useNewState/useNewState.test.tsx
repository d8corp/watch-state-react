import '@testing-library/jest-dom'

import { fireEvent, render } from '@testing-library/react'
import type { Ref } from 'react'
import React, { act, createContext, createRef, useContext } from 'react'
import type { Observable } from 'watch-state'

import { useObservable } from '../useObservable'
import { useNewState } from './useNewState'

describe('useNewState', () => {
  it('should only re-render consumer, not intermediate components', () => {
    let renderCount = 0

    const Test = ({ say }: { say: Observable<string> }) => {
      const value = useObservable(say)

      return <>{value}</>
    }

    const Parent = ({ inputRef }: { inputRef: Ref<HTMLInputElement> }) => {
      const $text = useNewState('Hello!')

      renderCount++

      return (
        <>
          <Test say={$text} />
          <input
            ref={inputRef}
            onInput={(e) => {
              $text.value = e.currentTarget.value
            }}
          />
        </>
      )
    }

    const inputRef = createRef<HTMLInputElement>()

    const { container } = render(<Parent inputRef={inputRef} />)

    expect(container.innerHTML).toBe('Hello!<input>')
    expect(renderCount).toBe(1)

    fireEvent.input(inputRef.current, { target: { value: 'Buy!' } })

    expect(container.innerHTML).toBe('Buy!<input>')
    expect(renderCount).toBe(1)
  })

  it('should share state via context without prop drilling', () => {
    const CountContext = createContext<Observable<number> | undefined>(undefined)

    const useCount = () => {
      const $count = useContext(CountContext)

      if (!$count) throw new Error('CountContext must be provided')

      return useObservable($count)
    }

    let parentRenderCount = 0

    function Parent () {
      const $count = useNewState(0)

      const handleClick = () => {
        $count.value++
      }

      parentRenderCount++

      return (
        <CountContext.Provider value={$count}>
          <button onClick={handleClick}>+</button>
          <Child />
        </CountContext.Provider>
      )
    }

    function Child () {
      const count = useCount()

      return <div>{count}</div>
    }

    const { container } = render(<Parent />)

    expect(container.innerHTML).toBe('<button>+</button><div>0</div>')
    expect(parentRenderCount).toBe(1)

    act(() => {
      container.querySelector('button').click()
    })

    expect(container.innerHTML).toBe('<button>+</button><div>1</div>')
    expect(parentRenderCount).toBe(1)

    act(() => {
      container.querySelector('button').click()
    })

    expect(container.innerHTML).toBe('<button>+</button><div>2</div>')
    expect(parentRenderCount).toBe(1)
  })
})
