/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

import { MainMenu } from '/lud/main-menu.js';
import { NowPlaying } from '/lud/now-playing.js';
import { SearchResults } from '/lud/search-results.js';

const e = React.createElement;

export function start(app_div) {
    const style = {
        padding: 0,
        margin: 0,
        border: 0
    };

    Blueprint.Core.FocusStyleManager.onlyShowFocusOnTabs();

    const app = e('div', {style: style}, [
        e(MainMenu, { key: "main-menu" }),
        e(NowPlaying, { key: "now-playing" }),
        e(SearchResults, { key: "search-results" }),
    ]);

    ReactDOM.render(app, app_div);

    setTimeout(() => {
        const fsol1 = "http://127.0.0.1/lud/music/artists/future-sound-of-london/1994.lifeforms/disc1.m4a";

//        PubSub.publish('play-file', fsol1);
    }, 10000);

}

