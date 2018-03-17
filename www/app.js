/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

import * as misc from '/lud/misc.js';

const e = React.createElement;

class Search extends React.Component {
    constructor (props) {
        super(props);

        this.state = { query: '' };
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        const value = event.target.value;

        this.setState({query: value});

        PubSub.publish('search-query', value);
    }

    render() {
        const attr = {
            className: 'pt-input',
            onChange: this.handleChange,
            placeholder: "Search...",
            type: 'text',
            value: this.state.query,
        };

        return e('input', attr);
    }
}

class SearchResults extends React.Component {
    render() {
        const cardOptions = {
            elevation: Blueprint.Core.Card.ELEVATION_ONE,
            interactive: true,
            onClick: e => console.log('card clicked', e),
        };

        return e(Blueprint.Core.Card, cardOptions, [
            e('h5', 'Card Heading'),
            e('p', 'Lorem Ipsum'),
        ]);
    }
}

class MainMenu extends React.Component {
    render() {
        return e(Blueprint.Core.Navbar, {className: "pt-dark"}, [
            e(Blueprint.Core.NavbarGroup, {align: "left"}, [
                e(Blueprint.Core.NavbarHeading, {}, "Lûd"),
                e(Search)
            ]),
            e(Blueprint.Core.NavbarGroup, {align: "right"}, [
                e(Blueprint.Core.Button, { className: "pt-minimal", iconName: "home" }, "Home"),
                e(Blueprint.Core.Button, { className: "pt-minimal", iconName: "document" }, "Files"),
                e(Blueprint.Core.NavbarDivider),
                e(Blueprint.Core.Button, { className: "pt-minimal", iconName: "user" }),
                e(Blueprint.Core.Button, { className: "pt-minimal", iconName: "notifications" }),
                e(Blueprint.Core.Button, { className: "pt-minimal", iconName: "cog" }),
            ])
        ]);
    }
}

export function start(app_div) {
    const style = {
        padding: 0,
        margin: 0,
        border: 0
    };

    Blueprint.Core.FocusStyleManager.onlyShowFocusOnTabs();

    const app = e('div', {style: style}, [
        e(MainMenu),
        e(SearchResults),
        e(Blueprint.Core.Button, {
             iconName: "document",
             text: "Device memory: " + navigator.deviceMemory,
        })
    ]);

    ReactDOM.render(app, app_div);
}


