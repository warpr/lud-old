/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

/*::
import { type SearchResultItem } from '/lud/search-rest.js';
*/
import { searchRest } from '/lud/search-rest.js';

const React = window.React;
const e = React.createElement;
const M = window['material-ui'];

export class Search {
    /*:: query: (string) => void */

    constructor() {
        this.query = () => {};
    }

    connectResults(callback /*: Function */) {
        this.query = callback;
    }

    disconnectResults() {
        this.query = () => {};
    }
}

function searchResultClicked(cueFile, type, trackNo) {
    if (type === 'release') {
        window.lûd.glue.loadMedia(cueFile, 0).then(() => {
            window.lûd.glue.play(0);
        });
    } else {
        window.lûd.glue.loadMedia(cueFile, trackNo).then(() => {
            window.lûd.glue.play(trackNo);
        });
    }
}

function searchResultCard(result) {
    const { artist, cueFile, mbid, pos, title, type } = result;
    const body = 'by ' + artist;

    return e(
        M.ListItem,
        { button: true, key: mbid, onClick: e => searchResultClicked(cueFile, type, pos) },
        e(M.ListItemAvatar, {}, e(M.Avatar, {}, e(M.Icon, {}, 'folder'))),
        e(M.ListItemText, { primary: title, secondary: body }),
        e(M.ListItemSecondaryAction, {}, e(M.IconButton, {}, e(M.Icon, {}, 'delete')))
    );
}

/*::
type SearchResultsState = {
    expanded: boolean,
    isLoading: boolean,
    nextPage: string | null,
    prevPage: string | null,
    query: string,
    results: Array<SearchResultItem>,
};
*/
export class SearchResults extends React.Component /* <{}, SearchResultsState> */ {
    constructor(props /*: {} */) {
        super(props);

        this.state = {
            expanded: false,
            isLoading: false,
            nextPage: null,
            prevPage: null,
            query: '',
            total: 0,
            results: [],
        };
        this._abortController = new AbortController();
        this.handleChange = this.handleChange.bind(this);
        this.newSearch = this.newSearch.bind(this);
    }

    componentWillMount() {
        window.lûd.search.connectResults(this.newSearch);
    }

    componentWillUnmount() {
        window.lûd.search.disconnectResults();
    }

    /*:: handleChange: Function */
    handleChange(event /*: SyntheticEvent<HTMLElement>*/) /*: void */ {
        this.setState({ expanded: !this.state.expanded });
    }

    /*:: newSearch: Function */
    newSearch(term /*: string */) /*: void */ {
        console.log('newSearch', term);
        this.setState({
            isLoading: true,
            nextPage: null,
            prevPage: null,
            query: term,
            total: 0,
        });

        this._abortController.abort();
        this._abortController = new window.AbortController();

        searchRest(term, this._abortController.signal).then(response => {
            this.setState({
                nextPage: response.metadata.next ? response.metadata.next : null,
                prevPage: response.metadata.prev ? response.metadata.prev : null,
                results: response.results,
                total: response.metadata.total,
            });
        });
    }

    render() {
        return e(
            M.ExpansionPanel,
            {
                expanded: this.state.expanded,
                onChange: this.handleChange,
            },
            e(
                M.ExpansionPanelSummary,
                { expandIcon: e(M.Icon, {}, 'expand_more') },
                e(M.Typography, {}, 'Search results')
            ),
            e(
                M.ExpansionPanelDetails,
                {},
                e(
                    M.Grid,
                    { item: true, xs: 12, md: 6 },
                    e(M.List, { dense: false }, this.state.results.map(r => searchResultCard(r)))
                )
            )
        );
    }
}
