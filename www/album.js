/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

import { parseCue } from '/lud/cue.js';

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

export class Album extends React.Component {

    constructor (props) {
        super (props);

        this.state = { artFile: null, cueFile: null, audioFile: null, cueData: null };
    }

    componentDidMount() {
        this.subscription = PubSub.subscribe('now-playing', (topic, event) => {
            if (this.state.audioFile != event.src) {
                // console.log('new file!', event.src);
                const artFile = artFilename(event.src);
                const cueFile = cueFilename(event.src);

                this.setState({audioFile: event.src, artFile, cueFile });

                fetch(cueFile).then(
                    response => response.text(),
                ).then(
                    body => this.setState({ cueData: parseCue(body) }),
                    err => { console.log('error loading cue file', cueFile, err); }
                );
            }

            // console.log('now-playing event', event);
        });
    }

    componentWillUnmount() {
        if (this.subscription) {
            PubSub.unsubscribe(this.subscription);
        }
    }

    render() {
        // console.log('rendering', this.state.cueData);

        if (this.state.artFile) {
            const style = {
                margin: "10px",
                padding: 0,
                border: 0,
                maxWidth: "400px",
            };
            return e('img', {src: this.state.artFile, style });
        }

        return null;
    }
}

