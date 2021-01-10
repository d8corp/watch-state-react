# @watch-state/react
[![NPM](https://img.shields.io/npm/v/@watch-state/react.svg)](https://github.com/d8corp/watch-state-react/blob/master/CHANGELOG.md)
[![downloads](https://img.shields.io/npm/dm/@watch-state/react.svg)](https://www.npmjs.com/package/@watch-state/react)
[![license](https://img.shields.io/npm/l/@watch-state/react)](https://github.com/d8corp/watch-state-react/blob/master/LICENSE)
  
State manager of React 16.8+
### Installation
npm
```bash
npm i @watch-state/react
```
yarn
```bash
yarn add @watch-state/react
```
### Using
#### Class Component
You can use class components.
```typescript jsx
import React, {Component} from 'react'
import watch, {state} from '@watch-state/react'

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
import watch, {state} from '@watch-state/react'

class Core {
  @state showAsideMenu = false
}

const core = new Core()

const AsideMenuButton = () => {
  const toggle = () => core.showAsideMenu = !core.showAsideMenu
  return <button onClick={toggle} />
}

const AsideMenu = watch(() => core.showAsideMenu ? (
  <div>Aside Menu</div>
) : null)
```
#### Cache
Use `cache` when you wanna cache computed values.
```typescript jsx
import React, {Component} from 'react'
import watch, {getDecor, state, cache} from '@watch-state/react'

class Core {
  @state items = []
  @cache get sortedItems () {
    return [...this.items].sort()
  }
  addItem (item) {
    this.items.push(item)
    getDecor<'state', this>(this, 'items').update()
  }
}

const core = new Core()

@watch
class Items extends Component {
  render () {
    return core.sortedItems.map(todo => (
      <div>{todo}</div>
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
Use `event` if you wanna change several states in one action.
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
> ---
[![stars](https://img.shields.io/github/stars/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/watchers)

