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

const React = window.React;
const e = React.createElement;

const size = 40; // control bar height
const forceMobile = 600; // force mobile view if screen width < this value
const forceTablet = 800; // force tablet view if screen width < this value

/*::
type AudioEventNames = 'configuration'
    | 'currentTime'
    | 'mute'
    | 'playing'
    | 'position'
    | 'volume';

type AudioControlNames = 'prevAlbum'
     | 'prevTrack'
     | 'pause'
     | 'pausePlay'
     | 'nextTrack'
     | 'nextAlbum'
     | 'currentTime'
     | 'position'
     | 'positionDuration'
     | 'muteUnmute'
     | 'volume'
     | 'configuration';

type ColorTheme = {
     background: string,
     foreground: string,
     subdued: string,
     selected: string,
     slider: string,
     loaded: string,
     played: string,
}
*/

export const firefoxTheme = {
    background: '#1c1f21',
    foreground: '#ffffff',
    subdued: '#929292',
    selected: '#48a0f7',
    slider: '#000000',
    loaded: '#525354',
    played: '#00b6f0',
};

function formatTime(seconds) {
    const parts = [Math.floor((seconds / 60) % 60), Math.floor(seconds % 60)];

    const hours = Math.floor(seconds / 60 / 60);
    if (hours) {
        parts.unshift(hours);
    }

    return parts.join(':').replace(/:(\d)\b/g, ':0$1');
}

function Text(props) {
    return e('span', { style: { color: props.color } }, props.text);
}

function Numbers(props) {
    const colors = props.colors;

    const style = {
        background: 'inherit',
        padding: '0 5px',
        margin: 0,
        border: 0,
        minWidth: size + 'px',
        height: size + 'px',
        lineHeight: size + 'px',
        flex: '0 1 auto',
        fontSize: '14px',
    };

    const children = [
        e(Text, {
            key: 'part1',
            text: formatTime(props.value[0]),
            color: colors.foreground,
        }),
    ];

    if (props.value.length > 1) {
        children.push(
            e(Text, {
                key: 'part2',
                text: ' / ' + formatTime(props.value[1]),
                color: colors.subdued,
            })
        );
    }

    return e('div', { style }, children);
}

class Slider extends React.PureComponent {
    constructor(props) {
        super(props);

        const self /* :any */ = this;
        self.handleChange = this.handleChange.bind(this);
        self.sliderRef = React.createRef();
    }

    handleChange(event) {
        this.props.onChange(this.props.control, event.target.value);
    }

    render() {
        const colors = this.props.colors;

        const style = {
            padding: '0 5px',
            margin: 0,
            border: 0,
            minWidth: size * 2 + 'px',
            height: size + 'px',
            flexShrink: 0,
            flexGrow: this.props.grow,
            flexBasis: 'auto',
            background: 'inherit',
            position: 'relative',
        };

        const inputAttributes = {
            style: {
                height: size + 'px',
                width: '100%',
            },
            type: 'range',
            max: this.props.max,
            value: this.props.value,
            onChange: this.handleChange,
        };

        return e('div', { style }, e('input', inputAttributes));
    }
}

class Button extends React.PureComponent {
    constructor(props) {
        super(props);

        const self /* :any */ = this;
        self.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        switch (this.props.control) {
            case 'pause':
                return this.props.onChange('playing', false);
            case 'play':
                return this.props.onChange('playing', true);
            case 'pausePlay':
                return this.props.onChange('playing', !this.props.playing);
            case 'muteUnmute':
                const isMuted = this.props.mute || this.props.volume == 0;
                return this.props.onChange('mute', !isMuted);
            default:
                return this.props.onChange(this.props.control, true);
        }
    }

