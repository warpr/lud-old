/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

const React = window.React;
const e = React.createElement;
const M = window['material-ui'];

class PlayPause extends React.PureComponent {
    constructor(props /*: {} */) {
        super(props);

        this.state = { playing: false };
        this.handleToggle = this.handleToggle.bind(this);
    }

    /*:: handleToggle: () => void */
    handleToggle(event /*: SyntheticEvent<HTMLElement>*/) {
        console.log('play pause fab event', event);
        this.setState({ playing: !this.state.playing });
    }

    render() {
        const { theme } = this.props;
        const transitionDuration = {
            enter: theme.transitions.duration.enteringScreen,
            exit: theme.transitions.duration.leavingScreen,
        };

        const fabStyle = {
            position: 'absolute',
            bottom: theme.spacing.unit * 2,
            right: theme.spacing.unit * 2,
        };
        const play = {
            color: 'primary',
            playing: false,
            icon: e(M.Icon, {}, 'play_arrow'),
        };

        const pause = {
            color: 'default',
            playing: true,
            icon: e(M.Icon, {}, 'pause'),
        };

        return [play, pause].map((fab, index) => {
            const active = fab.playing === this.state.playing;
            return e(
                M.Zoom,
                {
                    key: index,
                    in: active,
                    timeout: transitionDuration,
                    style: {
                        transitionDelay: active ? transitionDuration.exit : 0,
                    },
                    unmountOnExit: true,
                },
                e(
                    M.Button,
                    {
                        variant: 'fab',
                        color: fab.color,
                        style: fabStyle,
                        onClick: this.handleToggle,
                    },
                    fab.icon
                )
            );
        });
    }
}

export const PlayPauseFab = M.withTheme()(PlayPause);
