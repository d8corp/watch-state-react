import '@testing-library/jest-dom'

import { fireEvent, render } from '@testing-library/react'
import type { Ref } from 'react'
import React, { act, createRef, useState } from 'react'
import type { Observable } from 'watch-state'
import { State } from 'watch-state'

import { useWatch } from '../useWatch'
import { useNewCompute } from './useNewCompute'

describe('useNewCompute', () => {
  test('no re-renders', () => {
    const name = new State('Foo')
    const surname = new State('Bar')
    let renderCount = 0

    function Parent () {
      const $name = useNewCompute(() => `${name.value} ${surname.value[0]}.`)

      return <Middle $name={$name} />
    }

    function Middle ({ $name }: { $name: Observable<string> }) {
      renderCount++

      return <Child $name={$name} />
    }

    function Child ({ $name }: { $name: Observable<string> }) {
      const name = useWatch($name)

      return <div>{name}</div>
    }

    const { container } = render(<Parent />)

    expect(container.innerHTML).toBe('<div>Foo B.</div>')
    expect(renderCount).toBe(1)

    act(() => {
      name.value = 'Baz'
    })

    expect(container.innerHTML).toBe('<div>Baz B.</div>')
    expect(renderCount).toBe(1)
  })

  test('deps', () => {
    const name = new State('Mike')
    const surname = new State('Deight')

    const Test = ({ say }: { say: string }) => {
      const text = useNewCompute(() => `${name.value} ${surname.value[0]}. says ${say}`, [say])
      const value = useWatch(text)

      return (
        <>
          {value}
        </>
      )
    }

    const Parent = ({ inputRef }: { inputRef: Ref<HTMLInputElement> }) => {
      const [text, setText] = useState('Hello!')

      return (
        <>
          <Test say={text} />
          <input ref={inputRef} onInput={(e) => setText(e.currentTarget.value)} />
        </>
      )
    }

    const inputRef = createRef<HTMLInputElement>()

    const { container } = render(<Parent inputRef={inputRef} />)

    expect(container.innerHTML).toBe('Mike D. says Hello!<input>')

    act(() => {
      name.value = 'Morty'
    })

    expect(container.innerHTML).toBe('Morty D. says Hello!<input>')

    act(() => {
      surname.value = 'Test'
    })

    expect(container.innerHTML).toBe('Morty T. says Hello!<input>')

    fireEvent.input(inputRef.current, { target: { value: 'Buy 8)' } })

    expect(container.innerHTML).toBe('Morty T. says Buy 8)<input>')

    act(() => {
      name.value = 'Rick'
    })

    expect(container.innerHTML).toBe('Rick T. says Buy 8)<input>')
  })
})
