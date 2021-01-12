import ReactDom from 'react-dom'
import React, {Component, ReactElement} from 'react'
import { act } from 'react-dom/test-utils'
import watch, {State, Cache, state, cache, getState} from '.'

function render (component: ReactElement): HTMLDivElement {
  const div = document.createElement('div')
  ReactDom.render(component, div)
  return div
}

describe('react', () => {
  describe('function component', () => {
    test('simple', () => {
      const state = new State(0)
      const Test = watch<Function>(() => state.value)
      const test = render(<Test />)
      expect(test.innerHTML).toBe('0')

      act(() => {
        state.value++
      })

      expect(test.innerHTML).toBe('1')

      act(() => {
        state.value++
      })

      expect(test.innerHTML).toBe('2')
    })
  })
  describe('class component', () => {
    test('simple', () => {
      const state = new State(0)

      @watch
      class Test extends Component {
        render () {
          return state.value
        }
      }

      const test = render(<Test />)
      expect(test.innerHTML).toBe('0')

      state.value++

      expect(test.innerHTML).toBe('1')

      state.value++

      expect(test.innerHTML).toBe('2')
    })
    test('list', () => {
      const list = new State([])
      const cache = new Cache(() => list.value)

      @watch
      class Item extends Component <{id: number}> {
        render () {
          return cache.value[this.props.id]
        }
      }

      @watch
      class Test extends Component {
        render () {
          return cache.value.map((value, id) => <Item id={id} key={id} />)
        }
      }

      const test = render(<Test />)

      expect(test.innerHTML).toBe('')

      list.value = ['test1']

      expect(test.innerHTML).toBe('test1')

      list.value = []

      expect(test.innerHTML).toBe('')
    })
    test('todo', async () => {
      class Core {
        @state items = []
        @cache get sortedItems () {
          return [...this.items].sort()
        }
        addItem (item) {
          this.items.push(item)
          getState(this, 'items').update()
        }
      }

      const core = new Core()

      @watch
      class Items extends Component {
        render () {
          return core.sortedItems.map(todo => (
            <div key={todo}>{todo}</div>
          ))
        }
      }

      const test = render(<Items />)

      expect(test.innerHTML).toBe('')

      core.addItem('foo')

      expect(test.innerHTML).toBe('<div>foo</div>')
    })
  })
})
