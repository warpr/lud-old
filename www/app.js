/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

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

export function nav_bar() {
    return e('nav', {className: "pt-navbar pt-dark"}, [
        e('div', {className: "pt-navbar-group pt-align-left"},
          e('div', {className: "pt-navbar-heading"}, "Blueprint"),
          e(Search)
         ),
        e('div', {className: "pt-navbar-group pt-align-right"}, [
            e('button', {className: "pt-button pt-minimal pt-icon-home"}, 'Home'),
            e('button', {className: "pt-button pt-minimal pt-icon-document"}, 'Files'),
            e('span', {className: "pt-navbar-divider"}),
            e('button', {className: "pt-button pt-minimal pt-icon-user"}),
            e('button', {className: "pt-button pt-minimal pt-icon-notifications"}),
            e('button', {className: "pt-button pt-minimal pt-icon-cog"}),
        ]),
    ]);
}

export function start(app_div) {
    const style = {
        padding: 0,
        margin: 0,
        border: 0
    };

    const app = e('div', {style: style}, [
        nav_bar(),
        e(Blueprint.Core.Button, {
             iconName: "document",
             text: "Device memory: " + navigator.deviceMemory,
        })
    ]);

    ReactDOM.render(app, app_div);
}


