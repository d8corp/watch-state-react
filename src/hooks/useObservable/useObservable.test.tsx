import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'
import React from 'react'
import { Compute, State } from 'watch-state'

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
})
