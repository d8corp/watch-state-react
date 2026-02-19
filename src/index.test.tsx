import '@testing-library/jest-dom'

import { fireEvent, render } from '@testing-library/react'
import React, { act, useState } from 'react'
import { State } from 'watch-state'

import { useObservable } from '.'

describe('Examples', () => {
  test('Aside Menu', () => {
    const $show = new State(false)

    const AsideMenuButton = () => {
      const toggle = () => {
        $show.value = !$show.value
      }

      return <button onClick={toggle} />
    }

    const AsideMenu = () => {
      const show = useObservable($show)

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

  test('Todo List', () => {
    interface Todo {
      id: number
      text: string
      done: boolean
    }

    const $todos = new State<Todo[]>([])
    let nextId = 1

    const addTodo = (text: string) => {
      $todos.value.push({ id: nextId++, text, done: false })
      $todos.update()
    }

    const toggleTodo = (todoId: number) => {
      $todos.value = $todos.value.map(todo =>
        todoId === todo.id ? { ...todo, done: !todo.done } : todo,
      )
    }

    function TodoList () {
      const todos = useObservable($todos)
      const [text, setText] = useState('')

      const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (text.trim()) {
          addTodo(text.trim())
          setText('')
        }
      }

      return (
        <div>
          <form onSubmit={handleSubmit}>
            <input
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder='What needs to be done?'
            />
            <button type='submit'>Add</button>
          </form>
          <ul>
            {todos.map(({ id, done, text }) => (
              <li
                key={id}
                onClick={() => toggleTodo(id)}
                style={{ textDecoration: done ? 'line-through' : 'none' }}
              >
                {text}
              </li>
            ))}
          </ul>
        </div>
      )
    }

    const { container } = render(<TodoList />)

    expect(container.querySelectorAll('li').length).toBe(0)

    const input = container.querySelector('input')

    fireEvent.change(input, { target: { value: 'Buy milk' } })
    fireEvent.submit(container.querySelector('form'))

    expect(container.querySelectorAll('li').length).toBe(1)
    expect(container.querySelector('li').textContent).toBe('Buy milk')
    expect(container.querySelector('li').style.textDecoration).toBe('none')

    act(() => {
      container.querySelector('li').click()
    })

    expect(container.querySelector('li').style.textDecoration).toBe('line-through')

    act(() => {
      container.querySelector('li').click()
    })

    expect(container.querySelector('li').style.textDecoration).toBe('none')
  })
})
