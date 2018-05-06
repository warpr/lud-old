/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

const e = React.createElement;

const size = 40;

const iconMap = {
    prevAlbum: "fast-backward",
    prevTrack: "backward",
    pause: "pause",
    play: "play",
    nextTrack: "forward",
    nextAlbum: "fast-forward",
    // (un)mute show the current state, not the state after pressing the button
    mute: "volume-up",
    unmute: "volume-off",
}

const firefoxTheme = {
    background: '#1c1f21',
    foreground: '#ffffff',
    subdued: '#929292',
    selected: '#48a0f7',
    slider: '#000000',
    loaded: '#525354',
    played: '#00b6f0',
};

const blueprintTheme = {
    background: Blueprint.Core.Colors.DARK_GRAY1,
    foreground: Blueprint.Core.Colors.LIGHT_GRAY5,
    subdued: Blueprint.Core.Colors.GRAY3,
    selected: Blueprint.Core.Colors.BLUE5,
    slider: Blueprint.Core.Colors.BLACK,
    loaded: Blueprint.Core.Colors.DARK_GRAY5,
    played: Blueprint.Core.Colors.BLUE5,
};

function formatTime(milliseconds) {
    const seconds = milliseconds / 1000;

    const parts = [
        Math.floor(seconds / 60 % 60),
        Math.floor(seconds % 60)
    ];

    const hours = Math.floor(seconds / 60 / 60);
    if (hours) {
        parts.unshift(hours);
    }

    return parts.join(":").replace(/:(\d)\b/g, ":0$1");
}

export class Numbers extends React.Component {
    render() {
        const colors = this.props.colors;

        const style = {
            background: "inherit",
            padding: "0 5px",
            margin: 0,
            border: 0,
            minWidth: (size * 2) + "px",
            height: size + "px",
            lineHeight: size + "px",
            flex: "0 1 auto",
            fontSize: "14px",
        };

        const children = [
            e('span',
              {key: 'pos', style: { color: colors.foreground }},
              formatTime(this.props.value[0]))
        ];

        if (this.props.value.length > 1) {
            children.push(
                e('span',
                  { key: 'dur', style: { color: colors.subdued }},
                  " / " + formatTime(this.props.value[1]))
            );
        }

        return e('div', { style }, children);
    }
};

export class Slider extends React.Component {
    constructor(props) {
        super(props);

        this.sliderClicked = this.sliderClicked.bind(this);
        this.sliderRef = React.createRef();
    }

    sliderClicked(event) {
        const rect = this.sliderRef.current.getBoundingClientRect();
        const relativePosition = event.clientX - rect.x;

        const value = relativePosition / rect.width;
        this.props.onChange(this.props.control, this.props.max * value);
    }

    render() {
        const colors = this.props.colors;

        const style = {
            padding: "0 5px",
            margin: 0,
            border: 0,
            minWidth: (size * 2) + "px",
            height: size + "px",
            flexShrink: 0,
            flexGrow: this.props.grow,
            flexBasis: "auto",
            background: "inherit",
            position: "relative",
        };

        const sliderBackground = {
            borderRadius: "4px",
            marginTop: ((size - 8) / 2) + "px",
            height: "8px",
            width: "100%",
            background: colors.slider,
            overflow: "hidden",
            position: "relative",
        };

        const pos = Math.floor(this.props.value / this.props.max * 100);

        const sliderPlayed = {
            position: "absolute",
            top: 0,
            left: 0,
            height: "8px",
            width: pos + "%",
            background: colors.played,
        };

        return e('div', { style },
                 e('div', { style: sliderBackground, ref: this.sliderRef, onClick: this.sliderClicked },
                   e('div', { style: sliderPlayed })));
    }
}

export class Button extends React.Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        switch (this.props.control) {
        case "pause":
            return this.props.onChange('playing', false);
        case "play":
            return this.props.onChange('playing', true);
        case "pausePlay":
            return this.props.onChange('playing', !this.props.playing);
        case "muteUnmute":
            const isMuted = this.props.mute || this.props.volume == 0;
            return this.props.onChange('mute', !isMuted);
        default:
            return this.props.onChange(controlName, true);
        }
    }

    render() {
        const colors = this.props.colors;
        const style = {
            padding: 0,
            margin: 0,
            border: 0,
            width: "32px",
            height: size + "px",
            background: "inherit",
            color: this.props.selected
                ? colors.selected
                : (this.props.disabled ? colors.subdued : colors.foreground),
            display: "block",
            flex: "0 0 auto",
        };

        const iconOptions = { className: "fa fa-fw fa-" + this.props.icon };
        return e('button', { style, onClick: this.handleClick }, e('i', iconOptions));
    }
}

