/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

import { AudioMetadata } from '/lud/audio-metadata.js';

const lodash = window._;
const Immutable = window.Immutable;

export class ControlChannel {
    /*::
      audioElement: HTMLAudioElement
    */

    constructor(audioElement /*: HTMLAudioElement */) {
        this.audioElement = audioElement;
    }

    async updateFromServer() {
        console.log('update from server...');

        const response = await fetch('/lud/now-playing/');
        const json = await response.json();
        console.log('control channel received now-playing data', json);

        const nowPlaying = Immutable.fromJS(json);

        window.lûd.audioMetadata = new AudioMetadata(
            nowPlaying.get('cue_file'),
            nowPlaying.get('pos') / 1000
        );

        await window.lûd.audioMetadata.ready;

        return nowPlaying;
    }
}
