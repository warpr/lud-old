/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

const e = React.createElement;

const size = 40; // control bar height
const forceMobile = 560; // force mobile view if screen width < this value

function throttleEvent(type, name) {
    var running = false;
    var func = function() {
        if (running) { return; }
        running = true;
        requestAnimationFrame(function() {
            window.dispatchEvent(new CustomEvent(name));
            running = false;
        });
    };
    window.addEventListener(type, func);
};

throttleEvent("resize", "lûd-raf-resize");

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

function Text(props) {
    return e('span', { style: { color: props.color } }, props.text);
}

function Numbers(props) {
    const colors = props.colors;

    const style = {
        background: "inherit",
        padding: "0 5px",
        margin: 0,
        border: 0,
        minWidth: size + "px",
        height: size + "px",
        lineHeight: size + "px",
        flex: "0 1 auto",
        fontSize: "14px",
    };

    const children = [
        e(Text, {
            key: 'part1',
            text: formatTime(props.value[0]),
            color: colors.foreground,
        })
    ];

    if (props.value.length > 1) {
        children.push(e(Text, {
            key: 'part2',
            text: " / " + formatTime(props.value[1]),
            color: colors.subdued,
        }));
    }

    return e('div', { style }, children);
}

class Slider extends React.PureComponent {

    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.sliderRef = React.createRef();
    }

    handleChange(event) {
        this.props.onChange(this.props.control, event.target.value);
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

        const inputAttributes = {
            style: {
                height: size + "px",
                width: "100%",
            },
            type: "range",
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
            return this.props.onChange(this.props.control, true);
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

function Control(props) {
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
    };

    const attr = {
        colors: props.colors,
        control: props.control,
        onChange: props.onChange,
    }

    if (iconMap[props.control]) {
        attr.icon = iconMap[props.control];
    }

    let Element = Button;

    switch (props.control) {
    case "pause":
        attr.disabled = !props.playing;
        break;
    case "play":
        attr.disabled = props.playing;
        break;
    case "pausePlay":
        attr.icon = props.playing ? iconMap.pause : iconMap.play;
        break;
    case "muteUnmute":
        if (props.mute || props.volume == 0) {
            attr.icon = iconMap.unmute;
        } else {
            attr.icon = iconMap.mute;
        }
        break;
    case "configuration":
        attr.icon = props.configuration;
        break;
    case "position":
        Element = Numbers;
        attr.value = [ props.position ];
        break;
    case "positionDuration":
        Element = Numbers;
        attr.value = [ props.position, props.duration ];
        break;
    case "currentTime":
        Element = Slider;
        attr.value = props.position;
        attr.max = props.duration;
        attr.grow = 6;
        break;
    case "volume":
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
        padding: "0 5px",
        margin: 0,
        border: 0,
        width: "100%",
        height: size + "px",
        background: colors.background,
        display: "flex",
        fontSize: "18px",
    };

    const children = Array.from(props.controls).map(name => e(Control, {
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
    }));

    return e('div', { style }, children);
}

const buttonConfigurations = {};
const buttonConfigurationOrder = {
    mobile: 'tablet',
    tablet: 'desktop',
    desktop: 'mobile',
};

buttonConfigurations.forcedMobile = new Set([
    "prevTrack",
    "pausePlay",
    "nextTrack",
    "currentTime",
    "position",
]);

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

export class AudioControls extends React.PureComponent {
    constructor(props) {
        super(props);

        this.handleChange = this.handleChange.bind(this);
        this.handleResize = this.handleResize.bind(this);

        this.state = {
            configuration: 'desktop',
            playing: true,
            position: 408000, // in milli-seconds
            duration: (2 * 60 * 60 * 1000),
            forceMobile: window.innerWidth < forceMobile,
            mute: false,
            volume: 1000, // 0 to 1000
        };
    }

    componentDidMount() {
        window.addEventListener("lûd-raf-resize", this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener("lûd-raf-resize", this.handleResize);
    }

    handleResize(event) {
        if (window.innerWidth < forceMobile && !this.state.forceMobile) {
            this.setState({ forceMobile: true });
        } else if (window.innerWidth >= forceMobile && this.state.forceMobile) {
            this.setState({ forceMobile: false });
        }
    }

    handleChange(field, value) {
        switch (field) {
        case 'currentTime':
            field = 'position';
        case 'playing':
        case 'position':
        case 'mute':
        case 'volume':
            const newState = {};
            newState[field] = value;
            this.setState(newState);
            break;
        case 'configuration':
            const nxt = buttonConfigurationOrder[this.state.configuration];
            this.setState({ configuration: nxt });
            break;
        }
    }

    render() {
        return e(AudioControlsUI, Object.assign({
            controls: this.state.forceMobile
                ? buttonConfigurations.forcedMobile
                : buttonConfigurations[this.state.configuration],
            onChange: this.handleChange,
            colors: this.props.colors,
        }, this.state));
    }
}

export const firefoxTheme = {
    background: '#1c1f21',
    foreground: '#ffffff',
    subdued: '#929292',
    selected: '#48a0f7',
    slider: '#000000',
    loaded: '#525354',
    played: '#00b6f0',
};

export const blueprintTheme = {
    background: Blueprint.Core.Colors.DARK_GRAY1,
    foreground: Blueprint.Core.Colors.LIGHT_GRAY5,
    subdued: Blueprint.Core.Colors.GRAY3,
    selected: Blueprint.Core.Colors.BLUE5,
    slider: Blueprint.Core.Colors.BLACK,
    loaded: Blueprint.Core.Colors.DARK_GRAY5,
    played: Blueprint.Core.Colors.BLUE5,
};

export class AudioDemo extends React.Component {
    render() {
        const style = {
            margin: 0,
            padding: "10px 10px 0 10px",
            border: 0,
        };

        return e('div', { style }, [
            e(AudioControls, { key: 'firefox', colors: firefoxTheme }),
            e('p', { key: 'audio-demo-divider' }),
            e(AudioControls, { key: 'blueprint', colors: blueprintTheme }),
        ]);
    }
}
