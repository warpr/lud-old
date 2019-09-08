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
import { type AudioGlue, type AudioOutput } from '/lud/audio-glue.js';
*/
import { AudioControls, firefoxTheme } from '/lud/audio-controls.js';
import { MediaControls } from '/lud/media-controls.js';
import { throttleOnAnimationFrame } from '/lud/misc.js';

const React = window.React;
const e = React.createElement;

class AudioElementOutput /* implements AudioOutput */ {
    /*::
      audioGlue: AudioGlue
      target: HTMLAudioElement
      tick: Function
      playbackEvents: Array<string>
     */

    constructor(audioGlue, audioElement) {
        this.audioGlue = audioGlue;
        this.target = audioElement;

        this.tick = throttleOnAnimationFrame(event => {
            this.audioGlue.tick();
        });

        this.playbackEvents = [
            'ended',
            'pause',
            'playing',
            'progress',
            'seeked',
            'timeupdate',
            'volumechange',
        ];

        this.playbackEvents.map(eventName => {
            this.target.addEventListener(eventName, this.tick, {
                passive: true,
            });
        });
    }

    disconnect() {
        this.playbackEvents.map(eventName => {
            this.target.removeEventListener(eventName, this.tick);
        });
    }

    loadMedia(file, position, currentSong) {
        // console.log('now-playing loadMedia', file, position, currentSong);

        this.target.src = file;
        this.target.currentTime = position ? parseInt(position, 10) : 0;
    }

    isPaused() {
        return this.target.paused;
    }

    isPlaying() {
        return !this.target.paused;
    }

    play() {
        this.target.play();
    }

    pause() {
        this.target.pause();
    }

    getCurrentTime() {
        return this.target.currentTime;
    }

    getCurrentMedia() {
        return this.target.src;
    }

    setCurrentTime(position /*: ?number */) {
        this.target.currentTime = position ? parseInt(position, 10) : 0;
    }

    getDuration() {
        return this.target.duration || 0;
    }

    getVolume() {
        return this.target.volume || 0;
    }

    isMute() {
        return this.target.volume === 0;
    }

    setVolume(volume /*: number */) {
        this.target.volume = volume;
    }
}

export class AudioElement extends React.Component {
    constructor(props /*: {} */) {
        super(props);
        this.audioRef = React.createRef();
        this.glue = window.lûd.glue;
        this.output = null;
    }

    shouldComponentUpdate() {
        // we never want to destroy the <audio> element, as it may be playing.
        // instead we'll update it directly via this.audioRef.
        return false;
    }

    componentDidMount() {
        this.output = new AudioElementOutput(this.glue, this.audioRef.current);
        this.glue.connectOutput(this.output);
    }

    componentWillUnmount() {
        if (this.output) {
            this.glue.disconnectOutput(this.output);
        }
    }

    render() {
        const attr = {
            style: { width: '100%', display: 'none' },
            ref: this.audioRef,
            controls: true,
        };

        return e('audio', attr);
    }
}

export class NowPlaying extends React.Component {
    render() {
        const style = {
            margin: 0,
            padding: '10px 10px 0 10px',
            border: 0,
        };

        return e('div', { style }, [
            e(AudioElement, { key: 'audio-element' }),
            e(AudioControls, {
                key: 'audio-controls',
                colors: firefoxTheme,
                glue: window.lûd.glue,
            }),
            e(MediaControls, {
                key: 'media-controls',
                glue: window.lûd.glue,
            }),
        ]);
    }
}
