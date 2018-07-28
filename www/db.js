/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

import * as misc from '/lud/misc.js';

const Immutable = window.Immutable;
const lunr = window.lunr;

const Artist = Immutable.Record(
    {
        id: null,
        names: [], // list of artist names, first is primary, rest are search hints
        type: 'artist',
    },
    'Artist'
);

const ArtistCredit = Immutable.Record(
    {
        artist: '',
        id: null,
        joinphrase: '',
    },
    'ArtistCredit'
);

const Disc = Immutable.Record(
    {
        title: null,
        filename: null,
    },
    'Disc'
);

const Release = Immutable.Record(
    {
        id: null,
        title: null,
        date: null,
        discs: [],
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
        discNo: 1,
        release: null, // mbid
        credit: [],
        type: 'track',
    },
    'Track'
);

function reviver(key, value) {
    if (key === 'discs') {
        return value.map(Disc).toList();
    }

    if (key === 'credit') {
        return value.map(ArtistCredit).toList();
    }

    const isIndexed = Immutable.Iterable.isIndexed(value);
    return isIndexed ? value.toList() : value.toOrderedMap();
}

function combineCollections(collections) {
    // this attempts to not use too much extra memory by setting all values
    // to null after being copied over.  FIXME: this is probably premature
    // optimization and may not help at all... benchmark this.

    const everything = {};

    collections.forEach(c => {
        Object.keys(c).forEach(key => {
            switch (c[key]['type']) {
                case 'artist':
                    everything[key] = Artist(Immutable.fromJS(c[key], reviver));
                    break;
                case 'release':
                    everything[key] = Release(Immutable.fromJS(c[key], reviver));
                    break;
                case 'track':
                    everything[key] = Track(Immutable.fromJS(c[key], reviver));
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

function lookup(identifier) {
    const item = this.__database[identifier];
    if (!item) {
        return null;
    }

    return item;
}

function search(searchTerm) {
    const search = searchTerm.toLowerCase();

    return this.__index
        .query(q => {
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
        })
        .map(r => {
            // copy item id from the db key
            const item = this.__database[r.ref].set('id', r.ref);
            if (item.get('release')) {
                return item.set('release', this.__database[item.get('release')]);
            } else {
                return item;
            }
        });
}

function initSearch(result) {
    this.__index = result.index;
    this.__database = result.database;
    this.search = search.bind(this);
    this.lookup = lookup.bind(this);

    misc.updateTitle('');
}

function bootstrapSearch(searchTerm) {
    console.log('search called before being initialized... not supported yet');
}

function bootstrapLookup(identifier) {
    console.log('lookup called before being initialized... not supported yet');
}

export function bootstrap(obj /*: any */) {
    const instance = {};

    instance.search = bootstrapSearch.bind(instance);
    instance.lookup = bootstrapLookup.bind(instance);
    instance.loadIndex = loadIndex.bind(instance);

    obj.db = instance;
}

export function loadIndex() {
    // FIXME: if deviceMemory < something, skip tracks?
    console.log('device memory:', window.navigator.deviceMemory);

    const indexes = [
        '/lud/cache/releases.json',
        '/lud/cache/artists.json',
        '/lud/cache/tracks.json',
    ];

    return Promise.all(indexes.map(i => fetch(i)))
        .then(values => Promise.all(values.map(r => r.json())))
        .then(indexAll)
        .then(result => initSearch.call(this, result));
}
