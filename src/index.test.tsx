import '@testing-library/jest-dom'

import { fireEvent, render } from '@testing-library/react'
import React, { act, createRef, type Ref, useState } from 'react'
import { State } from 'watch-state'

import { useNewCache, useWatch } from '.'

describe('react', () => {
  describe('useNewCache', () => {
    test('watcher', () => {
      const name = new State('Mike')
      const surname = new State('Deight')

      const Test = () => {
        const fullName = useNewCache(() => `${name.value} ${surname.value[0]}.`)
        const value = useWatch(fullName)

        return (
          <>
            {value}
          </>
        )
      }

      const { container } = render(<Test />)

      expect(container.innerHTML).toBe('Mike D.')

      act(() => {
        name.value = 'Morty'
      })

      expect(container.innerHTML).toBe('Morty D.')

      act(() => {
        surname.value = 'Test'
      })

      expect(container.innerHTML).toBe('Morty T.')
    })

    test('deps', () => {
      const name = new State('Mike')
      const surname = new State('Deight')

      const Test = ({ say }: { say: string }) => {
        const text = useNewCache(() => `${name.value} ${surname.value[0]}. says ${say}`, [say])
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

  describe('readme', () => {
    test('example 1', () => {
      const $show = new State(false)

      const AsideMenuButton = () => {
        const toggle = () => {
          $show.value = !$show.value
        }

        return <button onClick={toggle} />
      }

      const AsideMenu = () => {
        const show = useWatch($show)

        return show ? <div>Aside Menu</div> : null
      }

      const { container } = render(
        <>
          <AsideMenuButton />
          <AsideMenu />
        </>,
      )

      expect(container.innerHTML).toBe('<button></button>')

      act(() => {
        container.querySelector('button').click()
      })

      expect(container.innerHTML).toBe('<button></button><div>Aside Menu</div>')

      act(() => {
        container.querySelector('button').click()
      })

      expect(container.innerHTML).toBe('<button></button>')
    })
  })
})
