/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

const rxjs = window.rxjs;

/*::
export type SearchResultItem = {
    title: string,
    artist: string,
    year: string,
    path: string,
    duration: string,
    type: string,
    mbid: string,
    pos: string | null,
    disc: string | null,
}
*/

function fetchPage(url /*: string */) {
    return rxjs.ajax.ajax(url).pipe(
        rxjs.operators.map(response => ({
            items: response.response.results,
            nextPage: response.response.metadata.next,
            total: response.response.metadata.total,
        }))
    );
}

function getItems(url /*: string */) {
    return rxjs.defer(() => fetchPage(url)).pipe(
        rxjs.operators.mergeMap(({ items, nextPage }) => {
            const items$ = rxjs.from(items);
            const next$ = nextPage ? getItems(nextPage) : rxjs.EMPTY;
            return rxjs.concat(items$, next$);
        })
    );
}

export function searchRest(term /*: string */) {
    // FIXME: urlencode the term?

    getItems('/lud/search.php?q=' + term + '&limit=3')
        .pipe(rxjs.operators.take(8))
        .subscribe(e => console.log(e));
}
