/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

import { AudioMetadata } from '/lud/audio-metadata.js';

const lodash = window._;
const Immutable = window.Immutable;

const parsedUserAgent = window.UAParser();

const browserDescription =
    parsedUserAgent.browser.name + ' on ' + parsedUserAgent.os.name.replace('Mac OS', 'macOS');

/*::
type NowPlayingResponse = {
    cue_file: ?string,
    paused: boolean,
    playlist_id: ?number,
    pos: number,
    updated_at: number,
}

type NowPlayingRequest = {
    action: ?string,
    device: ?string,
    playlist_id: ?number,
    pos: number,
    updated_at: number,
}
*/

async function sendDataToServer(data /*: NowPlayingRequest */) {
    const response = await fetch('/lud/now-playing/', {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
}

export class ControlChannel {
    /*::
      audioElement: HTMLAudioElement
      audioMetadata: ?AudioMetadata
      lastServerResponse: ?NowPlayingResponse
      throttledSendDataToServer: Function
    */

    constructor(audioElement /*: HTMLAudioElement */) {
        this.audioElement = audioElement;
        this.audioMetadata = null;
        this.throttledSendDataToServer = lodash.throttle(
            () => {
                const myPostData = this.getPostData();
                if (myPostData) {
                    sendDataToServer(myPostData);
                }
            },
            10000,
            { leading: true, trailing: true },
        );

        audioElement.addEventListener('timeupdate', () => {
            this.updateToServer();
        });
    }

    getPostData() /*: ?NowPlayingRequest */ {
        if (!this.audioMetadata || !this.lastServerResponse) {
            return null;
        }

        return {
            action: 'sync',
            cue_file: this.lastServerResponse.cue_file,
            device: browserDescription,
            paused: !!this.audioElement.paused,
            playlist_id: this.lastServerResponse.playlist_id,
            pos: Math.floor((this.audioMetadata.position || 0) * 1000),
            updated_at: new Date().getTime(),
        };
    }

    async updateToServer() {
        if (!this.audioMetadata) {
            return;
        }

        if (this.audioElement.paused) {
            return;
        }

        this.audioMetadata.setPosition(this.audioElement.currentTime);
        this.throttledSendDataToServer();
    }

    async updateFromServer() /*: Promise<NowPlayingResponse> */ {
        const response = await fetch('/lud/now-playing/');
        const responseData /*: NowPlayingResponse */ = await response.json();

        this.lastServerResponse = responseData;

        this.audioMetadata = new AudioMetadata(responseData.cue_file, responseData.pos / 1000);

        await this.audioMetadata.ready;

        window.lûd.audioMetadata = this.audioMetadata;

        return responseData;
    }
}
