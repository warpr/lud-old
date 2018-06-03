/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

const e = React.createElement;

function artistCredit(credit) {
    return credit.reduce((memo, val) => {
        return memo + val.get('artist') + val.get('joinphrase');
    }, '');
}

function searchResultCard(id, type, title, body) {
    const cardOptions = {
        elevation: Blueprint.Core.Card.ELEVATION_ONE,
        interactive: true,
        onClick: e => PubSub.publish('play-mbid', { mbid: id, type: type }),
        className: 'pt-dark',
    };

    const style = {
        margin: '10px',
    };

    return e(
        'div',
        { key: id, style: style },
        e(Blueprint.Core.Card, cardOptions, [
            e('h5', { key: 'heading' }, title),
            e('p', { key: 'body' }, body),
        ])
    );
}

const cards = {
    artist: record =>
        searchResultCard(record.id, record.type, record.names.first(), ''),
    release: record =>
        searchResultCard(
            record.id,
            record.type,
            record.title,
            'by ' + artistCredit(record.credit)
        ),
    track: record =>
        searchResultCard(record.id, record.type, record.title, [
            'from ' + record.release.get('title'),
            e('br', { key: 'newline' }),
            'by ' + artistCredit(record.credit),
        ]),
};

export class SearchResults extends React.Component {
    constructor(props) {
        super(props);

        this.state = { results: [] };
    }

    componentWillMount() {
        this.subscription = PubSub.subscribe(
            'search-results',
            (topic, results) => {
                this.setState({ results: results });
            }
        );
    }

    componentWillUnmount() {
        if (this.subscription) {
            PubSub.unsubscribe(this.subscription);
        }
    }

    render() {
        const style = {
            margin: 0,
            padding: 0,
            border: 0,
        };

        return e(
            'div',
            { style },
            this.state.results.map(r => {
                return cards[r.type](r);
            })
        );
    }
}
