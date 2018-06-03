/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

import { AudioControls, blueprintTheme } from '/lud/audio-controls.js';

const e = React.createElement;

export class AudioElement extends React.Component {
    constructor(props) {
        super(props);
        this.audioRef = React.createRef();
        this.glue = window.lûd.glue;
    }

    shouldComponentUpdate() {
        // we never want to destroy the <audio> element, as it may be playing.
        // instead we'll update it directly via this.audioRef.
        return false;
    }

    componentDidMount() {
        const audioElement = this.audioRef.current;

        this.glue.connectOutput(audioElement);
    }

    componentWillUnmount() {
        const audioElement = this.audioRef.current;

        this.glue.disconnectOutput(audioElement);
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
                colors: blueprintTheme,
                glue: window.lûd.glue,
            }),
        ]);
    }
}
