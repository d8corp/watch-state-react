import { fireEvent } from '@testing-library/react'
import React, { createRef, type ReactElement, type Ref, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { act } from 'react-dom/test-utils'
import { State } from 'watch-state'

import { useNewCache, useWatch } from '.'

function render (component: ReactElement): HTMLDivElement {
  const div = document.createElement('div')
  const root = createRoot(div)

  act(() => {
    root.render(component)
  })

  return div
}

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

      const test = render(<Test />)

      expect(test.innerHTML).toBe('Mike D.')

      act(() => {
        name.value = 'Morty'
      })

      expect(test.innerHTML).toBe('Morty D.')

      act(() => {
        surname.value = 'Test'
      })

      expect(test.innerHTML).toBe('Morty T.')
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

      const test = render(<Parent inputRef={inputRef} />)

      expect(test.innerHTML).toBe('Mike D. says Hello!<input>')

      act(() => {
        name.value = 'Morty'
      })

      expect(test.innerHTML).toBe('Morty D. says Hello!<input>')

      act(() => {
        surname.value = 'Test'
      })

      expect(test.innerHTML).toBe('Morty T. says Hello!<input>')

      fireEvent.input(inputRef.current, { target: { value: 'Buy 8)' } })

      expect(test.innerHTML).toBe('Morty T. says Buy 8)<input>')

      act(() => {
        name.value = 'Rick'
      })

      expect(test.innerHTML).toBe('Rick T. says Buy 8)<input>')
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

      const test = render(
        <>
          <AsideMenuButton />
          <AsideMenu />
        </>,
      )

      expect(test.innerHTML).toBe('<button></button>')

      act(() => {
        test.querySelector('button').click()
      })

      expect(test.innerHTML).toBe('<button></button><div>Aside Menu</div>')

      act(() => {
        test.querySelector('button').click()
      })

      expect(test.innerHTML).toBe('<button></button>')
    })
  })
})
