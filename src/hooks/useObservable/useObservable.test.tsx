import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Compute, createEvent, State } from 'watch-state'

import { useObservable } from '.'

describe('useObservable', () => {
  test('state', () => {
    const $count = new State(0)

    const increase = () => {
      $count.value++
    }

    const Button = () => {
      const count = useObservable($count)

      return <button onClick={increase}>{count}</button>
    }

    render(<Button />)

    expect(screen.queryByText('0')).toBeInTheDocument()

    fireEvent.click(screen.queryByText('0'))

    expect(screen.queryByText('1')).toBeInTheDocument()

    fireEvent.click(screen.queryByText('1'))

    expect(screen.queryByText('2')).toBeInTheDocument()
  })

  test('compute', () => {
    const name = new State('Foo')
    const surname = new State('Bar')
    const fullName = new Compute(() => `${name.value} ${surname.value[0]}.`)

    let isRendered = false

    const changeSurname = () => {
      surname.value = 'Baz'
    }

    const Button = () => {
      const value = useObservable(fullName)

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

  test('batching', () => {
    const $a = new State(1)
    const $b = new State(2)
    const $sum = new Compute(() => $a.value + $b.value)

    let renderCount = 0

    const increase = createEvent(() => {
      $a.value++
      $b.value++
    })

    const Button = () => {
      const sum = useObservable($sum)

      renderCount++

      return <button onClick={increase}>{sum}</button>
    }

    render(<Button />)

    expect(screen.queryByText('3')).toBeInTheDocument()
    expect(renderCount).toBe(1)

    fireEvent.click(screen.queryByText('3'))

    expect(screen.queryByText('5')).toBeInTheDocument()
    expect(renderCount).toBe(2)

    fireEvent.click(screen.queryByText('5'))

    expect(screen.queryByText('7')).toBeInTheDocument()
    expect(renderCount).toBe(3)
  })
})
