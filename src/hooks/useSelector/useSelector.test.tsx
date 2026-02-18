import '@testing-library/jest-dom'

import { fireEvent, render, screen } from '@testing-library/react'
import React, { useState } from 'react'
import { State } from 'watch-state'

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
})
