/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

import { AudioMetadata, CurrentSong } from '/lud/audio-metadata.js';
import { ControlChannel } from '/lud/control-channel.js';

const Immutable = window.Immutable;

// Global currently playing song
window.lûd = {
    audioMetadata: null,
    verbose: true,
};

function getAudioElement() /*: HTMLAudioElement */ {
    const el = document.getElementById('html5-audio');
    if (!el || !el instanceof HTMLAudioElement) {
        throw '#html5-audio is not an HTMLAudioElement!';
    }

    const audioElement /*: HTMLAudioElement */ = (el /*: any */);

    return audioElement;
}

export function formatTime(seconds /*: number */) {
    const parts = [Math.floor((seconds / 60) % 60), Math.floor(seconds % 60)];

    const hours = Math.floor(seconds / 60 / 60);
    if (hours) {
        parts.unshift(hours);
    }

    return parts.join(':').replace(/:(\d)\b/g, ':0$1');
}

function formatStatus(status) {
    const currentPos = status.get('pos');
    const duration = status.get('duration');
    const progressWidth = 50;
    const pos = Math.floor((currentPos / duration) * progressWidth);
    const progress =
        formatTime(currentPos) +
        ' [' +
        '='.repeat(pos) +
        ' '.repeat(progressWidth - pos) +
        '] ' +
        formatTime(duration);

    return [
        'artist: ' + status.get('artist'),
        'track: ' + status.get('track'),
        'album: ' + status.get('album'),
        'track length: ' + formatTime(status.get('trackLength')),
        progress,
    ].join('\n');
}

let __prevStatus = null;
async function printStatusStep() {
    if (!window.lûd.audioMetadata) {
        return;
    }

    await window.lûd.audioMetadata.ready;

    const newStatus = Immutable.fromJS({
        artist: window.lûd.audioMetadata.currentSong.getTrackArtistName(),
        track: window.lûd.audioMetadata.currentSong.trackTitle,
        album: window.lûd.audioMetadata.currentSong.getFullDiscTitle(),
        pos: window.lûd.audioMetadata.position,
        trackLength: window.lûd.audioMetadata.currentSong.trackLength,
        duration: window.lûd.audioMetadata.duration,
    });

    if (!Immutable.is(newStatus, __prevStatus)) {
        __prevStatus = newStatus;

        const el = document.getElementById('now-playing');
        if (el) {
            el.innerHTML = formatStatus(newStatus);
        }
    }
}

export async function initPlayback() {
    const audioElement = getAudioElement();

    window.lûd.controlChannel = new ControlChannel(audioElement);

    const np = await window.lûd.controlChannel.updateFromServer();

    printStatusStep();

    audioElement.addEventListener('timeupdate', () => {
        printStatusStep();
    });

    loadCurrentSong(np.pos / 1000);
}

async function loadCurrentSong(position /*: number */) {
    const audioElement = getAudioElement();

    if (!window.lûd.audioMetadata) {
        return;
    }

    await window.lûd.audioMetadata.ready;

    audioElement.src = window.lûd.audioMetadata.getAudioFile();
    audioElement.load();

    return new Promise((resolve, reject) => {
        const canPlayThrough = () => {
            audioElement.removeEventListener('canplaythrough', canPlayThrough);
            audioElement.currentTime = position;
            window.lûd.audioMetadata.setPosition(position);

            resolve(audioElement);
        };

        audioElement.addEventListener('canplaythrough', canPlayThrough);
    });
}

export async function resumePlayback() {
    const audioElement = getAudioElement();

    const resumeButton = document.getElementById('html5-audio-resume');
    if (!resumeButton || !(resumeButton instanceof HTMLButtonElement)) {
        return;
    }

    const np = await window.lûd.controlChannel.updateFromServer();

    console.log('resumePlayback called, paused [', audioElement.paused, '] ', audioElement);

    if (audioElement.paused) {
        const offset = new Date().getTime() - np.updated_at;
        console.log('offset is', offset, 'pos', np.pos, ' with offset ', np.pos + offset);

        audioElement.currentTime = (np.pos + offset) / 1000;
        audioElement
            .play()
            .then(() => {
                console.log('playback started');
                resumeButton.disabled = true;
            })
            .catch(error => {
                console.log('playback error?', error.code, error.message);
                resumeButton.disabled = false;
            });
    } else {
        console.log('already playing...');
    }
}
