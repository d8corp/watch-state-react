import { getDecors, Cache, unwatch, Watch } from 'watch-state';
export * from 'watch-state';
import { Mixer } from '@watch-state/mixer';
export * from '@watch-state/mixer';
import { useState, useEffect } from 'react';

const WATCHER = Symbol('watcher');
const UPDATING = Symbol('watcher');
function watch(target) {
    var _a;
    const originalRender = (_a = target.prototype) === null || _a === void 0 ? void 0 : _a.render;
    if (originalRender) {
        const originalComponentWillUnmount = target.prototype.componentWillUnmount;
        target.prototype.componentWillUnmount = function componentWillUnmount() {
            this[WATCHER].destructor();
            this[WATCHER] = undefined;
            const values = getDecors(this);
            if (values) {
                for (const key in values) {
                    const value = values[key];
                    if (value instanceof Cache || value instanceof Mixer) {
                        value.destructor();
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
                (_a = this[WATCHER]) === null || _a === void 0 ? void 0 : _a.destructor();
                unwatch(() => {
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
                    });
                });
            }
            return result;
        };
        return target;
    }
    else {
        return function Component() {
            const setValue = useState({})[1];
            const args = arguments;
            let result;
            let watcher = new Watch(update => {
                if (update) {
                    setValue({});
                }
                else {
                    result = target.apply(this, args);
                }
            });
            useEffect(() => () => {
                watcher.destructor();
                watcher = undefined;
            });
            return result;
        };
    }
}

export default watch;
export { UPDATING, WATCHER };
