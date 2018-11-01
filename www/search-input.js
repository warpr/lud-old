/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

const rxjs = window.rxjs;

const React = window.React;
const e = React.createElement;
const M = window['material-ui'];
const _ = window._;

import { searchRest } from '/lud/search-rest.js';

/*::
type SearchInputProps = {
    style: object | string,
}
*/

export class SearchInput extends React.Component {
    constructor(props /*: SearchInputProps */) {
        super(props);

        this.state = { query: '' };
        this.handleChange = this.handleChange.bind(this);
        this.handleSearchResult = this.handleSearchResult.bind(this);

        this.search = _.debounce(value => this.handleSearchResult(searchRest(value)), 300, {
            maxWait: 1000,
        });

        setTimeout(() => {
            searchRest('souls');
        }, 2000);
    }

    /*:: handleChange: Function */
    handleChange(event /*: SyntheticEvent<HTMLInputElement>*/) {
        const value = event.target.value;

        this.setState({ query: value });
        this.search(value);
    }

    /*:: handleSearchResult: Function */
    handleSearchResult(result /*: rxjs.Observable<SearchResultItem> */) {
        //        window.lûd.searchResults(result);
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
