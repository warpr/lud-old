/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

import { keys } from '/lud/misc.js';
import { SearchInput } from '/lud/search-input.js';

const React = window.React;
const e = React.createElement;
const M = window['material-ui'];

export function MainMenu() {
    return e(
        'div',
        { style: { flexGrow: true } },
        e(
            M.AppBar,
            { position: 'static' },
            e(
                M.Toolbar,
                {},
                keys([
                    e(
                        M.IconButton,
                        {
                            color: 'inherit',
                            style: { marginLeft: -12, marginRight: 20 },
                        },
                        e(M.Icon, {}, 'menu')
                    ),
                    e(
                        M.Typography,
                        {
                            variant: 'title',
                            color: 'inherit',
                            style: { flex: 1 },
                        },
                        'Lûd'
                    ),
                    e(SearchInput, { style: { flex: 2 } }),
                ])
            )
        )
    );
}
