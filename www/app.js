/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

import { Album } from '/lud/album.js';
import { MainMenu } from '/lud/main-menu.js';
import { NowPlaying } from '/lud/now-playing.js';
import { SearchResults } from '/lud/search-results.js';
import { AudioGlue } from '/lud/audio-glue.js';
// import * as db from '/lud/db.js';

// FIXME: should probably use a React context for this.  For now this will do.
window.lûd = {
    verbose: true,
    glue: new AudioGlue(),
};

const e = React.createElement;

export function start(app_div) {
    const style = {
        padding: 0,
        margin: 0,
        border: 0
    };

    Blueprint.Core.FocusStyleManager.onlyShowFocusOnTabs();

    // db.loadIndex();

    const app = e('div', {style: style}, [
        // e(MainMenu, { key: "main-menu" }),
        e(NowPlaying, { key: "now-playing" }),
        // e(Album, { key: "album" }),
        // e(SearchResults, { key: "search-results" }),
    ]);

    ReactDOM.render(app, app_div);

    const fsol1 = "/lud/music/artists/future-sound-of-london/1994.lifeforms/disc1.m4a";
    const fsol2 = "/lud/music/artists/future-sound-of-london/1994.lifeforms/disc2.m4a";
    const tony3 = "/lud/music/artists/tony-dize/2015.la-melodia-de-la-calle-3rd-season/disc1.m4a";

    // FIXME: remove PubSub, use React context instead
    // https://reactjs.org/docs/context.html#when-to-use-context
    //
    // create context for these things:
    // - db + db index
    // - audio controls (i.e. now playing)
    // - audio device (i.e. audio glue)
    // - search results?

    setTimeout(() => {
        window.lûd.glue.loadMedia(tony3);
        // window.lûd.glue.play();

        // PubSub.publish('play-file', tony3);
    }, 2000);
}

