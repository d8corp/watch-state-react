import { State, Watch, Cache, scope } from 'watch-state'
import { getDecors } from '@watch-state/decorators'
import {useEffect, useState, FunctionComponent, Component, useMemo} from 'react'
import {Watcher} from "watch-state/Watch/Watch";

export const WATCHER = Symbol('watcher')
export const UPDATING = Symbol('watcher')

type Target = FunctionComponent | Component['constructor']

function watch <T extends Target> (target: T): T {
  const originalRender = target.prototype?.render

  if (originalRender) {
    const originalComponentWillUnmount = target.prototype.componentWillUnmount
    target.prototype.componentWillUnmount = function componentWillUnmount () {
      this[WATCHER].destroy()
      this[WATCHER] = undefined
      const values = getDecors(this)
      if (values) {
        for (const key in values) {
          const value = values[key]
          if (value instanceof Cache) {
            value.destroy()
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
        this[WATCHER]?.destroy()
        let watcher
        watcher = this[WATCHER] = new Watch(update => {
          if (!update) {
            result = originalRender.apply(this, args)
          } else if (watcher === this[WATCHER]) {
            this[UPDATING] = true
            this.forceUpdate()
            this[UPDATING] = false
          }
        }, true)
      }
      return result
    }
  }

  return target
}

export function getState <T> (target: T, key: keyof T): State {
  return getDecors(target)[key] as any
}

export function getCache <T> (target: T, key: keyof T): Cache {
  return getDecors(target)[key] as any
}

const NULL = Symbol('Super Null')

export function mixer <T extends Component> (target: T, key: keyof T, desc?: PropertyDescriptor) {
  const VALUE = Symbol('Mixer cache')
  target[VALUE] = NULL

  const originGet = desc.get
  desc.get = function () {
    scope.activeWatcher?.onDestroy(() => this[VALUE] = NULL)
    return this[VALUE] === NULL
      ? this[VALUE] = originGet.call(this)
      : this[VALUE]
  }

  return desc
}

export function useWatch <T> (watcher: Watcher<T>): T
export function useWatch <T> (cache: Cache<T>): T
export function useWatch <T> (state: State<T>): T
export function useWatch <T> (target: State<T> | Cache<T> | Watcher<T>): T {
  let result: T

  const watcher = useMemo(() => new Watch(update => {
    if (target instanceof State || target instanceof Cache) {
      result = target.value
    } else {
      result = target(update)
    }

    if (update) {
      setValue(result)
    }
  }), [target])

  const [value, setValue] = useState(result)

  useEffect(() => () => {
    watcher.destroy()
  }, [watcher])

  return value
}

export default watch
export * from 'watch-state'
export * from '@watch-state/decorators'
