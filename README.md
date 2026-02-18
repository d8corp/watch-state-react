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

Use `useWatch()` to subscribe components to state changes with **zero overhead** and **automatic re-render optimization**.

Built on top of [watch-state](https://www.npmjs.com/package/watch-state).

[![stars](https://img.shields.io/github/stars/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/watchers)

## Index

<sup>**[ [Install](#install) ]**</sup>  
<sup>**[ [Hooks](#hooks) ]** [useWatch](#usewatch) • [useNewState](#usenewstate) • [useNewCompute](#usenewcompute)</sup>  
<sup>**[ [Utils](#utils) ]** [subscribe](#subscribe)</sup>  
<sup>**[ [Examples](#examples) ]** [Counter](#counter) • [Toggle](#toggle) • [Async](#async)</sup>  
<sup>**[ [Links](#links) ]**</sup>  
<sup>**[ [Issues](#issues) ]**</sup>

## Install
###### [🏠︎](#index) / Install [↓](#hooks)

**Requires React 18+ and [watch-state](https://www.npmjs.com/package/watch-state).**

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

<sup>[useWatch](#usewatch) • [useNewState](#usenewstate) • [useNewCompute](#usenewcompute)</sup>

### useWatch
###### [🏠︎](#index) / [Hooks](#hooks) / useWatch [↓](#usenewstate)

**Subscribe React components to watch-state changes with automatic re-render optimization.**

Uses `useSyncExternalStore` for correct synchronization with React. Automatically subscribes via `Watch` and unsubscribes on unmount.

#### Watching Observables

Pass a `State` instance (or any `Observable` subclass, such as `Compute`) to `useWatch()` to subscribe to its changes. The hook returns the current value and triggers a re-render whenever the observable is updated.

```tsx
import { State } from 'watch-state'
import { useWatch } from '@watch-state/react'

const $count = new State(0)

const increase = () => {
  $count.value++
}

const Button = () => {
  const count = useWatch($count)

  return <button onClick={increase}>{count}</button>
}
```

#### Computed Functions

You can pass a function to `useWatch()` to create computed values that automatically track dependencies. The function will re-execute whenever any observable accessed within it changes, ensuring your derived values stay in sync with the source data.

This is especially useful when combining multiple observables with simple calculations. For complex computations, consider using `Compute` from watch-state, which provides memoization.

```tsx
const $price = new State(100)
const $quantity = new State(5)

const CartItem = () => {
  const total = useWatch(() => $price.value * $quantity.value)

  return <div>Total: ${total}</div>
}
```

In this example, `total` automatically recalculates whenever `$price` or `$quantity` changes — without needing to manually subscribe to each `State`.

#### Combining with React State or Props

You can combine `useWatch()` with React's `useState` or props to react to both watch-state changes and local/component state:

```tsx
const $price = new State(100)

const CartItem = ({ discountRate }) => {
  const [quantity, setQuantity] = useState(0)

  const total = useWatch(() => {
    const subtotal = $price.value * quantity
    const discount = quantity > 10 ? subtotal * discountRate : 0

    return subtotal - discount
  })

  return (
    <div>
      <p>Price: ${price} × Quantity: {quantity} = ${total}</p>
      {quantity > 10 && <p>Bulk discount applied!</p>}
      <button onClick={() => setQuantity(q => q - 1)}>-</button>
      <button onClick={() => setQuantity(q => q + 1)}>+</button>
    </div>
  )
}
```

This pattern is useful when you need to track both global state (via `useWatch`) and local component state (via `useState` or props).

### useNewState
###### [🏠︎](#index) / [Hooks](#hooks) / useNewState [↑](#usewatch) [↓](#usenewcompute)

**Create a State instance inside a React component — persists across re-renders.**

```tsx
import { useWatch, useNewState } from '@watch-state/react'
import { useEffect } from 'react'

const Counter = () => {
  const count = useNewState(0)

  useEffect(() => {
    const t = setInterval(() => {
      count.value++
    }, 1000)

    return () => clearInterval(t)
  }, [])

  const value = useWatch(count)

  return <div>{value}</div>
}
```

### useNewCompute
###### [🏠︎](#index) / [Hooks](#hooks) / useNewCompute [↑](#usenewstate)

**Create a Compute instance inside a React component with optional dependency array.**

```tsx
import { State } from 'watch-state'
import { useWatch, useNewCompute } from '@watch-state/react'

const $name = new State('Mike')
const $surname = new State('Deight')

const Parent = () => {
  const fullName = useNewCompute(() => `${$name.value} ${$surname.value[0]}.`)

  return <Child fullName={fullName} />
}

const Child = ({ fullName }) => {
  const value = useWatch(fullName)

  return <div>{value}</div>
}
```

**With dependency array for prop-based recomputation:**

```tsx
import { State } from 'watch-state'
import { useWatch, useNewCompute } from '@watch-state/react'

const $name = new State('Mike')

const Parent = ({ surname }) => {
  const fullName = useNewCompute(() => `${$name.value} ${surname[0]}.`, [surname])

  return <Child fullName={fullName} />
}

const Child = ({ fullName }) => {
  const value = useWatch(fullName)

  return <div>{value}</div>
}
```

## Utils
###### [🏠︎](#index) / Utils [↑](#hooks) [↓](#examples)

<sup>[subscribe](#subscribe)</sup>

### subscribe
###### [🏠︎](#index) / [Utils](#utils) / subscribe

**Stable subscription factory for `useSyncExternalStore` with watch-state.**

Used internally by `useWatch`. Creates a `Watch` instance that calls the provided callback on state changes.

```ts
import { subscribe } from '@watch-state/react'
import { State } from 'watch-state'

const $state = new State(0)

// Same as useWatch($state)
const value = useSyncExternalStore(subscribe, () => $state.value)
```

## Examples
###### [🏠︎](#index) / Examples [↑](#utils) [↓](#links)

<sup>[Counter](#counter) • [Toggle](#toggle) • [Async](#async)</sup>

### Counter
###### [🏠︎](#index) / [Examples](#examples) / Counter [↓](#toggle)

```tsx
import { State } from 'watch-state'
import { useWatch } from '@watch-state/react'

const $count = new State(0)

const increase = () => {
  $count.value++
}

export function CountButton () {
  const count = useWatch($count)

  return <button onClick={increase}>{count}</button>
}
```

### Toggle
###### [🏠︎](#index) / [Examples](#examples) / Toggle [↑](#counter) [↓](#async)

```tsx
import { State } from 'watch-state'
import { useWatch } from '@watch-state/react'

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
```

### Async
###### [🏠︎](#index) / [Examples](#examples) / Async [↑](#toggle)

```tsx
import { useWatch } from '@watch-state/react'
import Async from '@watch-state/async'

const api = new Async(
  () => fetch('/api/test')
    .then(r => r.json())
)

const User = () => {
  const value = useWatch(api)
  const loading = useWatch(() => api.loading)
  const loaded = useWatch(() => api.loaded)
  const error = useWatch(() => api.error)

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