    render() {
        const colors = this.props.colors;
        const style = {
            padding: 0,
            margin: 0,
            border: 0,
            width: '32px',
            height: size + 'px',
            background: 'inherit',
            color: this.props.selected
                ? colors.selected
                : this.props.disabled
                    ? colors.subdued
                    : colors.foreground,
            display: 'block',
            flex: '0 0 auto',
        };

        const iconOptions = { className: 'fa fa-fw fa-' + this.props.icon };
        return e('button', { style, onClick: this.handleClick }, e('i', iconOptions));
    }
}

/*::
type ControlProps = {
    colors: ColorTheme,
    configuration: string,
    control: AudioControlNames,
    duration: string,
    mute: boolean,
    onChange: function,
    playing: boolean,
    position: string,
    volume: number,
}

type ControlAttributes = {
    colors: ColorTheme,
    control: AudioControlNames,
    onChange: function,
    disabled?: boolean,
    grow?: number,
    icon?: string,
    max?: any,
    mute?: boolean,
    volume?: any,
    playing?: boolean,
    value?: any,
}
*/

function Control(props /* : ControlProps */) {
    const iconMap = {
        prevAlbum: 'fast-backward',
        prevTrack: 'backward',
        pause: 'pause',
        play: 'play',
        nextTrack: 'forward',
        nextAlbum: 'fast-forward',
        // (un)mute show the current state, not the state after pressing the button
        mute: 'volume-up',
        unmute: 'volume-off',

        // these don't need/have icons in the iconMap
        configuration: null,
        currentTime: null,
        muteUnmute: null,
        pausePlay: null,
        position: null,
        positionDuration: null,
        volume: null,
    };

    const attr /* : ControlAttributes */ = {
        colors: props.colors,
        control: props.control,
        onChange: props.onChange,
    };

    if (iconMap[props.control]) {
        attr.icon = iconMap[props.control];
    }

    let Element = Button;

    switch (props.control) {
        case 'pause':
            attr.disabled = !props.playing;
            break;
        case 'play':
            attr.disabled = props.playing;
            break;
        case 'pausePlay':
            attr.icon = props.playing ? iconMap.pause : iconMap.play;
            attr.playing = props.playing;
            break;
        case 'muteUnmute':
            if (props.mute || props.volume == 0) {
                attr.icon = iconMap.unmute;
            } else {
                attr.icon = iconMap.mute;
            }
            attr.mute = props.mute;
            attr.volume = props.volume;
            break;
        case 'configuration':
            attr.icon = props.configuration;
            break;
        case 'position':
            Element = Numbers;
            attr.value = [props.position];
            break;
        case 'positionDuration':
            Element = Numbers;
            attr.value = [props.position, props.duration];
            break;
        case 'currentTime':
            Element = Slider;
            attr.value = props.position;
            attr.max = props.duration;
            attr.grow = 6;
            break;
        case 'volume':
            Element = Slider;
            attr.value = props.volume;
            attr.max = 1000;
            attr.grow = 1;
            break;
    }

    return e(Element, attr);
}

function AudioControlsUI(props) {
    const colors = props.colors;

    const style = {
        padding: '0 5px',
        margin: 0,
        border: 0,
        width: '100%',
        height: size + 'px',
        background: colors.background,
        display: 'flex',
        fontSize: '18px',
    };

    const children = Array.from(props.controls).map(name =>
        e(Control, {
            colors: colors,
            key: name,
            control: name,
            configuration: props.configuration,
            position: props.position,
            duration: props.duration,
            playing: props.playing,
            mute: props.mute,
            volume: props.volume,
            onChange: props.onChange,
        })
    );

    return e('div', { style }, children);
}

const buttonConfigurations = {};
const buttonConfigurationOrder = {
    mobile: 'tablet',
    tablet: 'desktop',
    desktop: 'mobile',
};

buttonConfigurations.forcedMobile = new Set([
    'prevTrack',
    'pausePlay',
    'nextTrack',
    'currentTime',
    'position',
]);

buttonConfigurations.mobile = new Set([
    'prevTrack',
    'pausePlay',
    'nextTrack',
    'currentTime',
    'position',
    'configuration',
]);

