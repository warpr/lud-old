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
import { throttleOnAnimationFrame } from '/lud/misc.js';
import { absoluteUri } from '/lud/misc.js';

const React = window.React;
const e = React.createElement;

class CastOutput /* implements AudioOutput */ {
    /*::
      audioGlue: AudioGlue
      _player: window.cast.framework.RemotePlayer
      _playerController: window.cast.framework.RemotePlayerController
      _keepLooping: bool
      _file: string
     */

    constructor(audioGlue) {
        this.audioGlue = audioGlue;
        this._keepLooping = false;
        this._file = '';

        this._player = null;
        this._playerController = null;
        this._frame = this._frame.bind(this);
    }

    disconnect() {}

    /*:: _frame: () => void */
    _frame() {
        this.audioGlue.tick();

        if (this._keepLooping) {
            requestAnimationFrame(this._frame); // request the next frame
        }
    }

    _startUpdateLoop() {
        this._keepLooping = true;
        requestAnimationFrame(this._frame); // start the first frame
    }

    _stopUpdateLoop() {
        this._keepLooping = false;
    }

    _castSession() {
        const castContext = window.cast.framework.CastContext.getInstance();
        return castContext.getCurrentSession();
    }

    loadMedia(file, position, currentSong) {
        this._file = absoluteUri(file);

        console.log('chromecast loadMedia', this._file, position, currentSong);

        this._player = new window.cast.framework.RemotePlayer();
        this._playerController = new window.cast.framework.RemotePlayerController(this._player);

        this._playerController.addEventListener(
            window.cast.framework.RemotePlayerEventType.ANY_CHANGE,
            event => console.log('remotePlayer event', event)
        );

        const mediaInfo = new window.chrome.cast.media.MediaInfo(this._file, 'audio/mp4');

        mediaInfo.metadata = new window.chrome.cast.media.MusicTrackMediaMetadata();
        mediaInfo.metadata.albumArtist = currentSong.getAlbumArtistName();
        mediaInfo.metadata.albumName = currentSong.albumTitle;
        mediaInfo.metadata.artist = currentSong.getAlbumArtistName();
        mediaInfo.metadata.discNumber = currentSong.discNo;
        mediaInfo.metadata.images = [
            new window.chrome.cast.Image(absoluteUri(currentSong.coverArt)),
        ];
        mediaInfo.metadata.releaseDate = currentSong.releaseDate;
        mediaInfo.metadata.title = currentSong.discTitle
            ? currentSong.discTitle
            : currentSong.albumTitle;
        mediaInfo.metadata.trackNumber = 1;

        const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
        const castSession = this._castSession();

        if (castSession) {
            castSession
                .loadMedia(request)
                .then(
                    () => console.log('castSession loadMedia success!'),
                    errorCode => console.log('castSession loadMedia error code: ', errorCode)
                );
        } else {
            console.log('no cast session, try again later');
        }
    }

    isPaused() {}

    isPlaying() {}

    play() {
        if (this.isPlaying()) {
            return;
        }

        this._playerController.playOrPause();
        this._startUpdateLoop();
    }

    pause() {
        if (!this.isPlaying()) {
            return;
        }

        this._playerController.playOrPause();
        this._stopUpdateLoop();
    }

    getCurrentTime() {
        return this._castSession()
            .getMediaSession()
            .getEstimatedTime();
    }

    getCurrentMedia() {
        // FIXME: can we get media actually playing right now?
        return this._file;
    }

    setCurrentTime(position /*: ?number */) {
        this._playerController.seek(position);
    }

    getDuration() {
        return this._player.duration;
    }

    getVolume() {
        return this._player.volumeLevel;
    }

    isMute() {
        return this._player.volumeLevel == 0;
    }

    setVolume(volume /*: number */) {}
}

function initializeCastApi(glue) {
    console.log('initialize cast api', window.cast);
    const castContext = window.cast.framework.CastContext.getInstance();
    const castOptions = {
        autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED,
        receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
    };

    castContext.setOptions(castOptions);

    const output = new CastOutput(glue);

    castContext.addEventListener(
        window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        function(event) {
            switch (event.sessionState) {
                case window.cast.framework.SessionState.SESSION_STARTED:
                    console.log('Session started');
                    glue.connectOutput(output);
                    break;
                case window.cast.framework.SessionState.SESSION_RESUMED:
                    console.log('Session resumed');
                    glue.connectOutput(output);
                    break;
                case window.cast.framework.SessionState.SESSION_ENDED:
                    console.log('Session ended');
                    glue.disconnectOutput(output);
                    break;
                default:
                    console.log('CastContext: CastSession disconnected');
                    glue.disconnectOutput(output);
                    break;
            }
        }
    );
}

window.__onGCastApiAvailable = function(isAvailable) {
    console.log('cast is available?', isAvailable);
    if (isAvailable) {
        setTimeout(() => {
            initializeCastApi(window.lûd.glue);
        }, 1000);
    }
};

export class CastButton extends React.Component {
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
