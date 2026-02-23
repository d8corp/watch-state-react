import { useRef } from 'react';
import { State } from 'watch-state';

function useNewState(initial) {
    var ref = useRef();
    return ref.current || (ref.current = new State(initial));
}

export { useNewState };
