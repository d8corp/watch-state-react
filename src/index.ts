import {Watch, Cache, Mixer, stateValues, unwatch} from 'watch-state'
import {useEffect, useState} from 'react'

const WATCHER = Symbol('watcher')
const UPDATING = Symbol('watcher')

export default function watch (target) {
  const originalRender = target.prototype?.render
  if (originalRender) {
    const originalComponentWillUnmount = target.prototype?.componentWillUnmount
    target.prototype.componentWillUnmount = function componentWillUnmount () {
      this[WATCHER].destructor()
      this[WATCHER] = undefined
      const values = stateValues(this)
      if (values) {
        for (const key in values) {
          const value = values[key]
          if (value instanceof Cache || value instanceof Mixer) {
            value.destructor()
          }
        }
      }
      originalComponentWillUnmount?.apply(this, arguments)
    }
    target.prototype.render = function render () {
      let result, args = arguments
      if (this[UPDATING]) {
        result = originalRender.apply(this, args)
      } else {
        this[WATCHER]?.destructor()
        let watcher
        unwatch(() => {
          watcher = this[WATCHER] = new Watch(update => {
            if (!update) {
              result = originalRender.apply(this, args)
            } else if (watcher === this[WATCHER]) {
              this[UPDATING] = true
              this.forceUpdate()
              this[UPDATING] = false
            }
          })
        })
      }
      return result
    }
    return target
  } else {
    return function Component () {
      const setValue = useState({})[1]
      const args = arguments
      let result
      let watcher = new Watch(update => {
        if (update) {
          setValue({})
        } else {
          result = target.apply(this, args)
        }
      })
      useEffect(() => () => {
        watcher.destructor()
        watcher = undefined
      })
      return result
    }
  }
}

export * from 'watch-state'
