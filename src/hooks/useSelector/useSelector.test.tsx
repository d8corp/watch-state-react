import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'
import React, { act, useMemo, useState } from 'react'
import { callEvent, State } from 'watch-state'

import { useObservable } from '../useObservable'

import { useSelector } from '.'

describe('useSelector', () => {
  test('selection', () => {
    const name = new State('Foo')
    const surname = new State('Bar')

    let isRendered = false

    const changeSurname = () => {
      surname.value = 'Baz'
    }

    const Button = () => {
      const value = useSelector(() => `${name.value} ${surname.value[0]}.`)

      isRendered = true

      return <button onClick={changeSurname}>{value}</button>
    }

    render(<Button />)

    expect(screen.queryByText('Foo B.')).toBeInTheDocument()
    expect(surname.value).toBe('Bar')

    isRendered = false

    fireEvent.click(screen.queryByText('Foo B.'))

    expect(surname.value).toBe('Baz')
    expect(screen.queryByText('Foo B.')).toBeInTheDocument()
    expect(isRendered).toBe(false)
  })

  test('mixed state', () => {
    const surname = new State('Bar')

    let isRendered = false

    const changeSurname = () => {
      surname.value = 'Baz'
    }

    const Button = () => {
      const [name, setName] = useState('Foo')
      const fullName = useSelector(() => `${name} ${surname.value[0]}.`)

      const changeName = () => {
        setName('Mike')
      }

      isRendered = true

      return (
        <div>
          <button onClick={changeSurname}>Change Surname</button>
          <button onClick={changeName}>Change Name</button>
          <span>FullName: {fullName}</span>
        </div>
      )
    }

    render(<Button />)

    expect(screen.queryByText('FullName: Foo B.')).toBeInTheDocument()
    expect(surname.value).toBe('Bar')

    isRendered = false
    fireEvent.click(screen.queryByText('Change Name'))

    expect(isRendered).toBe(true)
    expect(screen.queryByText('FullName: Mike B.')).toBeInTheDocument()

    isRendered = false
    fireEvent.click(screen.queryByText('Change Surname'))

    expect(isRendered).toBe(false)
    expect(surname.value).toBe('Baz')
    expect(screen.queryByText('FullName: Mike B.')).toBeInTheDocument()
  })

  test('extracting fields', () => {
    const $user = new State({ name: 'Mike', age: 42 })

    let renderCount = 0

    const UserName = () => {
      const name = useSelector(() => $user.value.name)

      renderCount++

      return <div>Hello, {name}!</div>
    }

    const { container } = render(<UserName />)

    expect(container.innerHTML).toBe('<div>Hello, Mike!</div>')
    expect(renderCount).toBe(1)

    act(() => {
      $user.value.name = 'John'
      $user.update()
    })

    expect(container.innerHTML).toBe('<div>Hello, John!</div>')
    expect(renderCount).toBe(2)

    act(() => {
      $user.value.age = 50
      $user.update()
    })

    expect(container.innerHTML).toBe('<div>Hello, John!</div>')
    expect(renderCount).toBe(2)
  })

  test('combining multiple observables', () => {
    const $price = new State(100)
    const $quantity = new State(2)

    let renderCount = 0

    const Total = () => {
      const total = useSelector(() => $price.value * $quantity.value)

      renderCount++

      return <div>Total: ${total}</div>
    }

    const { container } = render(<Total />)

    expect(container.innerHTML).toBe('<div>Total: $200</div>')
    expect(renderCount).toBe(1)

    act(() => {
      $price.value = 150
    })

    expect(container.innerHTML).toBe('<div>Total: $300</div>')
    expect(renderCount).toBe(2)

    act(() => {
      $quantity.value = 3
    })

    expect(container.innerHTML).toBe('<div>Total: $450</div>')
    expect(renderCount).toBe(3)

    act(() => {
      callEvent(() => {
        $price.value = 30
        $quantity.value = 5
      })
    })

    expect(container.innerHTML).toBe('<div>Total: $150</div>')
    expect(renderCount).toBe(4)
  })

  test('optimizing with useMemo', () => {
    const $items = new State(['apple', 'banana', 'cherry'])

    let renderCount = 0

    const PrefixedItems = ({ prefix }: { prefix: string }) => {
      const items = useObservable($items)

      const prefixedItems = useMemo(() => {
        return items.map(item => `${prefix} - ${item}`)
      }, [items, prefix])

      renderCount++

      return <div>{prefixedItems.join(', ')}</div>
    }

    const { container } = render(<PrefixedItems prefix='fruit' />)

    expect(container.innerHTML).toBe('<div>fruit - apple, fruit - banana, fruit - cherry</div>')
    expect(renderCount).toBe(1)
  })
})
