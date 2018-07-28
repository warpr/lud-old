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
import { type CueRecord } from '/lud/cue.js';
*/
import { indexCue, parseCue } from '/lud/cue.js';

const lodash = window._;

function basename(filename /*: string */) /* : string */ {
    return filename.substring(0, filename.lastIndexOf('.'));
}

function dirname(filename /*: string */) /* : string */ {
    return filename.substring(0, filename.lastIndexOf('/'));
}

export class AudioMetadata {
    /*::
      filename: ?string
      position: ?number
      coverArt: ?string
      metadata: Object
      cueData: Array<CueRecord>
      cueIndex: Array<number>
      ready: Promise<void>
      currentSong: ?CueRecord
     */

    constructor(filename /*: ?string */, position /*: ?number */) {
        this.filename = filename;
        this.position = position ? position : 0;
        this.coverArt = '/lud/images/cover.jpg';
        this.metadata = {};
        this.cueData = [];
        this.cueIndex = [];
        this.ready = Promise.resolve();
        this.currentSong = null;

        if (!filename) {
            return;
        }

        this.coverArt = dirname(filename) + '/cover.jpg';

        const cueFile = basename(filename) + '.cue';
        const metadataFile = dirname(filename) + '/metadata.json';

        const cuePromise = fetch(cueFile)
            .then(response => response.text())
            .then(body => {
                this.cueData = parseCue(body);
                this.cueIndex = indexCue(this.cueData);
            });

        const metaPromise = fetch(metadataFile)
            .then(response => response.json())
            .then(data => {
                this.metadata = data;
            });

        this.ready = Promise.all([cuePromise, metaPromise]).then(_ => undefined);
        this.setPosition(position ? position : 0);
    }

    setPosition(position /*: number */) {
        return this.ready.then(_ => {
            // add a tiny value to make sure floating point rounding errors don't result in
            // the previous track being returned if we _just_ started playing a track.
            const trackIdx = lodash.sortedIndex(this.cueIndex, position + 0.00001) + 1;

            this.currentSong = trackIdx > 0 ? this.cueData[trackIdx] : null;
        });
    }

    getTrackStartPosition(trackNo /*: number */) {
        return this.ready.then(_ => {
            const trackIdx = trackNo - 1;
            if (this.cueData[trackIdx] && this.cueData[trackIdx].start) {
                return this.cueData[trackIdx].start.seconds;
            } else {
                return 0;
            }
        });
    }
}
