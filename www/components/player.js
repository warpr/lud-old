/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

const React = window.React;
const e = React.createElement;
const M = window['material-ui'];

// FIXME: mock audio-metadata?

export function Player(props /*: Object */) {
    return e('h1', {}, 'Player goes here');
}
