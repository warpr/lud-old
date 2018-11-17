/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

const React = window.React;
const e = React.createElement;
const M = window['material-ui'];
const _ = window._;

/*::
type SearchInputProps = {
    style: Object | string,
}
*/

export class SearchInput extends React.Component {
    constructor(props /*: SearchInputProps */) {
        super(props);

        this.state = { query: '' };
        this.handleChange = this.handleChange.bind(this);

        this.search = _.debounce(value => window.lûd.search.query(value), 300, {
            maxWait: 1000,
        });

        setTimeout(() => {
            const v = 'souls';
            this.setState({ query: v });
            this.search(v);
        }, 2000);
    }

    /*:: handleChange: Function */
    handleChange(event /*: SyntheticInputEvent<HTMLInputElement>*/) {
        const value = event.target.value;

        this.setState({ query: value });
        this.search(value);
    }

    render() {
        const attr = {
            style: this.props.style,
            autoFocus: true,
            onChange: this.handleChange,
            placeholder: 'Search...',
            type: 'text',
            value: this.state.query,
        };

        return e(M.TextField, attr);
    }
}
