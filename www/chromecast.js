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

function initializeCastApi() {
    console.log('initialize cast api', cast);
    const castContext = cast.framework.CastContext.getInstance();

    const castOptions = {
        autoJoinPolicy: chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        receiverApplicationId: chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    };

    castContext.setOptions(castOptions);

    castContext.addEventListener(
        cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        function(event) {
            switch (event.sessionState) {
                case cast.framework.SessionState.SESSION_STARTED:
                    console.log('Session started');
                    //                    startCasting();
                    break;
                case cast.framework.SessionState.SESSION_RESUMED:
                    console.log('Session resumed');
                    //                    startCasting();
                    break;
                case cast.framework.SessionState.SESSION_ENDED:
                    console.log('Session ended');
                    break;
                default:
                    console.log('CastContext: CastSession disconnected');
                    break;
            }
        }
    );
}

window.__onGCastApiAvailable = function(isAvailable) {
    console.log('cast is available?', isAvailable);
    if (isAvailable) {
        setTimeout(() => {
            initializeCastApi();
        }, 1000);
    }
};

export class CastButton extends React.Component {
    constructor(props /*: {} */) {
        super(props);
        this.glue = window.lûd.glue;
    }

    shouldComponentUpdate() {
        // we never want to destroy the <google-cast-launcher> element, as its
        // events are managed by the chromecast SDK.
        return false;
    }

    render() {
        const attr = {
            style: {
                width: '1em',
                height: '1em',
                fontSize: '24px',
                marginLeft: '16px',
            },
        };

        return e('google-cast-launcher', attr);
    }
}
