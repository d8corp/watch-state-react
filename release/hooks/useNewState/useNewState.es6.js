import { useRef } from 'react';
import { State } from 'watch-state';

function useNewState(defaultValue) {
    var ref = useRef();
    return ref.current || (ref.current = new State(defaultValue));
}

export { useNewState };
