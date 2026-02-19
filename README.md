<a href="https://www.npmjs.com/package/watch-state">
  <img src="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.3/img/logo.svg" align="left" width="90" height="90" alt="Watch-State logo by Mikhail Lysikov">
</a>

# &nbsp; @watch-state/react

&nbsp;

[![NPM](https://img.shields.io/npm/v/@watch-state/react.svg)](https://www.npmjs.com/package/@watch-state/react)
[![downloads](https://img.shields.io/npm/dm/@watch-state/react.svg)](https://www.npmtrends.com/@watch-state/react)
[![changelog](https://img.shields.io/badge/Changelog-⋮-brightgreen)](https://changelogs.xyz/@watch-state/react)
[![license](https://img.shields.io/npm/l/@watch-state/react)](https://github.com/d8corp/watch-state-react/blob/master/LICENSE)
[![tests](https://github.com/d8corp/watch-state-react/actions/workflows/tests.yml/badge.svg)](https://d8corp.github.io/watch-state-react/coverage/lcov-report/)

`@watch-state/react` provides **React hooks for watch-state** — a lightweight, high-performance reactive state engine.

[![stars](https://img.shields.io/github/stars/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/watchers)

## Index

<sup>**[ [Install](#install) ]**</sup>  
<sup>**[ [Hooks](#hooks) ]** [useObservable](#useobservable) • [useSelector](#useselector) • [useNewState](#usenewstate) • [useNewCompute](#usenewcompute)</sup>  
<sup>**[ [Utils](#utils) ]** [subscribe](#subscribe)</sup>  
<sup>**[ [Examples](#examples) ]** [Counter](#counter) • [Toggle](#toggle) • [Async](#async)</sup>  
<sup>**[ [Links](#links) ]**</sup>  
<sup>**[ [Issues](#issues) ]**</sup>

## Install
###### [🏠︎](#index) / Install [↓](#hooks)

**Requires [React 18+](https://www.npmjs.com/package/react) and [watch-state 3.5+](https://www.npmjs.com/package/watch-state).**

Use with any modern bundler (Vite, Webpack, Rollup, etc.) or framework (Next.js, Remix, etc.).

npm
```shell
npm i @watch-state/react
```

yarn
```shell
yarn add @watch-state/react
```

## Hooks
###### [🏠︎](#index) / Hooks [↑](#install) [↓](#utils)

<sup>[useObservable](#useobservable) • [useSelector](#useselector) • [useNewState](#usenewstate) • [useNewCompute](#usenewcompute)</sup>

### useObservable
###### [🏠︎](#index) / [Hooks](#hooks) / useObservable [↓](#useselector)

**Subscribe React components to watch-state changes with automatic re-render optimization.**

Uses `useSyncExternalStore` for correct synchronization with React. Automatically subscribes via `Watch` and unsubscribes on unmount.

#### Watching Observables

Pass a `State` instance (or any `Observable` subclass, such as `Compute`) to `useObservable()` to subscribe to its changes. The hook returns the current value and triggers a re-render whenever the observable is updated.

```tsx
import { State } from 'watch-state'
import { useObservable } from '@watch-state/react'

const $count = new State(0)

const increase = () => {
  $count.value++
}

const Button = () => {
  const count = useObservable($count)

  return <button onClick={increase}>{count}</button>
}
```

### useSelector
###### [🏠︎](#index) / [Hooks](#hooks) / useSelector [↑](#useobservable) [↓](#usenewstate)

You can pass a function to `useSelector()` to create a reactive selector that triggers re-renders only when the returned value changes. (compared with `Object.is`).

The function may be called multiple times during a single render, so it must be pure and simple.

Uses `useSyncExternalStore` for correct synchronization with React.

#### Basic Usage

This is ideal for lightweight, pure selections — e.g. extracting a field.

```tsx
import { State } from 'watch-state'
import { useSelector } from '@watch-state/react'

const $user = new State({ name: 'Mike', age: 42 })

const UserName = () => {
  const name = useSelector(() => $user.value.name)

  return <div>Hello, {name}!</div>
}
```

#### Combining Multiple Observables

You can combine multiple observables in one selector — the result updates reactively when any dependency changes.

```tsx
import { State } from 'watch-state'
import { useSelector } from '@watch-state/react'

const $price = new State(100)
const $quantity = new State(2)

const Total = () => {
  const total = useSelector(() => $price.value * $quantity.value)

  return <div>Total: ${total}</div>
}
```

Use `Compute` for complex computations or when returning new objects/arrays to avoid unnecessary recalculations or re-renders.

```tsx
import { Compute, State } from 'watch-state'
import { useObservable } from '@watch-state/react'

const $products = new State(['apple', 'banana', 'cherry'])

const $list = new Compute(() => {
  return $products.value.map(product => product.toUpperCase())
})

const Total = () => {
  const list = useObservable($list)

  return (
    <ul>
      {list.map((value, index) => (
        <li key={index}>{value}</li>
      ))}
    </ul>
  )
}
```

#### Combining with React State or Props

You can combine `useSelector()` with React's `useState` or props to react to both watch-state changes and local/component state.

```tsx
import { State } from 'watch-state'
import { useSelector, useState } from 'react'

const $basePrice = new State(100)

const ProductCard = ({ isMember }) => {
  const [quantity, setQuantity] = useState(1)
  
  const total = useSelector(() => {
    return $basePrice.value * quantity * (isMember ? 0.9 : 1)
  })

  return (
    <div>
      <p>Total: ${total}</p>
      <button onClick={() => setQuantity(q => q + 1)}>+</button>
    </div>
  )
}
```

This pattern is useful when you need to track both global state (via `useObservable`) and local component state (via `useState` or props).

#### Optimizing Expensive Computations with `useMemo`

For expensive computations (like array operations) or when returning new objects/arrays, use `useMemo` to avoid unnecessary recalculations.

```tsx
import { State } from 'watch-state'
import { useObservable } from '@watch-state/react'
import { useMemo } from 'react'

const $items = new State(['apple', 'banana', 'cherry'])

const PrefixedItems = ({ prefix }) => {
  const items = useObservable($items)

  const prefixedItems = useMemo(() => {
    return items.map(item => `${prefix} - ${item}`)
  }, [items, prefix])

  return <div>{prefixedItems.join(', ')}</div>
}
```

### useNewState
###### [🏠︎](#index) / [Hooks](#hooks) / useNewState [↑](#useobservable) [↓](#usenewcompute)

**Create a State instance inside a React component — persists across re-renders.**

```tsx
import { useObservable, useNewState } from '@watch-state/react'
import { useEffect } from 'react'

const Counter = () => {
  const $count = useNewState(0)

  useEffect(() => {
    const t = setInterval(() => {
      $count.value++
    }, 1000)

    return () => clearInterval(t)
  }, [])

  const value = useObservable($count)

  return <div>{value}</div>
}
```

### useNewCompute
###### [🏠︎](#index) / [Hooks](#hooks) / useNewCompute [↑](#usenewstate)

Creates a reactive computed value that automatically updates when its dependencies change. The hook returns a `Compute` instance that can be watched using `useObservable`.

**Parameters:**
- `watcher` — A function that returns the computed value. This function can access reactive `State` or `Compute` instances.
- `deps` (optional) — A dependency array that triggers recomputation when values change. Use this for props or external values that should trigger an update.

**Returns:**
- A `Compute` instance containing the computed value.

**Behavior:**
- Automatically tracks reactive dependencies (State/Compute instances) accessed within the watcher function
- Supports manual dependency array for prop-based recomputation
- Cleans up automatically when the component unmounts
- Maintains computation result across re-renders

```tsx
import { State } from 'watch-state'
import { useObservable, useNewCompute } from '@watch-state/react'

const $name = new State('Mike')
const $surname = new State('Deight')

const Parent = () => {
  const fullName = useNewCompute(() => `${$name.value} ${$surname.value[0]}.`)

  return <Child fullName={fullName} />
}

const Child = ({ fullName }) => {
  const value = useObservable(fullName)

  return <div>{value}</div>
}
```

**With dependency array for prop-based recomputation:**

```tsx
import { State } from 'watch-state'
import { useObservable, useNewCompute } from '@watch-state/react'

const $name = new State('Mike')

const Parent = ({ surname }) => {
  const fullName = useNewCompute(() => `${$name.value} ${surname[0]}.`, [surname])

  return <Child fullName={fullName} />
}

const Child = ({ fullName }) => {
  const value = useObservable(fullName)

  return <div>{value}</div>
}
```

## Utils
###### [🏠︎](#index) / Utils [↑](#hooks) [↓](#examples)

<sup>[subscribe](#subscribe)</sup>

### subscribe
###### [🏠︎](#index) / [Utils](#utils) / subscribe

**Stable subscription factory for `useSyncExternalStore` with watch-state.**

Used internally by `useObservable`. Creates a `Watch` instance that calls the provided callback on state changes.

```ts
import { subscribe } from '@watch-state/react'
import { State } from 'watch-state'

const $state = new State(0)

// Same as useObservable($state)
const value = useSyncExternalStore(subscribe, () => $state.value)
```

## Examples
###### [🏠︎](#index) / Examples [↑](#utils) [↓](#links)

<sup>[Counter](#counter) • [Toggle](#toggle) • [Async](#async)</sup>

### Counter
###### [🏠︎](#index) / [Examples](#examples) / Counter [↓](#toggle)

```tsx
import { State } from 'watch-state'
import { useObservable } from '@watch-state/react'

const $count = new State(0)

const increase = () => {
  $count.value++
}

export function CountButton () {
  const count = useObservable($count)

  return <button onClick={increase}>{count}</button>
}
```

### Toggle
###### [🏠︎](#index) / [Examples](#examples) / Toggle [↑](#counter) [↓](#async)

```tsx
import { State } from 'watch-state'
import { useObservable } from '@watch-state/react'

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
```

### Async
###### [🏠︎](#index) / [Examples](#examples) / Async [↑](#toggle)

```tsx
import { useObservable, useSelector } from '@watch-state/react'
import Async from '@watch-state/async'

const $api = new Async(
  () => fetch('/api/test')
    .then(r => r.json())
)

const User = () => {
  const value = useObservable($api)
  const loading = useSelector(() => $api.loading)
  const loaded = useSelector(() => $api.loaded)
  const error = useSelector(() => $api.error)

  if (error) {
    return <div>Error!</div>
  }

  if (!loaded) {
    return <div>Loading</div>
  }

  return (
    <div className={loading && 'loading'}>
      {value.some.fields}
    </div>
  )
}
```

## Links
###### [🏠︎](#index) / Links [↑](#examples) [↓](#issues)

- [React](https://reactjs.org)
- [watch-state](https://www.npmjs.com/package/watch-state)
- [@watch-state ecosystem](https://www.npmjs.com/search?q=%40watch-state)

## Issues
###### [🏠︎](#index) / Issues [↑](#links)

If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/watch-state-react/issues)

[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state-react)](https://github.com/d8corp/watch-state-react/issues)
