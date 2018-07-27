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
const styled = window.styled.default;
const e = React.createElement;
const M = window['material-ui'];
const { MDCSlider } = window.mdc.slider;

/*::
type SliderProps = {
    glue: AudioGlue,
    position: number,
    duration: number,
}

type SliderState = {
    value: number,
}
*/

class Slider extends React.PureComponent {
    constructor(props /* : SliderProps */) {
        super(props);

        this._mounted = false;
        this.state = { value: 0 };
        this.handleChange = this.handleChange.bind(this);
    }

    static getDerivedStateFromProps(
        nextProps /* : SliderProps */,
        prevState /* : SliderState */
    ) {
        const newValue = nextProps.position / nextProps.duration * 100;
        console.log('new props, new value', newValue);
        return { value: newValue };
    }

    componentDidMount() {
        this._mounted = true;

        // FIXME: use refs
        console.log("mounted, getting new slider set up");
        this.slider = new MDCSlider(document.querySelector('.mdc-slider'));
        this.slider.value = this.state.value;
        this.slider.listen('MDCSlider:change', this.handleChange);
    }

    componentWillUnmount() {
        this._mounted = false;

        console.log('unmounted');
        if (this.slider) {
            this.slider.unlisten('MDCSlider:change', this.handleChange);
            this.slider = null;
        }

        if (this.state.glue) {
            this.state.glue.disconnectControl(this);
        }
    }

    /*:: handleChange: () => void */
    handleChange() {
        //this.props.glue.setCurrentTime(value);
        console.log('Value changed to', this.slider.value)
    }

    shouldUpdate() {
        return false;
    }

    render() {
        if (this.slider) {
            console.log('rerender, new value is', this.state.value);
            this.slider.value = this.state.value;
        } else {
            console.log('no slider render');
        }

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

const StyledCard = styled(M.Card)`
    display: flex;
    justify-content: space-between;
    margin-top: ${props => props.theme.spacing.unit + "px" };
    margin-bottom: ${props => props.theme.spacing.unit + "px" };
`;

const StyledCardContent = styled(M.CardContent)`
    flex: 1 0 auto;
`;

const StyledLeftColumn = styled.div`
    display: flex;
    flex-grow: 2;
    flex-direction: column;
`;

const StyledControls = styled.div`
    display: flex;
    align-items: center;
    padding-left: ${props => props.theme.spacing.unit};
    padding-bottom: ${props => props.theme.spacing.unit};
`;

const StyledCardMedia = styled(M.CardMedia)`
    height: 256px;
    width: 256px;
`;

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
            console.log('media controls tick', position, duration);
            this.setState({ position, duration, volume });
        }
    }

    render() {
        setTimeout(() => this.state.glue.connectControl(this), 0);

        const { theme } = this.props;
        const iconAttr = { style: { height: 38, width: 38 } };
        const coverArt = 'https://via.placeholder.com/256x256.png';

        const title = 'Live From Space';
        const artist = 'Mac Miller';
        const coverTooltip = title + ' Album Cover';

        // FIXME: Add a heart button to indicate liking a song/album
        // See: https://material-ui.com/demos/selection-controls/

        const slider = e(Slider, { glue: this.props.glue, position: this.state.position, duration: this.state.duration });

        return e(StyledCard, { theme },
                 e(StyledLeftColumn, { theme },
                   e(StyledCardContent, { theme },
                     e(M.Typography, { variant: 'headline' }, title),
                     e(M.Typography, { variant: 'subheading', color: 'textSecondary' }, artist),
                     slider),
                   e(StyledControls, { theme },
                     e(M.IconButton, {}, e(M.Icon, iconAttr, 'skip_previous')),
                     e(M.IconButton, {}, e(M.Icon, iconAttr, 'replay_30')),
                     e(M.IconButton, {}, e(M.Icon, iconAttr, 'pause')),
                     e(M.IconButton, {}, e(M.Icon, iconAttr, 'play_arrow')),
                     e(M.IconButton, {}, e(M.Icon, iconAttr, 'forward_30')),
                     e(M.IconButton, {}, e(M.Icon, iconAttr, 'skip_next')))),
                 e(StyledCardMedia, {theme, image: coverArt, title: coverTooltip}));
    }
}

export const MediaControls = M.withTheme()(MediaControlsBase);
