/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

import { Album } from '/lud/album.js';
import { AudioGlue } from '/lud/audio-glue.js';
import * as db from '/lud/db.js';
import { Library } from '/lud/library.js';
import { MainMenu } from '/lud/main-menu.js';
import { NowPlaying } from '/lud/now-playing.js';
import { SearchResults } from '/lud/search-results.js';

// FIXME: should probably use a React context for this.  For now this will do.
window.lûd = {
    verbose: true,
    glue: new AudioGlue(),
};

db.bootstrap(window.lûd);
SearchResults.bootstrap(window.lûd);

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

const e = React.createElement;

export function start(app_div) {
    const style = {
        padding: 0,
        margin: 0,
        border: 0,
    };

    Blueprint.Core.FocusStyleManager.onlyShowFocusOnTabs();

    window.lûd.db.loadIndex();

    const app = e('div', { id: 'layout', style: style }, [
        e('div', { key: 'header', className: 'header' }, [
            e(MainMenu, { key: 'main-menu' }),
            e(NowPlaying, { key: 'now-playing' }),
        ]),
        e(Album, { key: 'now-playing-album' }),
        e(
            'div',
            { key: 'playlist', className: 'playlist' },
            e('span', {}, 'playlist')
        ),
        e(
            'div',
            { key: 'search-results', className: 'search-results' },
            e(SearchResults)
        ),
        //        e(Library, { key: 'library' })
    ]);

    ReactDOM.render(app, app_div);
}

function layout(width) {
    const min = 320;
    const max = 512;

    if (width < min) {
        return { columns: 1, columnWidth: min };
    }

    let columns = Math.floor(width / min);

    if (columns > 4) {
        // if we have space for more than 4 columns, we can try to get larger
        // columns instead of just more columns.
        columns = Math.ceil(width / max);
    }

    const columnWidth = Math.floor(width / columns);
    return { columns, columnWidth };
}

window.addEventListener('lûd-raf-resize', event => {
    const l = layout(window.innerWidth);
    console.log(
        'resize event',
        window.innerWidth,
        'columns',
        l.columns,
        'per column',
        l.columnWidth
    );
});

/* layout:

   1280x720
   1366x768
   1440x900
   1600x900
   1920x1080

   header
   now-playing   queue    search-results    library
   footer

   [now playing cover] [now playing tracklisting] [next up] [search results]

1280 (* 3 420)
1366 (* 3 453)
1440 (* 4 360) (* 3 500)
1600 (* 4 400)
1920 (* 4 520)

*/
