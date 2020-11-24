import { stateValues, Cache, Mixer, Watch } from 'watch-state';
export * from 'watch-state';
import { useState, useEffect } from 'react';

const WATCHER = Symbol('watcher');
function watch(target) {
    var _a, _b;
    const originalRender = (_a = target.prototype) === null || _a === void 0 ? void 0 : _a.render;
    if (originalRender) {
        const originalComponentWillUnmount = (_b = target.prototype) === null || _b === void 0 ? void 0 : _b.componentWillUnmount;
        target.prototype.componentWillUnmount = function componentWillUnmount() {
            this[WATCHER].destructor();
            this[WATCHER] = undefined;
            const values = stateValues(this);
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
            let result, args = arguments;
            this[WATCHER] = new Watch(update => {
                if (update) {
                    this.forceUpdate();
                }
                else {
                    result = originalRender.apply(this, args);
                }
            });
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
