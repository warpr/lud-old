/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 */

const applicationId = '5DC02A2C';
const localIp = '192.168.100.25';

//         const disc = "http://" + localIp + "/lud/music/series/techpara/2009.we-love-techpara-70min-70songs/disc1.m4a";
const disc = "http://" + localIp + "/lud/music/artists/future-sound-of-london/1994.lifeforms/disc1.m4a";
const albumArt = "http://" + localIp + "/lud/music/artists/future-sound-of-london/1994.lifeforms/cover.jpg";

/*
  NOTES
  =====

  remoteplayer example at:

  https://github.com/googlecast/CastVideos-chrome/blob/master/CastVideos.js
*/

function startCasting() {
    const player = new cast.framework.RemotePlayer();
    const playerController = new cast.framework.RemotePlayerController(player);

    console.log('is player connected?', player.isConnected);

    // const remoteEvents = [
    //     cast.framework.RemotePlayerEventType.IS_CONNECTED_CHANGED,
    //     cast.framework.RemotePlayerEventType.IS_PAUSED_CHANGED,
    //     cast.framework.RemotePlayerEventType.IS_MUTED_CHANGED,
    //     cast.framework.RemotePlayerEventType.VOLUME_LEVEL_CHANGED,
    // ];

    // remoteEvents.map(event => {
    //     playerController.addEventListener(event, e => {
    //         console.log('remotePlayer event', e);
    //     });
    // });

    playerController.addEventListener(
        cast.framework.RemotePlayerEventType.ANY_CHANGE,
        event => console.log('remotePlayer event', event)
    );

    /** seeking:

        const sr = new chrome.cast.media.SeekRequest();
        sr.currentTime = 400;
        mediaSession.seek(sr);

        duration is mediaSession.media.duration
    */

    setInterval(() => {
        const castContext = cast.framework.CastContext.getInstance();
        const castSession = castContext.getCurrentSession();
        const mediaSession = castSession.getMediaSession();

        console.log(
            'currentTime?', mediaSession.getEstimatedTime(),
            'of', player.duration,
            'on', castSession.getCastDevice().friendlyName,
            'volume', player.volumeLevel,
        );
    }, 2000);

    const castContext = cast.framework.CastContext.getInstance();
    const castSession = castContext.getCurrentSession();
    const mediaSession = castSession.getMediaSession();

    window.ctx = castContext;
    window.ses = castSession;
    window.med = mediaSession;
    window.rp = player;
    window.rpc = playerController;

    const mediaInfo = new chrome.cast.media.MediaInfo(disc, "audio/mp4");

    mediaInfo.metadata = new chrome.cast.media.MusicTrackMediaMetadata();
    mediaInfo.metadata.albumArtist = "The Future Sound of London";
    mediaInfo.metadata.albumName = "Lifeforms";
    mediaInfo.metadata.artist = "The Future Sound of London";
    mediaInfo.metadata.discNumber = 1;
    mediaInfo.metadata.images = [
        new chrome.cast.Image(albumArt),
    ];
    mediaInfo.metadata.releaseDate = "1994-05-16";
    mediaInfo.metadata.title = "Lifeforms";
    mediaInfo.metadata.trackNumber = 1;

//             setInterval(function () {
//                 const d = new Date();
//                 const title = "Cascade " + d.toISOString();
//                 console.log('Changing title to', title);
//                 mediaInfo.metadata.title = title;

//                 const request = new chrome.cast.media.LoadRequest(mediaInfo);
//                 castSession.loadMedia(request);
//             }, 2000);

    const request = new chrome.cast.media.LoadRequest(mediaInfo);
    castSession.loadMedia(request).then(
        function() { console.log('Load succeed'); },
        function(errorCode) { console.log('Load Media error code: ', errorCode); }
    );
}

function initializeCastApi() {
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
                startCasting();
                break;
            case cast.framework.SessionState.SESSION_RESUMED:
                console.log('Session resumed');
                startCasting();
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

export function init() {
    window.__onGCastApiAvailable = function(isAvailable) {
        if (isAvailable) {
            initializeCastApi();
        }
    };
}
