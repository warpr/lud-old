/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

import { CastButton } from '/lud/chromecast.js';
import { SearchInput } from '/lud/search-input.js';

const React = window.React;
const styled = window.styled.default;
const e = React.createElement;
const M = window['material-ui'];

const StyledContainer = styled.div`
    flex-grow: true;
`;

const StyledMenuButton = styled(M.IconButton)`
    margin-left: -12px;
    margin-right: 20px;
`;

const StyledTitle = styled(M.Typography)`
    flex: 1;
`;

export class MainMenu extends React.PureComponent {
    constructor(props /* : {} */) {
        super(props);

        this.handleMenuClick = this.handleMenuClick.bind(this);
    }

    /*:: handleMenuClick: () => void */
    handleMenuClick() {
        // temporary hard refresh for Android debugging
        window.location.reload(true);
    }

    render() {
        return e(
            StyledContainer,
            {},
            e(
                M.AppBar,
                { position: 'static' },
                e(
                    M.Toolbar,
                    {},
                    e(
                        StyledMenuButton,
                        { color: 'inherit', onClick: this.handleMenuClick },
                        e(M.Icon, {}, 'menu')
                    ),
                    e(StyledTitle, { variant: 'title', color: 'inherit' }, 'Lûd'),
                    e(SearchInput, { style: { flex: 2 } }),
                    e(CastButton, {})
                )
            )
        );
    }
}
