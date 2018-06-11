/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

function broadcastAudioElement(audioElement) {
    const event = {
        src: audioElement.src,
        paused: audioElement.paused,
        currentTime: audioElement.currentTime,
    };
}

function snapshotAudioElement(audioElement) {
    if (!audioElement) {
        return;
    }

    const snapshot = {
        src: audioElement.src,
        currentTime: audioElement.currentTime,
        paused: audioElement.paused,
        volume: audioElement.volume,
    };

    window.localStorage.setItem('lud-now-playing', JSON.stringify(snapshot));
}

function restoreAudioElement(audioElement) {
    if (!audioElement) {
        return false;
    }

    const data = window.localStorage.getItem('lud-now-playing');
    if (!data) {
        return false;
    }

    // console.log('initializing audio element from localStorage');
    const snapshot = JSON.parse(data);
    audioElement.volume = snapshot.volume;
    audioElement.src = snapshot.src;
    audioElement.currentTime = snapshot.currentTime;
    if (!snapshot.paused) {
        audioElement.play();
    }

    return true;
}

export const audioElement = {
    broadcast: broadcastAudioElement,
    restore: restoreAudioElement,
    snapshot: snapshotAudioElement,
};
