/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

import { AudioMetadata } from '/lud/audio-metadata.js';

/*::
interface AudioControl {
    tick(): void;
}
*/

function throttleOnAnimationFrame(callback) {
    let requestId = null;

    return function() {
        const context = this;
        const args = arguments;

        if (requestId) {
            cancelAnimationFrame(requestId);
        }

        requestId = requestAnimationFrame(() => {
            callback.apply(context, args);
            requestId = null;
        });
    };
}

class AudioElementOutput {
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

    loadMedia(file, position) {
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

export class AudioGlue {
    /*::
      controls: Set<AudioControl>
      outputs: Array<AudioElementOutput>
      metadata: AudioMetadata
    */

    constructor() {
        this.controls = new Set();
        this.outputs = [];
        this.metadata = new AudioMetadata();
    }

    connectControl(something /*: AudioControl */) {
        if (this.controls.has(something)) {
            return;
        }

        this.controls.add(something);
        this.tick();
    }

    disconnectControl(something /*: AudioControl */) {
        this.controls.delete(something);
    }

    connectOutput(something /*: HTMLAudioElement */) {
        if (something instanceof HTMLAudioElement) {
            this.outputs.push(new AudioElementOutput(this, something));
        } else {
            console.log('ERROR: Could not connect to unfamiliar audio interface', something);
        }

        this.tick();
    }

    disconnectOutput(something /*: HTMLAudioElement */) {
        // FIXME: untested
        this.outputs
            .map((output, idx) => (output.target === something ? idx : null))
            .filter(item => !!item)
            .map((_, idx) => {
                this.outputs[idx].disconnect();
                this.outputs.splice(idx, 1);
            });
    }

    loadMedia(file /*: string */, position /*: ?number */) {
        this.outputs.map(output => output.loadMedia(file, position));
        this.metadata = new AudioMetadata(file, position);
    }

    play(trackNo /*: number */) {
        if (trackNo === 1) {
            this.resume();
            return;
        }

        this.metadata.getTrackStartPosition(trackNo).then(position => {
            this.setCurrentTime(position);
            this.resume();
        });
    }

    resume() {
        this.outputs.map(output => output.play());
    }

    pause() {
        this.outputs.map(output => output.pause());
    }

    isPaused() {
        // just return the first one.
        return this.outputs.length ? this.outputs[0].isPaused() : true;
    }

    isPlaying() {
        return !this.isPaused();
    }

    getCurrentTime() {
        // just return the first one.
        return this.outputs.length ? this.outputs[0].getCurrentTime() : 0;
    }

    getCurrentMedia() {
        // just return the first one.
        return this.outputs.length ? this.outputs[0].getCurrentMedia() : 0;
    }

    setCurrentTime(position /*: number */) {
        this.outputs.map(output => output.setCurrentTime(position));
        this.metadata.setPosition(position);
    }

    getDuration() {
        // just return the first one.
        return this.outputs.length ? this.outputs[0].getDuration() : 0;
    }

    getVolume() {
        // just return the first one.
        return this.outputs.length ? this.outputs[0].getVolume() : 0;
    }

    isMute() {
        // just return the first one.
        return this.outputs.length ? this.outputs[0].isMute() : false;
    }

    setVolume(volume /*: number */) {
        this.outputs.map(output => output.setVolume(volume));
    }

    tick() {
        for (let control of this.controls) {
            control.tick();
        }
    }
}
