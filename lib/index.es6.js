import { Cache, Watch, scope, State } from 'watch-state';
export * from 'watch-state';
import { getDecors } from '@watch-state/decorators';
export * from '@watch-state/decorators';
import { useMemo, useState, useEffect } from 'react';

const WATCHER = Symbol('watcher');
const UPDATING = Symbol('watcher');
function watch(target) {
    var _a;
    const originalRender = (_a = target.prototype) === null || _a === void 0 ? void 0 : _a.render;
    if (originalRender) {
        const originalComponentWillUnmount = target.prototype.componentWillUnmount;
        target.prototype.componentWillUnmount = function componentWillUnmount() {
            this[WATCHER].destroy();
            this[WATCHER] = undefined;
            const values = getDecors(this);
            if (values) {
                for (const key in values) {
                    const value = values[key];
                    if (value instanceof Cache) {
                        value.destroy();
                    }
                }
            }
            originalComponentWillUnmount === null || originalComponentWillUnmount === void 0 ? void 0 : originalComponentWillUnmount.apply(this, arguments);
        };
        target.prototype.render = function render() {
            var _a;
            let result, args = arguments;
            if (this[UPDATING]) {
                result = originalRender.apply(this, args);
            }
            else {
                (_a = this[WATCHER]) === null || _a === void 0 ? void 0 : _a.destroy();
                let watcher;
                watcher = this[WATCHER] = new Watch(update => {
                    if (!update) {
                        result = originalRender.apply(this, args);
                    }
                    else if (watcher === this[WATCHER]) {
                        this[UPDATING] = true;
                        this.forceUpdate();
                        this[UPDATING] = false;
                    }
                }, true);
            }
            return result;
        };
    }
    return target;
}
function getState(target, key) {
    return getDecors(target)[key];
}
function getCache(target, key) {
    return getDecors(target)[key];
}
const NULL = Symbol('Super Null');
function mixer(target, key, desc) {
    const VALUE = Symbol('Mixer cache');
    target[VALUE] = NULL;
    const originGet = desc.get;
    desc.get = function () {
        var _a;
        (_a = scope.activeWatcher) === null || _a === void 0 ? void 0 : _a.onDestroy(() => this[VALUE] = NULL);
        return this[VALUE] === NULL
            ? this[VALUE] = originGet.call(this)
            : this[VALUE];
    };
    return desc;
}
function useWatch(target) {
    let result;
    const watcher = useMemo(() => new Watch(update => {
        if (target instanceof State || target instanceof Cache) {
            result = target.value;
        }
        else {
            result = target(update);
        }
        if (update) {
            setValue(result);
        }
    }), [target]);
    const [value, setValue] = useState(result);
    useEffect(() => () => {
        watcher.destroy();
    }, [watcher]);
    return value;
}

export default watch;
export { UPDATING, WATCHER, getCache, getState, mixer, useWatch };
