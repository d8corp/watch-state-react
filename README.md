<a href="https://www.npmjs.com/package/watch-state">
  <img src="https://raw.githubusercontent.com/d8corp/watch-state/v3.3.3/img/logo.svg" align="left" width="90" height="90" alt="Watch-State logo by Mikhail Lysikov">
</a>

# &nbsp; @watch-state/react

&nbsp;

[![NPM](https://img.shields.io/npm/v/@watch-state/react.svg)](https://www.npmjs.com/package/@watch-state/react)
[![downloads](https://img.shields.io/npm/dm/@watch-state/react.svg)](https://www.npmtrends.com/@watch-state/react)
[![changelog](https://img.shields.io/badge/Changelog-⋮-brightgreen)](https://changelogs.xyz/@watch-state/react)
[![license](https://img.shields.io/npm/l/@watch-state/react)](https://github.com/d8corp/watch-state-react/blob/master/LICENSE)
[![tests](https://github.com/d8corp/watch-state-react/workflows/tests/badge.svg)](https://d8corp.github.io/watch-state-react/coverage/lcov-report/)

State manager for React 18+ based on [watch-state](https://www.npmjs.com/package/watch-state)

[![stars](https://img.shields.io/github/stars/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/watchers)

### Install

npm

```bash
npm i @watch-state/react
```

### Usage

#### useWatch

You can observe only function components, by `useWatch` hook.

```typescript jsx
import { State } from 'watch-state'
import { useWatch } from '@watch-state/react'

const show = new State(false)
const toggleShow = () => show.value = !show.value

const AsideMenuButton = () => (
  <button
    onClick={toggleShow}
  />
)

const AsideMenu = () => {
  const isShow = useWatch(show)

  return isShow ? (
    <div>Aside Menu</div>
  ) : null
}
```

#### useNewState

`useNewState` helps to create a `State` inside react component.

```typescript jsx
import { Observable } from 'watch-state'
import { useWatch, useNewState } from '@watch-state/react'
import { useEffect } from "react";

interface ChildProps {
  value: Observable<string>
}

const Parent = () => {
  console.log('Parent creates State once');

  const state = useNewState(0)

  useEffect(() => {
    const t = setInterval(() => {
      state.value++
    }, 1000)
    
    return () => {
      clearInterval(t)
    }
  }, [])

  return (
    <Test value={state}/>
  )
}

const Test = ({ value }: ChildProps) => {
  console.log('Test renders once and provides value to Child', value);

  return (
    <Child value={value}/>
  )
}

const Child = ({ value }: ChildProps) => {
  console.log('Child renders on value canges', value);

  const currentValue = useWatch(value)

  return (
    <div>
      {currentValue}
    </div>
  )
}
```

#### useNewCompute

`useNewCompute` helps to create a `Compute` inside a component.

```typescript jsx
import { State } from 'watch-state'
import { useWatch, useNewCompute } from '@watch-state/react'

const name = new State('Mike')
const surname = new State('Deight')

const Parent = () => {
  const fullName = useNewCompute(() => `${name.value} ${surname.value[0]}.`)
  // renders once
  return <Child fullName={fullName} />
}

interface ChildProps {
  fullName: Observable<string>
}

const Child = ({ fullName }: ChildProps) => {
  const value = useWatch(fullName)
  // renders when fullName canges
  return <div>{value}</div>
}
```

`useNewCompute` also helps to combine props and `Observable` inside a component.

```typescript jsx
import { State } from 'watch-state'
import { useWatch, useNewCompute } from '@watch-state/react'

const name = new State('Mike')

interface ParentProps {
  surname: string
}

const Parent = ({ surname }: ParentProps) => {
  const fullName = useNewCompute(() => `${name.value} ${surname[0]}.`, [surname])
  // renders when surname changes
  return <Child fullName={fullName} />
}

interface ChildProps {
  fullName: Observable<string>
}

const Child = ({ fullName }: ChildProps) => {
  const value = useWatch(fullName)
  // renders when fullName canges
  return <div>{value}</div>
}
```

You can use all features [watch-state](https://www.npmjs.com/search?q=%40watch-state) ecosystem.

`Compute` example:

```typescript jsx
import { State, Compute } from 'watch-state'
import { useWatch } from '@watch-state/react'

const name = new State('Mike')
const surname = new State('Deight')
const fullName = new Compute(() => `${name.value} ${surname.value[0]}.`)

const User = () => {
  const value = useWatch(fullName)

  return (
    <>{value}</>
  )
}
```

[@watch-state/history-api](https://www.npmjs.com/package/@watch-state/history-api) example:

```typescript jsx
import { useWatch } from '@watch-state/react'
import { locationPath, historyPush } from '@watch-state/history-api'

const goTest = () => {
  historyPush('/test')
}

const User = () => {
  const path = useWatch(locationPath)

  return (
    <button onClick={goTest}>
      {path}
    </button>
  )
}
```

[@watch-state/async](https://www.npmjs.com/package/@watch-state/async) example:

```typescript jsx
import { useWatch, useWatcher } from '@watch-state/react'
import Async from '@watch-state/async'

const api = new Async(
  () => fetch('/api/test')
    .then(r => r.json())
)

const User = () => {
  const value = useWatch(api)
  const loading = useWatcher(() => api.loading)
  const loaded = useWatcher(() => api.loaded)
  const error = useWatcher(() => api.error)
  
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

### Links
- [React](https://reactjs.org)
- [watch-state](https://www.npmjs.com/package/watch-state)

## Issues
If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/watch-state-react/issues)

[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state-react)](https://github.com/d8corp/watch-state-react/issues)
