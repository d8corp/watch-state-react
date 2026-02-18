import '@testing-library/jest-dom'

import { render } from '@testing-library/react'
import React, { act } from 'react'
import { State } from 'watch-state'

import { useWatch } from '.'

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
