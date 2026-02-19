import '@testing-library/jest-dom'

import { render } from '@testing-library/react'
import React, { act, createContext, useContext } from 'react'
import type { Observable } from 'watch-state'
import { State } from 'watch-state'

import { useNewState } from '../useNewState'
import { useObservable } from '../useObservable'
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
      const name = useObservable($name)

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

  it('should not re-render when computed value remains the same despite dependency changes', () => {
    let renderCount = 0

    function Parent () {
      const $name = useNewState('Foo')
      const $surname = useNewState('Bar')
      const $fullName = useNewCompute(() => `${$name.value} ${$surname.value[0]}.`)

      const fullName = useObservable($fullName)

      const handleClick = () => {
        $surname.value = 'Baz'
      }

      renderCount++

      return <button onClick={handleClick}>{fullName}</button>
    }

    const { container } = render(<Parent />)

    expect(container.innerHTML).toBe('<button>Foo B.</button>')
    expect(renderCount).toBe(1)

    act(() => {
      container.querySelector('button')?.click()
    })

    expect(container.innerHTML).toBe('<button>Foo B.</button>')
    expect(renderCount).toBe(1)
  })

  it('should update computed value when external state changes (demonstrates proper deps usage with useState)', () => {
    interface Product {
      id: number
      name: string
      price: number
    }

    const $products = new State<Product[]>([
      { id: 1, name: 'Apple', price: 10 },
      { id: 2, name: 'Banana', price: 5 },
      { id: 3, name: 'Cherry', price: 15 },
      { id: 4, name: 'Date', price: 6 },
    ])

    let renderCount = 0

    function ProductList () {
      const [minPrice, setMinPrice] = React.useState(4)

      const $filteredProducts = useNewCompute(
        () => $products.value.filter(p => p.price >= minPrice),
        [minPrice], // Correct: pass external state as dependency
      )

      return (
        <>
          <button onClick={() => setMinPrice(prev => prev - 1)}>−</button>
          <span>Min price: {minPrice}</span>
          <button onClick={() => setMinPrice(prev => prev + 1)}>+</button>
          <Middle $filteredProducts={$filteredProducts} />
        </>
      )
    }

    const Middle = React.memo(({ $filteredProducts }: { $filteredProducts: Observable<Product[]> }) => {
      renderCount++

      return <Child $filteredProducts={$filteredProducts} />
    })

    function Child ({ $filteredProducts }: { $filteredProducts: Observable<Product[]> }) {
      const filteredProducts = useObservable($filteredProducts)

      return (
        <ul>
          {filteredProducts.map(p => (
            <li key={p.id}>{p.name} - ${p.price}</li>
          ))}
        </ul>
      )
    }

    const { container, getByRole } = render(<ProductList />)

    // Initial: all $products visible (minPrice = 0)
    expect(container.querySelectorAll('li').length).toBe(4)
    expect(renderCount).toBe(1)

    // Click + button to increase minPrice to 5
    act(() => {
      getByRole('button', { name: '+' }).click()
    })

    expect(container.querySelectorAll('li').length).toBe(4) // Still all products (minPrice=5, all >= 5)
    expect(renderCount).toBe(1) // ✅ No re-render: Middle is memoized and props stable

    // Click + button again to increase minPrice to 6
    act(() => {
      getByRole('button', { name: '+' }).click()
    })

    expect(container.querySelectorAll('li').length).toBe(3)
    expect(container.innerHTML).toContain('Apple - $10')
    expect(container.innerHTML).toContain('Cherry - $15')
    expect(container.innerHTML).toContain('Date - $6')
    expect(renderCount).toBe(1)

    // Click + button again to increase minPrice to 7
    act(() => {
      getByRole('button', { name: '+' }).click()
    })

    expect(container.querySelectorAll('li').length).toBe(2)
    expect(container.innerHTML).toContain('Apple - $10')
    expect(container.innerHTML).toContain('Cherry - $15')
    expect(renderCount).toBe(1)
  })

  it('should update when props change via dependency array', () => {
    const $name = new State('Mike')

    function Parent ({ surname }: { surname: string }) {
      const $fullName = useNewCompute(() => (
        `${$name.value} ${surname[0]}.`
      ), [surname])

      return <Child $fullName={$fullName} />
    }

    function Child ({ $fullName }: { $fullName: Observable<string> }) {
      const fullName = useObservable($fullName)

      return <div>{fullName}</div>
    }

    const { container, rerender } = render(<Parent surname='Deight' />)

    expect(container.innerHTML).toBe('<div>Mike D.</div>')

    rerender(<Parent surname='Smith' />)

    expect(container.innerHTML).toBe('<div>Mike S.</div>')

    act(() => {
      $name.value = 'John'
    })

    expect(container.innerHTML).toBe('<div>John S.</div>')
  })

  it('should share computed value via context without prop drilling', () => {
    const $name = new State('Mike')
    const $surname = new State('Deight')

    const FullNameContext = createContext<Observable<string> | undefined>(undefined)

    const useFullName = () => {
      const $fullName = useContext(FullNameContext)

      if (!$fullName) throw new Error('FullNameContext must be provided')

      return useObservable($fullName)
    }

    let parentRenderCount = 0

    function Parent () {
      const $fullName = useNewCompute(() => `${$name.value} ${$surname.value[0]}.`)

      parentRenderCount++

      return (
        <FullNameContext.Provider value={$fullName}>
          <Child />
        </FullNameContext.Provider>
      )
    }

    function Child () {
      const fullName = useFullName()

      return <div>{fullName}</div>
    }

    const { container } = render(<Parent />)

    expect(container.innerHTML).toBe('<div>Mike D.</div>')
    expect(parentRenderCount).toBe(1)

    act(() => {
      $name.value = 'John'
    })

    expect(container.innerHTML).toBe('<div>John D.</div>')
    expect(parentRenderCount).toBe(1)

    act(() => {
      $surname.value = 'Smith'
    })

    expect(container.innerHTML).toBe('<div>John S.</div>')
    expect(parentRenderCount).toBe(1)
  })
})
