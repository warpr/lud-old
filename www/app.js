/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

import { NowPlayingAlbum } from '/lud/album.js';
import { AudioGlue } from '/lud/audio-glue.js';
import * as db from '/lud/db.js';
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

const e = React.createElement;

export function start(app_div) {
    const style = {
        padding: 0,
        margin: 0,
        border: 0,
    };

    Blueprint.Core.FocusStyleManager.onlyShowFocusOnTabs();

    window.lûd.db.loadIndex();

    const app = e('div', { style: style }, [
        e(MainMenu, { key: 'main-menu' }),
        e(NowPlaying, { key: 'now-playing' }),
        e(NowPlayingAlbum, { key: 'album' }),
        e(SearchResults, { key: 'search-results' }),
    ]);

    ReactDOM.render(app, app_div);
}
