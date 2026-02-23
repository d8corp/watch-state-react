'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var react = require('react');
var watchState = require('watch-state');

function useNewState(initial) {
    var ref = react.useRef();
    return ref.current || (ref.current = new watchState.State(initial));
}

exports.useNewState = useNewState;
