/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

const e = React.createElement;

function broadcast(audioElement) {
    const event = {
        src: audioElement.src,
        paused: audioElement.paused,
        currentTime: audioElement.currentTime
    };
    PubSub.publish('now-playing', event);
}

function snapshot(audioElement) {
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

function throttleOnAnimationFrame(callback) {
    let requestId = null;

    return function() {
        const context = this;
        const args = arguments;

        cancelAnimationFrame(requestId);

        requestId = requestAnimationFrame(() => {
            callback.apply(context, args);
            requestId = null;
        });
    };
}

const tick = throttleOnAnimationFrame(event => {
    snapshot(event.target);
    broadcast(event.target);
});

function restore(audioElement) {
    if (!audioElement) {
        return false;
    }

    const data = window.localStorage.getItem('lud-now-playing');
    if (!data) {
        return false;
    }

    console.log('initializing audio element from localStorage');
    const snapshot = JSON.parse(data);
    audioElement.volume = snapshot.volume;
    audioElement.src = snapshot.src;
    audioElement.currentTime = snapshot.currentTime;
    if (!snapshot.paused) {
        audioElement.play();
    }

    return true;
}

export class AudioElement extends React.Component {
    constructor(props) {
        super(props);
        this.audioRef = React.createRef();
    }

    shouldComponentUpdate() {
        // we never want to destroy the <audio> element, as it may be playing.
        // instead we'll update it directly via this.audioRef.
        return false;
    }

    componentDidMount() {
        const audioElement = this.audioRef.current;
        restore(audioElement);

        const playbackEvents = ['ended', 'pause', 'playing', 'progress', 'seeked', 'timeupdate', 'volumechange'];
        playbackEvents.map(eventName => {
            audioElement.addEventListener(eventName, tick, { passive: true });
        });

        this.subscription = PubSub.subscribe('play-file', (topic, url) => {
            console.log('playing new file', url);
            this.audioRef.current.src = url;
            this.audioRef.current.play();
        });
    }

    componentWillUnmount() {
        if (this.interval) {
            clearInterval(this.interval);
        }

        if (this.subscription) {
            PubSub.unsubscribe(this.subscription);
        }
    }

    render() {
        const attr = {
            style: { width: "100%" },
            ref: this.audioRef,
            controls: true
        };

        return e('audio', attr);
    }
}

export class NowPlaying extends React.Component {

    render() {
        const style = {
            margin: 0,
            padding: "10px 10px 0 10px",
            border: 0,
        };

        return e('div', { style }, e(AudioElement, {}));
    }
}
