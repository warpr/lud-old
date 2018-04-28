/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

import { SearchResults } from '/lud/search-results.js';
import { MainMenu } from '/lud/main-menu.js';
import { PersistState } from '/lud/persist.js';

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
        e(SearchResults, { key: "search-results" }),
    ]);

    ReactDOM.render(app, app_div);
}

