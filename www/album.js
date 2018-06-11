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
import { parseCue } from '/lud/cue.js';

const React = window.React;
const e = React.createElement;

function artFilename(discFilename) {
    const parts = discFilename.split('/');
    parts.pop();
    parts.push('cover.jpg');
    const ret = parts.join('/');
    // console.log('constructed cover art filename:', ret);
    return ret;
}

function cueFilename(discFilename) {
    const parts = discFilename.split('.');
    parts.pop();
    parts.push('cue');
    const ret = parts.join('.');
    // console.log('constructed cue filename:', ret);
    return ret;
}

function currentSong(
    position /* ?: number */,
    cueData /* : Array<CueRecord> */
) {
    if (!position && position !== 0) {
        return null;
    }

    if (!cueData) {
        return null;
    }

    if (!cueData || !Array.isArray(cueData)) {
        return null;
    }

    let song = null;
    cueData.map(trk => {
        if (trk.start && trk.start.seconds < position) {
            song = trk;
        }
    });

    return song;
}

class Album extends React.Component {
    render() {
        const song = currentSong(this.props.currentTime, this.props.cueData);
        if (song) {
            console.log('current song:', song.title);
        }

        if (this.props.artFile) {
            const style = {
                margin: '10px',
                padding: 0,
                border: 0,
                maxWidth: '400px',
            };
            return e('img', { src: this.props.artFile, style });
        }

        return null;
    }
}

export class NowPlayingAlbum extends React.Component {
    constructor(props /* : {} */) {
        super(props);

        const self /* :any */ = this;

        self.glue = window.lûd.glue;
        self.handleFileChanged = this.handleFileChanged.bind(this);
        self.state = {
            artFile: null,
            cueFile: null,
            audioFile: null,
            cueData: null,
            currentTime: 0,
        };
    }

    componentWillUnmount() {
        this.glue.disconnectControl(this);
    }

    handleFileChanged(audioFile /* : string */) {
        if (audioFile === '') {
            this.setState({
                audioFile: null,
                artFile: null,
                cueFile: null,
                cueData: {},
                currentTime: 0,
            });
            return;
        }

        console.log('new file!', audioFile);
        const artFile = artFilename(audioFile);
        const cueFile = cueFilename(audioFile);

        this.setState({ audioFile, artFile, cueFile });

        fetch(cueFile)
            .then(response => response.text())
            .then(
                body => {
                    this.setState({ cueData: parseCue(body) });
                },
                err => {
                    console.log('error loading cue file', cueFile, err);
                }
            );
    }

    tick() {
        const audioFile = this.glue.getCurrentMedia();
        if (this.state.audioFile != audioFile) {
            this.handleFileChanged(audioFile);
        }

        this.setState({ currentTime: this.glue.getCurrentTime() });
    }

    render() {
        setTimeout(() => this.glue.connectControl(this), 0);

        if (!this.state.audioFile) {
            // FIXME: support empty state in Album component
            return null;
        }

        return e(Album, {
            artFile: this.state.artFile,
            audioFile: this.state.audioFile,
            cueData: this.state.cueData,
            cueFile: this.state.cueFile,
            currentTime: this.state.currentTime,
        });
    }
}
