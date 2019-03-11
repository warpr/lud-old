/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

const React = window.React;
const e = React.createElement;

/*::
type Position = {
    idx: number,
    disc: number,
    seek: number,
}

type PlaylistItemDisc = {
    cue: string,
    length: number,
}

type PlaylistItem = {
    title: string,
    artist: string,
    folder: string,
    discs: Array<PlaylistItemDisc>,
}

type NowPlayingData = {
    position: Position,
    playlist: Array<PlaylistItem>,
}
*/

async function loadNowPlaying() {
    return fetch('/lud/now-playing/index.json').then(response => response.json());
}

export function NowPlaying() {
    const [data, setData] = React.useState(null);
    const [request, setRequest] = React.useState(loadNowPlaying());

    if (!data) {
        request.then(setData);
    }

    return e(
        'pre',
        { style: { color: 'white' } },
        data ? JSON.stringify(data, null, 4) : 'loading json...',
    );
}
