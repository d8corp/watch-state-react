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

const $show = new State(false)
const toggleShow = () => $show.value = !$show.value

const AsideMenuButton = () => (
  <button
    onClick={toggleShow}
  />
)

const AsideMenu = () => {
  const show = useWatch($show)

  return show ? (
    <div>Aside Menu</div>
  ) : null
}
```

You can use all features [watch-state](https://www.npmjs.com/search?q=%40watch-state) ecosystem.

`Cache` example:

```typescript jsx
import { State, Cache } from 'watch-state'
import { useWatch } from '@watch-state/react'

const name = new State('Mike')
const surname = new State('Deight')
const fullName = new Cache(() => `${name.value} ${surname.value[0]}.`)

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

#### useNewState

`useNewState` helps to create a `State` inside react component.

```typescript jsx
import { Observable } from 'watch-state'
import { useWatch, useNewState } from '@watch-state/react'

interface ChildProps {
  value: Observable<string>
}

const Parent = () => {
  console.log('Parent creates value once');

  const value = useNewState('Default value')

  return (
    <Test value={value} />
  )
}

const Test = ({ value }: ChildProps) => {
  console.log('Test renders once and provides value to Child', value);

  return (
    <Child value={value} />
  )
}

const Child = ({ value }: ChildProps) => {
  console.log('Child renders on value canges', value);

  const $value = useWatch(value)

  return (
    <div>
      {$value}
    </div>
  )
}
```

#### useNewCache

`useNewCache` helps to create a `Cache` inside a component.

```typescript jsx

```

`useNewCache` also helps to combine props and `Observable` inside a component.

```typescript jsx

```

### Links
- [React](https://reactjs.org)
- [watch-state](https://www.npmjs.com/package/watch-state)

## Issues
If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/watch-state-react/issues)

[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state-react)](https://github.com/d8corp/watch-state-react/issues)
