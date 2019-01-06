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
import { addTrackLengths, indexCue, parseCue } from '/lud/cue.js';

const lodash = window._;

function basename(filename /*: string */) /* : string */ {
    return filename.substring(0, filename.lastIndexOf('.'));
}

function dirname(filename /*: string */) /* : string */ {
    return filename.substring(0, filename.lastIndexOf('/'));
}

function artistName(artistCredits /*: Array<ArtistCredit> */) {
    return artistCredits.map(ac => ac.name + ac.joinphrase).join('');
}

/*::
type ArtistCredit = {
    artist: {
        id: string,
        name: string,
    },
    joinphrase: string,
    name: string
}
*/

export class CurrentSong {
    /*::
      coverArt: string
      discNo: number
      discTitle: string
      albumArtist: Array<ArtistCredit>
      albumTitle: string
      releaseDate: string

      trackNo: number
      trackTitle: string
      trackArtist: Array<ArtistCredit>
      trackLength: ?number
    */

    constructor() {
        this.coverArt = '/lud/images/cover.jpg';
        this.discNo = 1;
        this.discTitle = '';
        this.albumArtist = [];
        this.albumTitle = '';
        this.resetTrack();
    }

    resetTrack() {
        this.trackNo = 1;
        this.trackTitle = '';
        this.trackArtist = [];
        this.trackLength = null;
    }

    getTrackArtistName() {
        return artistName(this.trackArtist);
    }

    getAlbumArtistName() {
        return artistName(this.albumArtist);
    }

    getFullDiscTitle() {
        if (this.discTitle && this.discTitle !== '') {
            return this.albumTitle + ': ' + this.discTitle;
        } else {
            return this.albumTitle;
        }
    }

    processCueRecord(
        trackNo /*: number */,
        cueData /*: Array<CueRecord> */,
        metadata /*: Object */
    ) {
        const discIdx = this.discNo - 1;
        const trackIdx = trackNo - 1;

        if (cueData[trackNo] && cueData[trackNo].duration) {
            this.trackLength = cueData[trackNo].duration;
        }

        if (metadata.media.length > discIdx) {
            const medium = metadata.media[discIdx];
            if (medium.tracks.length > trackIdx) {
                const trk = medium.tracks[trackIdx];
                if (trk) {
                    this.discTitle = medium.title ? medium.title : '';
                    this.trackNo = trackNo;
                    this.trackTitle = trk.title
                        ? trk.title
                        : trk.recording && trk.recording.title
                        ? trk.recording.title
                        : '<unknown track>';
                    this.trackArtist = trk['artist-credit']
                        ? trk['artist-credit']
                        : trk.recording['artist-credit']
                        ? trk.recording['artist-credit']
                        : [];
                    this.albumArtist = metadata['artist-credit'] ? metadata['artist-credit'] : [];
                    this.albumTitle = metadata['title'] ? metadata['title'] : '';

                    this.releaseDate = '';
                    if (metadata['release-events'] && metadata['release-events'].length > 0) {
                        this.releaseDate = metadata['release-events'][0].date;
                    }
                } else {
                    this.resetTrack();
                }
            }
        }
    }
}

export class AudioMetadata {
    /*::
      cueFile: ?string
      audioFile: ?string
      position: ?number
      duration: ?number
      metadata: Object
      cueData: Array<CueRecord>
      cueIndex: Array<number>
      ready: Promise<string|null>
      currentTrackNo: number
      currentSong: CurrentSong
    */

    constructor(cueFile /*: ?string */, position /*: ?number */) {
        this.cueFile = cueFile;
        this.audioFile = null;
        this.position = position ? position : 0;
        this.metadata = {};
        this.cueData = [];
        this.cueIndex = [];
        this.ready = Promise.resolve(null);
        this.currentTrackNo = 0;
        this.currentSong = new CurrentSong();

        console.log('creating metadata', cueFile, position);

        if (!cueFile) {
            return;
        }

        this.currentSong.coverArt = dirname(cueFile) + '/cover.jpg';

        const metadataFile = dirname(cueFile) + '/metadata.json';

        const matches = cueFile.match(/\/disc([0-9]+)\.cue$/);
        if (matches) {
            this.currentSong.discNo = parseInt(matches[1], 10);
        }

        const cuePromise = fetch(cueFile)
            .then(response => response.text())
            .then(body => {
                this.cueData = addTrackLengths(parseCue(body));
                this.cueIndex = indexCue(this.cueData);

                if (cueFile && this.cueData.length > 0) {
                    if (this.cueData[0].duration) {
                        this.duration = this.cueData[0].duration;
                    }

                    const audioFile = this.cueData[0].filename;
                    return audioFile ? dirname(cueFile) + '/' + audioFile : null;
                } else {
                    return null;
                }
            });

        const metaPromise = fetch(metadataFile)
            .then(response => response.json())
            .then(data => {
                this.metadata = data;
                return this.metadata;
            });

        this.ready = Promise.all([cuePromise, metaPromise]).then(resolved => resolved[0]);
        this.setPosition(position ? position : 0);
    }

    setPosition(position /*: number */) {
        this.position = position;

        return this.ready.then(_ => {
            // add a tiny value to make sure floating point rounding errors don't result in
            // the previous track being returned if we _just_ started playing a track.
            const trackNo = lodash.sortedIndex(this.cueIndex, position + 0.00001);

            if (this.currentTrackNo === trackNo) {
                return;
            }

            this.currentTrackNo = trackNo;
            this.currentSong.processCueRecord(trackNo, this.cueData, this.metadata);
        });
    }

    getTrackStartPosition(trackNo /*: number */) {
        return this.ready.then(_ => {
            if (this.cueData[trackNo] && this.cueData[trackNo].start) {
                return this.cueData[trackNo].start.seconds;
            } else {
                return 0;
            }
        });
    }

    getAudioFile() {
        if (!this.cueFile || this.cueData.length === 0) {
            return null;
        }

        const cueDataZero = this.cueData[0];
        const filename = cueDataZero.filename;

        if (filename) {
            return dirname(this.cueFile) + '/' + filename;
        }

        return null;
    }
}
