import { FunctionComponent, Component } from 'react';
export declare const WATCHER: unique symbol;
export declare const UPDATING: unique symbol;
declare type Target = FunctionComponent | Component['constructor'];
declare function watch<T extends Target>(target: T): T;
export default watch;
export * from 'watch-state';
export * from '@watch-state/mixer';
