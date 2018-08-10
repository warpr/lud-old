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

/*::
export interface AudioControl {
    tick(): void;
}
*/

/*::
export interface AudioOutput {
    disconnect(): void;
    getCurrentMedia(): string;
    getCurrentTime(): number;
    getDuration(): number;
    getVolume(): number;
    isMute(): bool;
    isPaused(): bool;
    isPlaying(): bool;
    loadMedia(string, ?(string|number), ?CurrentSong): void;
    pause(): void;
    play(): void;
    setCurrentTime(?number): void;
    setVolume(number): void;
}
*/

export class AudioGlue {
    /*::
      controls: Set<AudioControl>
      outputs: Array<AudioOutput>
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

    connectOutput(something /*: AudioOutput */) {
        this.outputs.push(something);
        this.tick();
    }

    disconnectOutput(something /*: AudioOutput */) {
        // FIXME: untested
        this.outputs
            .map((output, idx) => (output === something ? idx : null))
            .filter(item => !!item)
            .map((_, idx) => {
                this.outputs[idx].disconnect();
                this.outputs.splice(idx, 1);
            });
    }

    loadMedia(file /*: string */, position /*: ?number */) {
        this.metadata = new AudioMetadata(file, position);

        this.metadata.ready.then(() => {
            this.outputs.map(output => output.loadMedia(file, position, this.metadata.currentSong));
        });
    }

    prev() {
        this.play(this.metadata.currentSong.trackNo - 1);
    }

    next() {
        this.play(this.metadata.currentSong.trackNo + 1);
    }

    rewind(seconds /*: number */) {
        this.setCurrentTime(this.getCurrentTime() - seconds);
    }

    ffwd(seconds /*: number */) {
        this.setCurrentTime(this.getCurrentTime() + seconds);
    }

    play(trackNo /*: number */) {
        if (trackNo === 1) {
            this.setCurrentTime(0);
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
        this.metadata.setPosition(this.getCurrentTime());

        for (let control of this.controls) {
            control.tick();
        }
    }
}
