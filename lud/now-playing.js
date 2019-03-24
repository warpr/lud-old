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
const { Media, Player, controls, withMediaProps } = window.ReactMediaPlayer;

/*::
type Position = {
    idx: number,
    disc: number,
    file: ?string,
    seek: number,
}

type PlaylistItemDisc = {
    cue: string,
    file: string,
    length: number,
}

type PlaylistItem = {
    title: string,
    artist: string,
    folder: string,
    discs: Array<PlaylistItemDisc>,
}

type CurrentFile = {

}

type NowPlayingData = {
    position: Position,
    playlist: Array<PlaylistItem>,
    currentFile: ?CurrentFile,
}

type MediaPlayerProps = {
    src: string,
    startAt: number,
    onEnded: Function,
}

type MediaControlsProps = {
    className: ?string,
    style: ?Object,
    media: Media,
}
*/

async function loadNowPlaying() {
    return fetch('/lud/now-playing/index.json').then(response => response.json());
}

const Resume = withMediaProps(function(props /*: MediaPlayerProps & MediaControlsProps */) {
    const [prevSrc, setPrevSrc] = React.useState(props.src);
    const [shouldSeek, setShouldSeek] = React.useState(true);
    const [initialLoad, setInitialLoad] = React.useState(true);

    const continuePlayback = () => {
        if (shouldSeek) {
            props.media.seekTo(props.startAt);
            setShouldSeek(false);
        }
        setInitialLoad(false);
        setTimeout(() => {
            props.media.play();
        }, 500);
    };

    if (prevSrc != props.src) {
        // don't do state transitions within render
        setTimeout(() => {
            setPrevSrc(props.src);
            setShouldSeek(true);

            // continue playback if playing from a playlist
            if (!initialLoad) {
                console.log('start playback of next or selected playlist item');
                continuePlayback();
            } else {
                const context = new AudioContext();
                if (context.state === 'running') {
                    // auto play allowed
                    console.log('resume playback after page (re)load');
                    continuePlayback();
                }
            }
        }, 500);
    }

    return e(
        'button',
        {
            type: 'button',
            className: props.className,
            style: props.style,
            onClick: continuePlayback,
        },
        'Resume',
    );
});

const Pause = withMediaProps(function(props /*: MediaControlsProps */) {
    return e(
        'button',
        {
            type: 'button',
            className: props.className,
            style: props.style,
            onClick: () => props.media.pause(),
        },
        'Pause',
    );
});

function MediaPlayer(props /*: MediaPlayerProps */) {
    return e(
        Media,
        {},
        e(
            'div',
            { className: 'media' },
            e(
                'div',
                { className: 'media-player' },
                e(Player, {
                    onPlay: () => console.log('playing'),
                    onPause: () => console.log('paused'),
                    onEnded: props.onEnded,
                    src: props.src,
                    autoPlay: false,
                }),
            ),
            e(
                'div',
                { className: 'media-controls' },
                e(Resume, { ...props }),
                e(Pause),
                e(controls.MuteUnmute),
                e(controls.Volume),
                e(controls.Fullscreen),
                e('br'),
                e(controls.CurrentTime),
                e(controls.SeekBar),
                e(controls.Duration),
                e('br'),
            ),
        ),
    );
}

function ffwd(data /*: NowPlayingData */) {
    const { position, playlist } = data;
    if (++position.disc < playlist[position.idx].discs.length) {
        const release = playlist[position.idx];

        position.seek = 0;
        position.file = release.folder + release.discs[position.disc].file;

        console.log('ffwd, next disc, new position', position);
    } else {
        position.idx++;
        position.disc = 0;
        position.seek = 0;

        const release = playlist[position.idx];
        position.file = release ? release.folder + release.discs[position.disc].file : null;

        console.log('ffwd, next playlist item, new position', position);
    }

    return { position, playlist };
}

export function NowPlaying() {
    const [data, setData] = React.useState(null);
    const [request, setRequest] = React.useState(loadNowPlaying());

    if (!data) {
        request.then(setData);
    }

    const dataStr = data ? JSON.stringify(data, null, 4) : 'loading json...';
    const audioFile = data && data.position && data.position.file ? data.position.file : null;
    const startAt = data && data.position && data.position.seek ? data.position.seek : 0;
    console.log('audioFile', audioFile, 'startAt', startAt);

    return e(
        'div',
        { style: { color: 'white' } },
        e(MediaPlayer, { src: audioFile, startAt, onEnded: () => setData(ffwd(data)) }),
        e('pre', {}, dataStr),
    );
}
