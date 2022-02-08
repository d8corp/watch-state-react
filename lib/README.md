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

State manager of React 16.8+ based on [watch-state](https://www.npmjs.com/package/watch-state)

[![stars](https://img.shields.io/github/stars/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/watchers)
### Install
npm
```bash
npm i @watch-state/react
```
yarn
```bash
yarn add @watch-state/react
```
### Usage
#### Class Component
You can use class components.
```typescript jsx
import React, { Component } from 'react'
import watch, { state } from '@watch-state/react'

@watch
class UserName extends Component {
  @state name = 'Mike'

  render () {
    return (
      <input
        value={this.name}
        onChange={e => this.name = e.target.value}
      />
    )
  }
}
```

#### Function Component
You can use function components.
```typescript jsx
import React from 'react'
import { useWatch } from '@watch-state/react'

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
```

#### Cache
Use `cache` when you want to cache computed values.
```typescript jsx
import React, {Component} from 'react'
import watch, {getState, state, cache} from '@watch-state/react'

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
```

#### Mixer
Use mixer on computed values related to props
```typescript jsx
import React, {Component} from 'react'
import watch, {State, mixer} from '@watch-state/react'

interface UserProps {
  id?: number
}

const prefix = new State('Id: ')

@watch
class User extends Component<UserProps> {
  @mixer get info () {
    return prefix.value + this.props.id
  }
  render () {
    return this.info
  }
}
```

#### Event
Use `event` if you want to change several states in one action.
```typescript jsx
import React, {Component} from 'react'
import watch, {state, event} from '@watch-state/react'

@watch
class Test extends Component {
  @state field1 = 'value1'
  @state field2 = 'value2'

  @event setFields () {
    this.field1 = 'new value1'
    this.field2 = 'new value2'
  }

  render () {
    return (
      <button onclick={() => this.setFields()}>
        field1: {this.field1}, field2: {this.field2}
      </button>
    )
  }
}
```

### Links
- [React](https://reactjs.org)
- [watch-state](https://www.npmjs.com/package/watch-state)

## Issues
If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/watch-state-react/issues)

[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state-react)](https://github.com/d8corp/watch-state-react/issues)
