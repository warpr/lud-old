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

/*
  root: {
    fontFamily: theme.typography.fontFamily,
    position: 'relative',
    marginRight: theme.spacing.unit * 2,
    marginLeft: theme.spacing.unit,
    borderRadius: 2,
    background: fade(theme.palette.common.white, 0.15),
    '&:hover': {
      background: fade(theme.palette.common.white, 0.25),
    },
    '& $input': {
      transition: theme.transitions.create('width'),
      width: 200,
      '&:focus': {
        width: 250,
      },
    },
  },
  search: {
    width: theme.spacing.unit * 9,
    height: '100%',
    position: 'absolute',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  input: {
    font: 'inherit',
    padding: `${theme.spacing.unit}px ${theme.spacing.unit}px ${theme.spacing.unit}px ${theme
      .spacing.unit * 9}px`,
    border: 0,
    display: 'block',
    verticalAlign: 'middle',
    whiteSpace: 'normal',
    background: 'none',
    margin: 0, // Reset for Safari
    color: 'inherit',
    width: '100%',
    '&:focus': {
      outline: 0,
    },
  },
*/

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

// class ErrorBoundary extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = { hasError: false };
//     }

//     componentDidCatch(error, info) {
//         this.setState({ hasError: true });
//         console.log('Some error happened!', error, info);
//     }

//     render() {
//         if (this.state.hasError) {
//             return e('span', {});
//         }

//         return this.props.children;
//     }
// }

// export class MainMenu extends React.Component {
//     render() {
//         return e(Blueprint.Core.Navbar, { className: 'pt-dark' }, [
//             e(
//                 Blueprint.Core.NavbarGroup,
//                 { key: 'left', align: Blueprint.Core.Alignment.LEFT },
//                 [
//                     e(Blueprint.Core.NavbarHeading, { key: 'name' }, 'Lûd'),
//                     e(SearchInput, { key: 'search' }),
//                 ]
//             ),
//             e(
//                 Blueprint.Core.NavbarGroup,
//                 { key: 'right', align: Blueprint.Core.Alignment.RIGHT },
//                 [
//                     e(ErrorBoundary, { key: 'error-boundary' }, [
//                         // e(Blueprint.Core.Button, { key: "home", className: "pt-minimal", icon: "home" }, "Home"),
//                         // e(Blueprint.Core.Button, { key: "document", className: "pt-minimal", icon: "document" }, "Files"),
//                         // e(Blueprint.Core.NavbarDivider, { key: "divider" }),
//                         // e(Blueprint.Core.Button, { key: "user", className: "pt-minimal", icon: "user" }),
//                         // e(Blueprint.Core.Button, { key: "notifications", className: "pt-minimal", icon: "notifications" }),
//                         // e(Blueprint.Core.Button, { key: "cog", className: "pt-minimal", icon: "cog" }),
//                     ]),
//                 ]
//             ),
//         ]);
//     }
// }
