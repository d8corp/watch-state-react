import { type Observable, type Watcher } from 'watch-state';
export declare function useWatch<S>(state: Observable<S> | Watcher<S>): S;
