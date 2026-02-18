import '@testing-library/jest-dom'

import { render } from '@testing-library/react'
import React, { act } from 'react'
import type { Observable } from 'watch-state'
import { State } from 'watch-state'

import { useWatch } from '../useWatch'
import { useNewCompute } from './useNewCompute'

describe('useNewCompute', () => {
  it('should return stable reference to prevent child re-renders', () => {
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
})
