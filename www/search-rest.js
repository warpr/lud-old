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
export type SearchResultItem = {
    title: string,
    artist: string,
    year: string | null,
    path: string,
    cover: string,
    cueFile: string,
    duration: number,
    type: string,
    mbid: string,
    pos: number | null,
    disc: number | null,
}

type ServerResultItem = {
    title: string,
    artist: string,
    year: string | null,
    path: string,
    duration: string,
    type: string,
    mbid: string,
    pos: string | null,
    disc: string | null,
}

type ServerResponse = {
   results: Array<ServerResultItem>,
   metadata: {
       next?: string,
       prev?: string,
       total: number,
   }
}
*/

function normalizeSearchResult(item /*: ServerResultItem */) /*: SearchResultItem */ {
    return {
        title: item.title,
        artist: item.artist,
        year: item.year,
        path: item.path,
        cover: item.path.replace(/\/disc[0-9]+/, '/cover.jpg'),
        cueFile: item.path + '.cue',
        duration: parseInt(item.duration, 10),
        type: item.type,
        mbid: item.mbid,
        pos: item.pos === null ? null : parseInt(item.pos, 10),
        disc: item.disc === null ? null : parseInt(item.disc, 10),
    };
}

export function searchRest(term /*: string */, signal /*: AbortSignal */) {
    return fetch('/lud/search/?q=' + term + '&limit=3', { method: 'GET', signal: signal })
        .then(response => response.json())
        .then((data /*: ServerResponse */) => {
            let normalized /*: Array<SearchResultItem> */ = [];
            if (data.results) {
                normalized = data.results.map(normalizeSearchResult);
            }

            return {
                metadata: data.metadata ? data.metadata : { total: 0 },
                results: normalized,
            };
        })
        .catch(error => {
            console.log('ERROR', error);
            return { results: [], metadata: { total: 0 } };
        });
}

export function listRest(type /*: string */, signal /*: AbortSignal */) {
    return fetch('/lud/search/?type=' + type + '&limit=30', { method: 'GET', signal: signal })
        .then(response => response.json())
        .then((data /*: ServerResponse */) => {
            let normalized /*: Array<SearchResultItem> */ = [];
            if (data.results) {
                normalized = data.results.map(normalizeSearchResult);
            }

            return {
                metadata: data.metadata ? data.metadata : { total: 0 },
                results: normalized,
            };
        })
        .catch(error => {
            console.log('ERROR', error);
            return { results: [], metadata: { total: 0 } };
        });
}
