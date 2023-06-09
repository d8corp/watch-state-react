import { type DependencyList } from 'react';
import { Cache, type Observable, State, type Watcher } from 'watch-state';
export declare function useWatch<S>(state: Observable<S>): S;
export declare function useWatcher<S>(state: Watcher<S>): S;
export declare function useNewState<S>(defaultValue?: S): State<S>;
export declare function useNewCache<S>(watcher?: Watcher<S>, deps?: DependencyList): Cache<S>;
