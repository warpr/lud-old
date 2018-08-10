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
const M = window['material-ui'];
const e = React.createElement;

// import { Album } from '/lud/album.js';
import { AudioGlue } from '/lud/audio-glue.js';
import * as db from '/lud/db.js';
// import { Library } from '/lud/library.js';
import { MainMenu } from '/lud/main-menu.js';
import { keys } from '/lud/misc.js';
import { NowPlaying } from '/lud/now-playing.js';
import { PlayPauseFab } from '/lud/play-pause-fab.js';
import { SearchResults } from '/lud/search-results.js';

// FIXME: should probably use a React context for this.  For now this will do.
window.lûd = {
    verbose: true,
    glue: new AudioGlue(),
};

db.bootstrap(window.lûd);

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

class Sections extends React.Component {
    render() {
        // FIXME: use vertical stepper for tracklist (for now?)
        // https://material-ui.com/demos/steppers/

        return e(
            'div',
            { style: { width: '100%' } },
            keys([
                e(SearchResults),
                e(
                    M.ExpansionPanel,
                    {},
                    keys([
                        e(
                            M.ExpansionPanelSummary,
                            { expandIcon: e(M.Icon, {}, 'expand_more') },
                            e(M.Typography, {}, 'Expansion Panel 1')
                        ),
                        e(
                            M.ExpansionPanelDetails,
                            {},
                            e(
                                M.Typography,
                                {},
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
                                    ' Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'
                            )
                        ),
                    ])
                ),
                e(
                    M.ExpansionPanel,
                    {},
                    keys([
                        e(
                            M.ExpansionPanelSummary,
                            { expandIcon: e(M.Icon, {}, 'expand_more') },
                            e(M.Typography, {}, 'Expansion Panel 2')
                        ),
                        e(
                            M.ExpansionPanelDetails,
                            {},
                            e(
                                M.Typography,
                                {},
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
                                    ' Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'
                            )
                        ),
                    ])
                ),
                e(
                    M.ExpansionPanel,
                    {},
                    keys([
                        e(
                            M.ExpansionPanelSummary,
                            { expandIcon: e(M.Icon, {}, 'expand_more') },
                            e(M.Typography, {}, 'Expansion Panel 3')
                        ),
                        e(
                            M.ExpansionPanelDetails,
                            {},
                            e(
                                M.Typography,
                                {},
                                'Lorem ipsum dolor sit amet, consectetur adipiscing elit.' +
                                    ' Suspendisse malesuada lacus ex, sit amet blandit leo lobortis eget.'
                            )
                        ),
                    ])
                ),
            ])
        );
    }
}

export function start(app_div /* : HTMLElement */) {
    window.lûd.db.loadIndex();

    const theme = M.createMuiTheme({
        palette: {
            type: 'dark',
            primary: M.colors.red,
        },
    });

    window.kuno = theme;

    const app = e(M.MuiThemeProvider, { theme, key: 'layout' }, [
        e(M.CssBaseline, { key: 'css-baseline' }),
        e(MainMenu, { key: 'main-menu' }),
        e(NowPlaying, { key: 'now-playing' }),
        e(Sections, { key: 'sections' }),
        e(PlayPauseFab, { key: 'play-pause' }),
    ]);

    window.ReactDOM.render(app, app_div);
}
