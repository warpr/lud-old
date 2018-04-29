/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

const e = React.createElement;

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
        const a = this.audioRef.current;

        const data = window.localStorage.getItem('lud-now-playing');
        if (data) {
            console.log('initializing audio element from localStorage');
            const snapshot = JSON.parse(data);
            a.volume = snapshot.volume;
            a.src = snapshot.src;
            a.currentTime = snapshot.currentTime;
            if (!snapshot.paused) {
                a.play();
            }
        } else {
            console.log('initializing audio element props');
            a.volume = 0;
            a.src = this.props.src;
            if (this.props.src) {
                a.play();
            }
        }

        this.interval = setInterval(() => {
            if (this.audioRef.current) {
                const a = this.audioRef.current;

                const snapshot = {
                    src: a.src,
                    currentTime: a.currentTime,
                    paused: a.paused,
                    volume: a.volume,
                };

                console.log('snapshot', snapshot);

                window.localStorage.setItem('lud-now-playing', JSON.stringify(snapshot));
            }
        }, 5000);

        this.subscription = PubSub.subscribe('play-file', (topic, url) => {
            console.log('playing new file', url);
            a.src = url;
            a.play();
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
