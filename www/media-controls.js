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

class Slider extends React.Component {
    constructor(props /* : SliderProps */) {
        super(props);

        this._mounted = false;
        this._sliderRef = React.createRef();
        this.state = { value: 0 };
        this.handleChange = this.handleChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }

    static getDerivedStateFromProps(nextProps /* : SliderProps */, prevState /* : SliderState */) {
        const newValue = (nextProps.position / nextProps.duration) * 100;
        return { value: newValue };
    }

    componentDidMount() {
        this._mounted = true;
        this._dragging = false;

        this.slider = new MDCSlider(this._sliderRef.current);
        this.slider.value = this.state.value;
        this.slider.listen('MDCSlider:change', this.handleChange);
        this.slider.listen('MDCSlider:input', this.handleInput);
    }

    componentWillUnmount() {
        this._mounted = false;
        this._dragging = false;

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
        this._dragging = false;

        const newTime = this.props.duration * (this.slider.value / 100);
        this.props.glue.setCurrentTime(newTime);
    }

    /*:: handleInput: () => void */
    handleInput() {
        this._dragging = true;
    }

    shouldComponentUpdate(nextProps /* : SliderProps */, nextState /* : SliderState */) {
        if (this.slider && !this._dragging && this.state.value != nextState.value) {
            this.slider.value = nextState.value;
        }

        return false;
    }

    render() {
        if (this.slider) {
            this.slider.value = this.state.value;
        }

        return e(
            'div',
            { ref: this._sliderRef, className: 'mdc-slider', tabIndex: 0, role: 'slider' },
            e(
                'div',
                { className: 'mdc-slider__track-container' },
                e('div', { className: 'mdc-slider__track' })
            ),
            e(
                'div',
                { className: 'mdc-slider__thumb-container' },
                e(
                    'svg',
                    { className: 'mdc-slider__thumb', width: 21, height: 21 },
                    e('circle', { cx: 10.5, cy: 10.5, r: 7.875 })
                ),
                e('div', { className: 'mdc-slider__focus-ring' })
            )
        );
    }
}

const StyledCard = styled(M.Card)`
    display: flex;
    justify-content: space-between;
    margin-top: ${props => props.theme.spacing.unit + 'px'};
    margin-bottom: ${props => props.theme.spacing.unit + 'px'};
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
    padding-left: ${props => props.theme.spacing.unit + 'px'};
    padding-bottom: ${props => props.theme.spacing.unit + 'px'};
`;

const StyledIconButton = styled(M.IconButton)`
    margin: ${props => props.theme.spacing.unit + 'px'};
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

        this.handlePrev = this.handlePrev.bind(this);
        this.handleRewind = this.handleRewind.bind(this);
        this.handlePause = this.handlePause.bind(this);
        this.handlePlay = this.handlePlay.bind(this);
        this.handleFfwd = this.handleFfwd.bind(this);
        this.handleNext = this.handleNext.bind(this);
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

    /*:: handlePrev: () => void */
    handlePrev() {
        this.props.glue.prev();
    }

    /*:: handleRewind: () => void */
    handleRewind() {
        this.props.glue.rewind(30);
    }

    /*:: handlePause: () => void */
    handlePause() {
        this.props.glue.pause();
    }

    /*:: handlePlay: () => void */
    handlePlay() {
        this.props.glue.resume();
    }

    /*:: handleFfwd: () => void */
    handleFfwd() {
        this.props.glue.ffwd(30);
    }

    /*:: handleNext: () => void */
    handleNext() {
        this.props.glue.next();
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
        setTimeout(() => this.state.glue.connectControl(this), 0);

        const { currentSong } = this.state.glue.metadata;
        const { theme } = this.props;
        const iconAttr = { style: { height: 38, width: 38 } };
        const coverArt = currentSong.coverArt;

        const title = currentSong.trackTitle;
        const artist = currentSong.getTrackArtistName();
        const coverTooltip = title + ' Album Cover';

        // FIXME: Add a heart button to indicate liking a song/album
        // See: https://material-ui.com/demos/selection-controls/

        const slider = e(Slider, {
            glue: this.props.glue,
            position: this.state.position,
            duration: this.state.duration,
        });

        return e(
            StyledCard,
            { theme },
            e(
                StyledLeftColumn,
                { theme },
                e(
                    StyledCardContent,
                    { theme },
                    e(M.Typography, { variant: 'headline' }, title),
                    e(M.Typography, { variant: 'subheading', color: 'textSecondary' }, artist),
                    slider
                ),
                e(
                    StyledControls,
                    { theme },
                    e(
                        StyledIconButton,
                        { theme, onClick: this.handlePrev },
                        e(M.Icon, iconAttr, 'skip_previous')
                    ),
                    e(
                        StyledIconButton,
                        { theme, onClick: this.handleRewind },
                        e(M.Icon, iconAttr, 'replay_30')
                    ),
                    e(
                        StyledIconButton,
                        { theme, onClick: this.handlePause },
                        e(M.Icon, iconAttr, 'pause')
                    ),
                    e(
                        StyledIconButton,
                        { theme, onClick: this.handlePlay },
                        e(M.Icon, iconAttr, 'play_arrow')
                    ),
                    e(
                        StyledIconButton,
                        { theme, onClick: this.handleFfwd },
                        e(M.Icon, iconAttr, 'forward_30')
                    ),
                    e(
                        StyledIconButton,
                        { theme, onClick: this.handleNext },
                        e(M.Icon, iconAttr, 'skip_next')
                    )
                )
            ),
            e(StyledCardMedia, { theme, image: coverArt, title: coverTooltip })
        );
    }
}

export const MediaControls = M.withTheme()(MediaControlsBase);
