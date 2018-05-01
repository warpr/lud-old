/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

const e = React.createElement;

const firefoxTheme = {
    background: '#1c1f21',
    foreground: '#ffffff',
    subdued: '#929292',
    selected: '#48a0f7',
    slider: '#000000',
    loaded: '#525354',
    played: '#00b6f0',
};

// Blueprint.Core.Colors

const blueprintTheme = {
    background: Blueprint.Core.Colors.DARK_GRAY1,
    foreground: Blueprint.Core.Colors.LIGHT_GRAY5,
    subdued: Blueprint.Core.Colors.GRAY3,
    selected: Blueprint.Core.Colors.BLUE5,
    slider: Blueprint.Core.Colors.BLACK,
    loaded: Blueprint.Core.Colors.DARK_GRAY5,
    played: Blueprint.Core.Colors.BLUE5,
};

export class Numbers extends React.Component {
    render() {
        const colors = this.props.colors;

        const style = {
            background: "inherit",
            padding: "0 5px",
            margin: 0,
            border: 0,
            minWidth: "64px",
            height: "32px",
            lineHeight: "32px",
            flex: "0 1 auto",
        };

        return e('div', { style }, [
            e('span', { key: 'pos', style: { color: colors.foreground }}, "3:15:59"),
            e('span', { key: 'dur', style: { color: colors.subdued }}, " / 4:05:03"),
        ]);
    }
};

export class Slider extends React.Component {
    render() {
        const colors = this.props.colors;

        const style = {
            padding: "0 5px",
            margin: 0,
            border: 0,
            minWidth: "64px",
            height: "32px",
            flexShrink: 0,
            flexGrow: this.props.grow,
            flexBasis: "auto",
            background: "inherit",
        };

        const sliderSegment = {
            display: "inline-block",
            marginTop: "12px",
            height: "8px",
            width: "25%",
            background: colors.loaded,
        };

        const sliderSegmentStart = Object.assign({}, sliderSegment);
        sliderSegmentStart.borderRadius = "4px 0px 0px 4px";
        sliderSegmentStart.background = colors.played;

        const sliderSegmentEnd = Object.assign({}, sliderSegment);
        sliderSegmentEnd.borderRadius = "0px 4px 4px 0px";
        sliderSegmentEnd.background = colors.slider;

        return e('div', { style }, [
            e('div', { key: 'p1', style: sliderSegmentStart }),
            e('div', { key: 'p2', style: sliderSegment }),
            e('div', { key: 'p3', style: sliderSegment }),
            e('div', { key: 'p4', style: sliderSegmentEnd }),
        ]);
    }
}

export class Control extends React.Component {

    render() {
        const colors = this.props.colors;

        const style = {
            padding: 0,
            margin: 0,
            border: 0,
            width: "32px",
            height: "32px",
            background: "inherit",
            color: this.props.selected
                ? colors.selected
                : (this.props.disabled ? colors.subdued : colors.foreground),
            display: "block",
            flex: "0 0 auto",
        };

        const iconOptions = { className: "fa fa-" + this.props.icon };
        return e('button', { style }, e('i', iconOptions));
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
            height: "32px",
            background: colors.background,
            display: "flex",
        };

        return e('div', { style }, [
            e(Control, { colors, key: "fast-backward", icon: "fast-backward" }),
            e(Control, { colors, key: "step-backward", icon: "step-backward" }),
            e(Control, { colors, key: "pause", icon: "pause", disabled: true }),
            e(Control, { colors, key: "play", icon: "play" }),
            e(Control, { colors, key: "step-forward", icon: "step-forward", selected: true }),
            e(Control, { colors, key: "fast-forward", icon: "fast-forward" }),
            e(Slider,  { colors, key: "position-slider", grow: 6 }),
            e(Numbers, { colors, key: "position-text" }),
            e(Slider,  { colors, key: "volume-slider", grow: 1 }),
            e(Control, { colors, key: "volume-off", icon: "volume-off" }),
            e(Control, { colors, key: "volume-up", icon: "volume-up" }),
        ]);
    }
}

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