export class Control extends React.Component {
    render() {
        const attr = {
            colors: this.props.colors,
            control: this.props.control,
            onChange: this.props.onChange,
        }

        if (iconMap[this.props.control]) {
            attr.icon = iconMap[this.props.control];
        }

        let Element = Button;

        switch (this.props.control) {
        case "pause":
            attr.disabled = !this.props.playing;
            break;
        case "play":
            attr.disabled = this.props.playing;
            break;
        case "pausePlay":
            attr.icon = this.props.playing ? iconMap.pause : iconMap.play;
            break;
        case "muteUnmute":
            if (this.props.mute || this.props.volume == 0) {
                attr.icon = iconMap.unmute;
            } else {
                attr.icon = iconMap.mute;
            }
            break;
        case "configuration":
            attr.icon = this.props.configuration;
            break;
        case "position":
            Element = Numbers;
            attr.value = [ this.props.position ];
            break;
        case "positionDuration":
            Element = Numbers;
            attr.value = [ this.props.position, this.props.duration ];
            break;
        case "currentTime":
            Element = Slider;
            attr.value = this.props.position;
            attr.max = this.props.duration;
            attr.grow = 6;
            break;
        case "volume":
            Element = Slider;
            attr.value = this.props.volume;
            attr.max = 1.0;
            attr.grow = 1;
            break;
        }

        return e(Element, attr);
    }
}

export class AudioControls extends React.Component {

    render() {
        const colors = this.props.colors;

        const style = {
            padding: 0,
            margin: 0,
            border: 0,
            width: "100%",
            height: size + "px",
            background: colors.background,
            display: "flex",
            fontSize: "18px",
        };

        return e('div', { style }, Array.from(this.props.controls).map(name => {
            return e(Control, {
                colors: colors,
                key: name,
                control: name,
                configuration: this.props.configuration,
                position: this.props.position,
                duration: this.props.duration,
                playing: this.props.playing,
                mute: this.props.mute,
                volume: this.props.volume,
                onChange: this.props.onChange,
            });
        }));

/*
            e(Control, { colors, key: "fast-backward", icon: "fast-backward" }),
            e(Control, { colors, key: "backward", icon: "backward" }),
            e(Control, { colors, key: "pause", icon: "pause", disabled: true }),
            e(Control, { colors, key: "play", icon: "play" }),
            e(Control, { colors, key: "forward", icon: "forward", selected: true }),
            e(Control, { colors, key: "fast-forward", icon: "fast-forward" }),
            e(Slider,  { colors, key: "position-slider", grow: 6 }),
            e(Numbers, { colors, key: "position-text" }),
            e(Control, { colors, key: "volume-off", icon: "volume-off" }),
            e(Control, { colors, key: "volume-up", icon: "volume-up" }),
            e(Slider,  { colors, key: "volume-slider", grow: 1 }),
            e(Control, { colors, key: "expand", icon: "bars" }),
            e(Control, { colors, key: "expand", icon: "sliders" }),
            e(Control, { colors, key: "expand", icon: "ellipsis-v" }),
//            e(Control, { colors, key: "collapse", icon: "minus-square" }),
*/
    }
}

const buttonConfigurations = {};
const buttonConfigurationOrder = {
    mobile: 'tablet',
    tablet: 'desktop',
    desktop: 'mobile',
}

buttonConfigurations.mobile = new Set([
    "prevTrack",
    "pausePlay",
    "nextTrack",
    "currentTime",
    "position",
    "configuration",
]);

buttonConfigurations.tablet = new Set([
    "prevTrack",
    "pausePlay",
    "nextTrack",
    "currentTime",
    "positionDuration",
    "muteUnmute",
    "volume",
    "configuration",
]);

buttonConfigurations.desktop = new Set([
    "prevAlbum",
    "prevTrack",
    "pause",
    "play",
    "nextTrack",
    "nextAlbum",
    "currentTime",
    "positionDuration",
    "muteUnmute",
    "volume",
    "configuration",
]);

export class AudioDemo extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            configuration: 'desktop',
            playing: true,
            position: 408000, // in milli-seconds
            duration: (2 * 60 * 60 * 1000),
            mute: false,
            volume: 1.0, // 0 to 1, floating point
        };

        setInterval(() => {
            this.setState({ position: this.state.position + 20000 });
        }, 1000);
    }

    render() {
//        console.log('top render', this.state);

        const style = {
            margin: 0,
            padding: "10px 10px 0 10px",
            border: 0,
        };

        const audioAttr = Object.assign({
            controls: buttonConfigurations[this.state.configuration],
            onChange: (field, value) => {
                if (field == 'currentTime') {
                    field = 'position';
                }

                console.log('onChange', field, value);
                if ([ 'playing', 'position', 'mute', 'volume' ].includes(field)) {
                    const options = {};
                    options[field] = value;
                    console.log('setState', options);
                    this.setState(options);
                }

                if (field == 'configuration') {
                    const nxt = buttonConfigurationOrder[this.state.configuration];
                    this.setState({ configuration: nxt });
                }
            }
        }, this.state);

        return e('div', { style }, [
            e(AudioControls, Object.assign({ key: 'firefox', colors: firefoxTheme }, audioAttr)),
            e('p', { key: 'audio-demo-divider' }),
            e(AudioControls, Object.assign({ key: 'blueprint', colors: blueprintTheme }, audioAttr)),
        ]);
    }
}
