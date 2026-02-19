import type { DependencyList } from 'react';
import type { Cache, Watcher } from 'watch-state';
/** @deprecated Use `useNewCompute` */
export declare function useNewCache<S>(watcher?: Watcher<S>, deps?: DependencyList): Cache<S>;
