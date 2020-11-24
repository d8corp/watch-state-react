import {Watch, Cache, Mixer, stateValues} from 'watch-state'
import {useEffect, useState} from 'react'

const WATCHER = Symbol('watcher')

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
      this[WATCHER] = new Watch(update => {
        if (update) {
          this.forceUpdate()
        } else {
          result = originalRender.apply(this, args)
        }
      })
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
