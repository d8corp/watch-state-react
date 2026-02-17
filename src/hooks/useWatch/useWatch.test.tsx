import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'
import React, { useState } from 'react'
import { Compute, State } from 'watch-state'

import { useWatch } from '.'

describe('useWatch', () => {
  test('state', () => {
    const $count = new State(0)

    const increase = () => {
      $count.value++
    }

    const Button = () => {
      const count = useWatch($count)

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
      const value = useWatch(fullName)

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

  test('selection', () => {
    const name = new State('Foo')
    const surname = new State('Bar')

    let isRendered = false

    const changeSurname = () => {
      surname.value = 'Baz'
    }

    const Button = () => {
      const value = useWatch(() => `${name.value} ${surname.value[0]}.`)

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
      const fullName = useWatch(() => `${name} ${surname.value[0]}.`)

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
})
