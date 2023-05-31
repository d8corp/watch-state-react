import React, { type ReactElement } from 'react'
import { createRoot } from 'react-dom/client'
import { Cache, State } from 'watch-state'

import { useWatch } from '.'

function render (component: ReactElement): HTMLDivElement {
  const div = document.createElement('div')
  const root = createRoot(div)
  root.render(component)
  return div
}

function wait (timeout = 0) {
  return new Promise(resolve => setTimeout(resolve, timeout))
}

describe('react', () => {
  describe('function component', () => {
    test('state', async () => {
      const state = new State(0)

      const Test = () => {
        const value = useWatch(state)

        return (
          <>
            {value}
          </>
        )
      }

      const test = render(<Test />)

      await wait()

      expect(test.innerHTML).toBe('0')

      state.value++

      await wait()

      expect(test.innerHTML).toBe('1')

      state.value++

      await wait()

      expect(test.innerHTML).toBe('2')
    })
    test('cache', async () => {
      const name = new State('Mike')
      const surname = new State('Deight')
      const fullName = new Cache(() => `${name.value} ${surname.value[0]}.`)

      const Test = () => {
        const value = useWatch(fullName)

        return (
          <>
            {value}
          </>
        )
      }

      const test = render(<Test />)

      await wait()

      expect(test.innerHTML).toBe('Mike D.')

      name.value = 'Morty'

      await wait()

      expect(test.innerHTML).toBe('Morty D.')

      surname.value = 'Test'

      await wait()

      expect(test.innerHTML).toBe('Morty T.')
    })
    test('watcher', async () => {
      const name = new State('Mike')
      const surname = new State('Deight')

      const Test = () => {
        const value = useWatch(() => `${name.value} ${surname.value[0]}.`)

        return (
          <>
            {value}
          </>
        )
      }

      const test = render(<Test />)

      await wait()

      expect(test.innerHTML).toBe('Mike D.')

      name.value = 'Morty'

      await wait()

      expect(test.innerHTML).toBe('Morty D.')

      surname.value = 'Test'

      await wait()

      expect(test.innerHTML).toBe('Morty T.')
    })
    test('example', async () => {
      const $show = new State(false)

      const AsideMenuButton = () => {
        const toggle = () => {
          $show.value = !$show.value
        }
        return <button onClick={toggle} />
      }

      const AsideMenu = () => {
        const show = useWatch($show)

        return show
          ? (
            <div>Aside Menu</div>
            )
          : null
      }

      const test = render(
        <>
          <AsideMenuButton />
          <AsideMenu />
        </>,
      )

      await wait()

      expect(test.innerHTML).toBe('<button></button>')

      test.querySelector('button').click()

      await wait()

      expect(test.innerHTML).toBe('<button></button><div>Aside Menu</div>')

      test.querySelector('button').click()

      await wait()

      expect(test.innerHTML).toBe('<button></button>')
    })
  })
})
