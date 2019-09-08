/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

const React = window.React;
const _ = window._;

export function absoluteUri(href /* : string */) /* : string */ {
    const link = document.createElement('a');
    link.href = href;
    return link.href;
}

export function updateTitle(str /* : string */) {
    if (str === '') {
        window.document.title = 'Lûd';
    } else {
        window.document.title = str + ' | Lûd';
    }
}

export function throttleOnAnimationFrame(callback /* : Function */) {
    let requestId = null;

    return function() {
        const context = this;
        const args = arguments;

        if (requestId) {
            cancelAnimationFrame(requestId);
        }

        requestId = requestAnimationFrame(() => {
            callback.apply(context, args);
            requestId = null;
        });
    };
}

export const controls = {
    REWIND: '\u23e9',
    FFWD: '\u23ea',
    NEXT: '\u23ed',
    PREV: '\u23ee',
    PAUSE: '\u23f8',
    STOP: '\u23f9',
    PLAY: '\u25b6\ufe0f',
    EJECT: '\u23cf\ufe0f',
};
