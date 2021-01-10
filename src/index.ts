import {Watch, Cache, getDecors, unwatch} from 'watch-state'
import {Mixer} from '@watch-state/mixer'
import {useEffect, useState} from 'react'

export const WATCHER = Symbol('watcher')
export const UPDATING = Symbol('watcher')

function watch <T> (target: T): T
function watch (target) {
  const originalRender = target.prototype?.render
  if (originalRender) {
    const originalComponentWillUnmount = target.prototype?.componentWillUnmount
    target.prototype.componentWillUnmount = function componentWillUnmount () {
      this[WATCHER].destructor()
      this[WATCHER] = undefined
      const values = getDecors(this)
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
        unwatch(() => {
          let watcher
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

export default watch
export * from 'watch-state'
export * from '@watch-state/mixer'
