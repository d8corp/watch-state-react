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
      const filteredProducts = useWatch($filteredProducts)

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
})