buttonConfigurations.tablet = new Set([
    'prevTrack',
    'pausePlay',
    'nextTrack',
    'currentTime',
    'positionDuration',
    'muteUnmute',
    'volume',
    'configuration',
]);

buttonConfigurations.desktop = new Set([
    'prevAlbum',
    'prevTrack',
    'pause',
    'play',
    'nextTrack',
    'nextAlbum',
    'currentTime',
    'positionDuration',
    'muteUnmute',
    'volume',
    'configuration',
]);

/*::
type AudioControlsProps = {
    glue: AudioGlue,
}

type AudioControlsState = {
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

export class AudioControls extends React.PureComponent {
    constructor(props /* : AudioControlsProps */) {
        super(props);

        this._mounted = false;

        this.handleChange = this.handleChange.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.state = {
            configuration: 'desktop',
            forceMobile: window.innerWidth < forceMobile,
            forceTablet: window.innerWidth < forceTablet,
        };
    }

    static getDerivedStateFromProps(
        nextProps /* : AudioControlsProps */,
        prevState /* : AudioControlsState */
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
        window.addEventListener('lûd-raf-resize', this.handleResize);

        this._mounted = true;
    }

    componentWillUnmount() {
        window.removeEventListener('lûd-raf-resize', this.handleResize);

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

    /*:: handleResize: () => void */
    handleResize() {
        if (window.innerWidth < forceMobile && !this.state.forceMobile) {
            this.setState({ forceMobile: true });
        } else if (window.innerWidth >= forceMobile && this.state.forceMobile) {
            this.setState({ forceMobile: false });
        }

        if (window.innerWidth < forceTablet && !this.state.forceTablet) {
            this.setState({ forceTablet: true });
        } else if (window.innerWidth >= forceTablet && this.state.forceTablet) {
            this.setState({ forceTablet: false });
        }
    }

    /*:: handleChange: () => void */
    handleChange(field /* : string */, value /* : string */) {
        const newState = {};

        if (field == 'currentTime' || field == 'position') {
            newState.position = value;
            this.props.glue.setCurrentTime(value);
        } else if (field == 'playing') {
            newState.playing = value;
            value ? this.props.glue.play() : this.props.glue.pause();
        } else if (field == 'mute') {
            newState.mute = value;

            if (newState.mute) {
                this.setState({ oldVolume: this.state.volume });
                this.props.glue.setVolume(0);
            } else {
                this.setState({ volume: this.state.oldVolume });
                this.props.glue.setVolume(this.state.oldVolume / 1000);
            }
        } else if (field == 'volume') {
            newState.volume = parseInt(value, 10);
            this.props.glue.setVolume(newState.volume / 1000);
        } else if (field == 'configuration') {
            let nxt = buttonConfigurationOrder[this.state.configuration];
            // force cycle through mobile + tablet if there is no space to show desktop configuration
            if (this.state.forceTablet && nxt === 'desktop') {
                nxt = buttonConfigurationOrder['desktop'];
            }

            newState.configuration = nxt;
        }

        this.setState(newState);
    }

    render() {
        setTimeout(() => this.state.glue.connectControl(this), 0);

        let configuration = buttonConfigurations[this.state.configuration];
        if (this.state.forceMobile) {
            configuration = buttonConfigurations.forcedMobile;
        } else if (this.state.forceTablet) {
            configuration = buttonConfigurations.tablet;
        }

        return e(
            AudioControlsUI,
            Object.assign(
                {
                    controls: configuration,
                    onChange: this.handleChange,
                    colors: this.props.colors,
                },
                this.state
            )
        );
    }
}

export class AudioDemo extends React.Component {
    render() {
        const style = {
            margin: 0,
            padding: '10px 10px 0 10px',
            border: 0,
        };

        return e('div', { style }, [e(AudioControls, { key: 'firefox', colors: firefoxTheme })]);
    }
}
