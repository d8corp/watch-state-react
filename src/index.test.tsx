import ReactDom from 'react-dom'
import React, {Component, ReactElement, useEffect, useState} from 'react'
import {act} from 'react-dom/test-utils'
import watch, {State, Cache, state, cache, getState, mixer, getCache, useWatch} from '.'

function render (component: ReactElement): HTMLDivElement {
  const div = document.createElement('div')
  ReactDom.render(component, div)
  return div
}

describe('react', () => {
  describe('function component', () => {
    test('state', () => {
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
    test('cache', () => {
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
    test('watcher', () => {
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
    test('example', () => {
      const $show = new State(false)

      const AsideMenuButton = () => {
        const toggle = () => $show.value = !$show.value
        return <button onClick={toggle} />
      }

      const AsideMenu = () => {
        const show = useWatch($show)

        return show ? (
          <div>Aside Menu</div>
        ) : null
      }

      const test = render(
        <>
          <AsideMenuButton />
          <AsideMenu />
        </>
      )

      expect(test.innerHTML).toBe('<button></button>')

      test.querySelector('button').click()

      expect(test.innerHTML).toBe('<button></button><div>Aside Menu</div>')

      test.querySelector('button').click()

      expect(test.innerHTML).toBe('<button></button>')
    })
  })
  describe('class component', () => {
    test('simple', () => {
      const state = new State(0)

      @watch
      class Test extends Component {
        render () {
          return <>{state.value}</>
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
    test('componentWillUnmount', () => {
      let unmount = 0

      @watch
      class Test extends Component {
        componentWillUnmount () {
          unmount++
        }
        render () {
          return null
        }
      }

      const show = new State(true)

      @watch
      class Wrapper extends Component {
        render () {
          return show.value ? <Test /> : null
        }
      }

      render(<Wrapper />)

      expect(unmount).toBe(0)

      show.value = false

      expect(unmount).toBe(1)
    })
    test('clear cache', () => {
      let done = false
      const state = new State('Hello')

      @watch
      class Test extends Component {
        @cache get text () {
          return state.value + ', World'
        }
        componentDidMount () {
          getCache(this, 'text').onDestroy(() => done = true)
        }

        render() {
          return this.text
        }
      }

      const show = new State(true)

      @watch
      class Wrapper extends Component {
        render () {
          return show.value ? <Test /> : null
        }
      }

      const test = render(<Wrapper />)

      expect(test.innerHTML).toBe('Hello, World')
      expect(done).toBe(false)

      show.value = false

      expect(test.innerHTML).toBe('')
      expect(done).toBe(true)
    })
    test('clear mixer', () => {
      let done = false
      const state = new State('Hello')

      @watch
      class Test extends Component<{value: string}> {
        @mixer get text () {
          return state.value + this.props.value
        }

        render() {
          return this.text
        }
      }

      const show = new State(true)

      @watch
      class Wrapper extends Component {
        render () {
          return show.value ? <Test value=', World' /> : null
        }
      }

      const test = render(<Wrapper />)

      expect(test.innerHTML).toBe('Hello, World')
      expect(done).toBe(false)

      show.value = false

      expect(test.innerHTML).toBe('')
    })
    test('with state', async () => {
      @watch
      class Test extends Component {
        render () {
          return this.props.children
        }
      }

      function Wrapper () {
        const [value, setState] = useState(1)
        useEffect(() => {
          setTimeout(() => {
            act(() => setState(2))
          })
        }, [value])
        return <Test>{value}</Test>
      }

      const test = render(<Wrapper />)

      expect(test.innerHTML).toBe('1')

      await new Promise(resolve => setTimeout(resolve, 100))

      expect(test.innerHTML).toBe('2')
    })
  })
})
