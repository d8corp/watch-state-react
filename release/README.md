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

State manager of React 18+ based on [watch-state](https://www.npmjs.com/package/watch-state)

[![stars](https://img.shields.io/github/stars/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/stargazers)
[![watchers](https://img.shields.io/github/watchers/d8corp/watch-state-react?style=social)](https://github.com/d8corp/watch-state-react/watchers)

### Install

npm

```bash
npm i @watch-state/react
```

### Usage

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

### Links
- [React](https://reactjs.org)
- [watch-state](https://www.npmjs.com/package/watch-state)

## Issues
If you find a bug or have a suggestion, please file an issue on [GitHub](https://github.com/d8corp/watch-state-react/issues)

[![issues](https://img.shields.io/github/issues-raw/d8corp/watch-state-react)](https://github.com/d8corp/watch-state-react/issues)
