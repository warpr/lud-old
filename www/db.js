/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2016  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

function indexAll(dbs) {
    // FIXME: index server-side
    return lunr(function () {
        this.ref('id');
        this.field('artist');
        this.field('title');
        this.field('disc');
        this.field('song');
        this.metadataWhitelist = ['position'];

        dbs.forEach(db => {
            Object.keys(db).forEach(id => {
                const item = db[id];
                item.id = id;
                if (item.credit) {
                    item.artist = item.credit.reduce((memo, val) => {
                        return val.artist + val.joinphrase;
                    }, "");
                }
                this.add(item);
            });
        });
    });
}

export function loadIndex() {
    let idx = null;

    console.log("Device memory: ", navigator.deviceMemory);

    const indexes = ['/lud/cache/releases.json', '/lud/cache/artists.json', '/lud/cache/tracks.json'];

    return Promise.all(indexes.map(i => fetch(i)))
        .then(values => Promise.all(values.map(r => r.json())))
        .then(indexAll);
}
