import '@testing-library/jest-dom'

import { fireEvent, render } from '@testing-library/react'
import type { Ref } from 'react'
import React, { createRef } from 'react'
import type { Observable } from 'watch-state'

import { useWatch } from '../useWatch'
import { useNewState } from './useNewState'

describe('useNewState', () => {
  it('should only re-render consumer, not intermediate components', () => {
    let renderCount = 0

    const Test = ({ say }: { say: Observable<string> }) => {
      const value = useWatch(say)

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
})
