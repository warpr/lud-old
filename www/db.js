/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

import * as misc from '/lud/misc.js';

// FIXME: use immutable for artist names and artist credits.

const Artist = Immutable.Record(
    {
        id: null,
        names: [], // list of artist names, first is primary, rest are search hints
        type: 'artist',
    },
    'Artist'
);

const Release = Immutable.Record(
    {
        id: null,
        title: null,
        date: null,
        credit: [],
        type: 'release',
    },
    'Release'
);

const Track = Immutable.Record(
    {
        id: null,
        title: null,
        length: null,
        release: null, // mbid
        credit: [],
        type: 'track',
    },
    'Track'
);

function combineCollections(collections) {
    // this attempts to not use too much extra memory by setting all values
    // to null after being copied over.  FIXME: this is probably premature
    // optimization and may not help at all... benchmark this.

    const everything = {};

    collections.forEach(c => {
        Object.keys(c).forEach(key => {
            switch (c[key]['type']) {
                case 'artist':
                    everything[key] = Artist(Immutable.fromJS(c[key]));
                    break;
                case 'release':
                    everything[key] = Release(Immutable.fromJS(c[key]));
                    break;
                case 'track':
                    everything[key] = Track(Immutable.fromJS(c[key]));
                    break;
                default:
                    console.log(
                        'Unknown record type "',
                        c[key]['type'],
                        '", skipping record ',
                        key
                    );
            }

            c[key] = null;
        });
    });

    return everything;
}

function indexAll(dbs) {
    const everything = combineCollections(dbs);

    // FIXME: index server-side
    const idx = lunr(function() {
        this.ref('id');
        this.field('artist');
        this.field('title');
        this.field('disc');
        this.field('song');
        this.metadataWhitelist = ['position'];

        Object.keys(everything).forEach(id => {
            const item = everything[id].toJS();

            item.id = id;
            // release or track artist credit
            if (item.credit) {
                item.artist = item.credit.reduce((memo, val) => {
                    return val.artist + val.joinphrase;
                }, '');
                // artist names
            } else if (item.names) {
                item.artist = item.names;
            }
            this.add(item);
        });
    });

    return { database: everything, index: idx };
}

function initSearch(result) {
    const idx = result.index;
    const db = result.database;

    misc.updateTitle('');

    console.log('search initialized');
    window.searchKuno = result;

    PubSub.subscribe('id-lookup', (topic, data) => {});

    PubSub.subscribe('search-query', (topic, searchTerm) => {
        const search = searchTerm.toLowerCase();

        const results = idx.query(function(q) {
            // exact matches should have the highest boost
            q.term(search, { boost: 100 });

            // prefix matches should be boosted slightly
            q.term(search, {
                boost: 10,
                usePipeline: false,
                wildcard: lunr.Query.wildcard.TRAILING,
            });

            // finally, try a fuzzy search, without any boost
            q.term(search, { boost: 1, usePipeline: false, editDistance: 1 });
        });

        const matches = results.map(r => {
            // copy item id from the db key
            const item = db[r.ref].set('id', r.ref);
            if (item.get('release')) {
                return item.set('release', db[item.get('release')]);
            } else {
                return item;
            }
        });
        PubSub.publish('search-results', matches);
    });
}

export function loadIndex() {
    let idx = null;

    // FIXME: if deviceMemory < something, skip tracks?
    console.log('device memory:', navigator.deviceMemory);

    const indexes = [
        '/lud/cache/releases.json',
        '/lud/cache/artists.json',
        '/lud/cache/tracks.json',
    ];

    return Promise.all(indexes.map(i => fetch(i)))
        .then(values => Promise.all(values.map(r => r.json())))
        .then(indexAll)
        .then(initSearch);
}
