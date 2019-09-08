/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

const React = window.React;
const M = window['material-ui'];
const e = React.createElement;

import { NowPlaying } from '/lud/now-playing.js';

window.lûd = {
    verbose: true,
};

function throttleEvent(type, name) {
    var running = false;
    var func = function() {
        if (running) {
            return;
        }
        running = true;
        requestAnimationFrame(function() {
            window.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    };
    window.addEventListener(type, func);
}

throttleEvent('resize', 'lûd-raf-resize');

export function start(app_div /* : HTMLElement */) {
    const theme = M.createMuiTheme({
        typography: {
            useNextVariants: true,
        },
        palette: {
            type: 'dark',
            primary: M.colors.red,
        },
    });

    const app = e(M.MuiThemeProvider, { theme }, e(M.CssBaseline), e(NowPlaying));

    window.ReactDOM.render(app, app_div);
}
