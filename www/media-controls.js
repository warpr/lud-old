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
const { MDCSlider } = window.mdc.slider;

class Slider extends React.PureComponent {
    render() {
        setTimeout(() => {
            const slider = new MDCSlider(document.querySelector('.mdc-slider'));
            slider.value = 25;
            slider.listen('MDCSlider:change', () =>
                console.log(`Value changed to ${slider.value}`)
            );

            window.s = slider;
        }, 500);

        return e(
            'div',
            { className: 'mdc-slider', tabIndex: 0, role: 'slider' },
            keys([
                e(
                    'div',
                    { className: 'mdc-slider__track-container' },
                    e('div', { className: 'mdc-slider__track' })
                ),
                e(
                    'div',
                    { className: 'mdc-slider__thumb-container' },
                    keys([
                        e(
                            'svg',
                            {
                                className: 'mdc-slider__thumb',
                                width: 21,
                                height: 21,
                            },
                            e('circle', { cx: 10.5, cy: 10.5, r: 7.875 })
                        ),
                        e('div', { className: 'mdc-slider__focus-ring' }),
                    ])
                ),
            ])
        );
    }
}

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

    render() {
        const { theme } = this.props;
        const iconAttr = { style: { height: 38, width: 38 } };
        const coverArt = 'https://via.placeholder.com/256x256.png';

        // FIXME: Add a heart button to indicate liking a song/album
        // See: https://material-ui.com/demos/selection-controls/

        console.log('theme set');
        window.t = theme;

        return e(
            M.Card,
            {
                style: {
                    display: 'flex',
                    justifyContent: 'space-between',
                    marginTop: theme.spacing.unit,
                    marginBottom: theme.spacing.unit,
                },
            },
            keys([
                e(
                    'div',
                    {
                        style: {
                            display: 'flex',
                            flexGrow: 2,
                            flexDirection: 'column',
                        },
                    },
                    keys([
                        e(
                            M.CardContent,
                            { style: { flex: '1 0 auto' } },
                            keys([
                                e(
                                    M.Typography,
                                    { variant: 'headline' },
                                    'Live From Space'
                                ),
                                e(
                                    M.Typography,
                                    {
                                        variant: 'subheading',
                                        color: 'textSecondary',
                                    },
                                    'Mac Miller'
                                ),
                                e(Slider, {}),
                            ])
                        ),
                        e(
                            'div',
                            {
                                style: {
                                    display: 'flex',
                                    alignItems: 'center',
                                    paddingLeft: theme.spacing.unit,
                                    paddingBottom: theme.spacing.unit,
                                },
                            },
                            keys([
                                e(
                                    M.IconButton,
                                    {},
                                    e(M.Icon, iconAttr, 'skip_previous')
                                ),
                                e(
                                    M.IconButton,
                                    {},
                                    e(M.Icon, iconAttr, 'replay_30')
                                ),
                                e(
                                    M.IconButton,
                                    {},
                                    e(M.Icon, iconAttr, 'pause')
                                ),
                                e(
                                    M.IconButton,
                                    {},
                                    e(M.Icon, iconAttr, 'play_arrow')
                                ),
                                e(
                                    M.IconButton,
                                    {},
                                    e(M.Icon, iconAttr, 'forward_30')
                                ),
                                e(
                                    M.IconButton,
                                    {},
                                    e(M.Icon, iconAttr, 'skip_next')
                                ),
                            ])
                        ),
                    ])
                ),
                e(
                    M.CardMedia,
                    {
                        image: coverArt,
                        style: { height: 256, width: 256 },
                        title: 'Live From Space Album Cover',
                    },
                    []
                ),
            ])
        );
    }
}

export const MediaControls = M.withTheme()(MediaControlsBase);
