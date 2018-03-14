/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

function combineCollections(collections) {
    // this attempts to not use too much extra memory by setting all values
    // to null after being copied over.  FIXME: this is probably premature
    // optimization and may not help at all... benchmark this.

    const everything = {};
    collections.forEach(c => {
        Object.keys(c).forEach(key => {
            everything[key] = c[key];
            c[key] = null;
        })
    });

    return everything;
}

function indexAll(dbs) {
    const everything = combineCollections(dbs);

    // FIXME: index server-side
    const idx = lunr(function () {
        this.ref('id');
        this.field('artist');
        this.field('title');
        this.field('disc');
        this.field('song');
        this.metadataWhitelist = ['position'];

        Object.keys(everything).forEach(id => {
            const item = everything[id];

            item.id = id;
            if (item.credit) {
                item.artist = item.credit.reduce((memo, val) => {
                    return val.artist + val.joinphrase;
                }, "");
            }
            this.add(item);
        });
    });

    return { database: everything, index: idx };
}

function initSearch(result) {
    const idx = result.index;
    const db = result.database;

    const token = PubSub.subscribe('search-query', (searchTerm, topic) => {
        const results = idx.query(function (q) {
            // exact matches should have the highest boost
            q.term(searchTerm, { boost: 100 })

            // prefix matches should be boosted slightly
            q.term(searchTerm, { boost: 10, usePipeline: false, wildcard: lunr.Query.wildcard.TRAILING })

            // finally, try a fuzzy search, without any boost
            q.term(searchTerm, { boost: 1, usePipeline: false, editDistance: 1 })
        });

        const matches = results.map(r => db[r.ref]);
        console.log(results.length, 'matches:', _(matches)
            .map(m => {
                if (m.title) {
                    return m.title;
                } else if (m.artist.length > 0) {
                    return m.artist[0];
                } else {
                    null;
                }
            })
            .compact()
            .take(6)
            .join(', '));
    });
}

export function loadIndex() {
    let idx = null;

    console.log("Device memory: ", navigator.deviceMemory);

    const indexes = ['/lud/cache/releases.json', '/lud/cache/artists.json', '/lud/cache/tracks.json'];

    return Promise.all(indexes.map(i => fetch(i)))
        .then(values => Promise.all(values.map(r => r.json())))
        .then(indexAll)
        .then(initSearch);
}
