/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

import { AudioGlue } from '/lud/audio-glue.js';
import { keys } from '/lud/misc.js';

const React = window.React;
const e = React.createElement;
const M = window['material-ui'];

/*::
type MediaControlsProps = {
    glue: AudioGlue,
}

type MediaControlsState = {
    configuration: string,
    forceMobile: boolean,
    forceTablet: boolean,
    duration: number,
    glue: AudioGlue,
    mute: boolean,
    playing: boolean,
    position: number,
    oldVolume: number,
    volume: number,
}
*/

class MediaControlsBase extends React.PureComponent {
    constructor(props /* : MediaControlsProps */) {
        super(props);

        this._mounted = false;

        this.state = {};
    }

    static getDerivedStateFromProps(
        nextProps /* : MediaControlsProps */,
        prevState /* : MediaControlsState */
    ) {
        return {
            duration: nextProps.glue.getDuration(),
            glue: nextProps.glue,
            mute: nextProps.glue.isMute(),
            playing: nextProps.glue.isPlaying(),
            position: nextProps.glue.getCurrentTime(), // in milli-seconds
            oldVolume: nextProps.glue.getVolume() * 1000, // 0 to 1000
            volume: nextProps.glue.getVolume() * 1000, // 0 to 1000
        };
    }

    componentDidMount() {
        this._mounted = true;
    }

    componentWillUnmount() {
        this._mounted = false;

        if (this.state.glue) {
            this.state.glue.disconnectControl(this);
        }
    }

    tick() {
        if (!this._mounted) {
            return;
        }

        const position = this.props.glue.getCurrentTime();
        const duration = this.props.glue.getDuration();
        const volume = this.props.glue.getVolume() * 1000; // 0 to 1000

        if (
            position != this.state.position ||
            duration != this.state.duration ||
            volume != this.state.volume
        ) {
            this.setState({ position, duration, volume });
        }
    }

    render () {
        const { theme } = this.props;
        const iconAttr = { style: { height: 38, width: 38 } };
        const coverArt = "https://via.placeholder.com/256x256.png";

        return e(M.Card, { style: { display: "flex", justifyContent: "space-between" }}, keys([
            e('div', { style: { display: "flex", flexDirection: "column" }}, keys([
                e(M.CardContent, { style: { flex: "1 0 auto" }}, keys([
                    e(M.Typography, { variant: "headline" }, "Live From Space"),
                    e(M.Typography, { variant: "subheading", color: "textSecondary" }, "Mac Miller")
                ])),
                e('div', { style: { display: "flex", alignItems: "center", paddingLeft: theme.spacing.unit, paddingBottom: theme.spacing.unit }}, keys([
                    e(M.IconButton, {}, e(M.Icon, iconAttr, "skip_previous")),
                    e(M.IconButton, {}, e(M.Icon, iconAttr, "play_arrow")),
                    e(M.IconButton, {}, e(M.Icon, iconAttr, "skip_next")),
                ])),
            ])),
            e(M.CardMedia, { image: coverArt, style: { height: 151, width: 151 }, title: "Live From Space Album Cover" }, [])
        ]));
    }
}

export const MediaControls = M.withTheme()(MediaControlsBase);
