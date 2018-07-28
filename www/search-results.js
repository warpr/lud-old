/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

import { Artist, Release, Track } from '/lud/db.js';
import { keys } from '/lud/misc.js';

const React = window.React;
const e = React.createElement;
const M = window['material-ui'];

function artistCredit(credit) {
    return credit.reduce((memo, val) => {
        return memo + val.get('artist') + val.get('joinphrase');
    }, '');
}

function searchResultClicked(mbid) {
    const item = window.lûd.db.lookup(mbid);
    console.log('search result item', item);

    let disc = null;
    let track = 1;
    if (item.has('discs')) {
        disc = item.discs.get(0);
    } else if (item.has('release')) {
        const release = window.lûd.db.lookup(item.release);
        disc = release.discs.get(item.discNo - 1);
        track = item.pos;
    } else {
        console.log('no playable item found for', mbid);
        return;
    }

    window.lûd.glue.loadMedia(disc.filename);
    window.lûd.glue.play(track);
}

function searchResultCard(mbid, type, title, body) {
    return e(
        M.ListItem,
        { button: true, key: mbid, onClick: e => searchResultClicked(mbid) },
        keys([
            e(M.ListItemAvatar, {}, e(M.Avatar, {}, e(M.Icon, {}, 'folder'))),
            e(M.ListItemText, { primary: title, secondary: body }),
            e(M.ListItemSecondaryAction, {}, e(M.IconButton, {}, e(M.Icon, {}, 'delete'))),
        ])
    );
}

const cards = {
    artist: record => searchResultCard(record.id, record.type, record.names.first(), ''),
    release: record =>
        searchResultCard(record.id, record.type, record.title, 'by ' + artistCredit(record.credit)),
    track: record =>
        searchResultCard(record.id, record.type, record.title, [
            'from ',
            record.release.get('title'),
            ' by ',
            artistCredit(record.credit),
        ]),
};

/*::
type SearchResult = Artist|Release|Track;

type SearchResultsState = {
    expanded: boolean,
    results: Array<SearchResult>,
};
*/
export class SearchResults extends React.Component {
    constructor(props /*: {} */) {
        super(props);

        this.state = { results: [], expanded: false };
        this.handleChange = this.handleChange.bind(this);
    }

    componentWillMount() {
        // FIXME: don't hardcode "window.lûd" here.
        window.lûd.searchResults = results => this.setState({ expanded: true, results: results });
    }

    componentWillUnmount() {
        window.lûd.searchResults = () => {};
    }

    /*:: handleChange: () => void */
    handleChange(event /*: SyntheticEvent<HTMLElement>*/) {
        console.log('handleChange', event, 'old expanded', this.state.expanded);
        this.setState({ expanded: !this.state.expanded });
    }

    render() {
        return e(
            M.ExpansionPanel,
            {
                expanded: this.state.expanded,
                onChange: this.handleChange,
            },
            keys([
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
                        e(M.List, { dense: false }, this.state.results.map(r => cards[r.type](r)))
                    )
                ),
            ])
        );
    }
}
