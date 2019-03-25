/**
 * This file is part of lûd, an opinionated browser based media player.
 * Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 * @flow
 */

import Pusher from 'pusher';
import fs from 'fs';
import path from 'path';
import server_json from '../etc/server.json';
import { version } from './help';

const __dirname = path.dirname(new URL(import.meta.url).pathname);

export function commandChannel(cmd /*: string */) {
    const pusher = new Pusher(server_json.pusher);

    console.log('Sending reload playlist command to all clients');

    pusher.trigger('command-channel', 'refresh-playlist', {
        message: 'lûd v' + version(),
    });
}

export function initPusher() {
    server_json.pusher.key;

    // FIXME: provide a general way for the server to write
    // config values for the client.
    const configBody = 'export const pusherKey = ' + JSON.stringify(server_json.pusher.key) + ';\n';

    const configFilename = __dirname + '/../lud/config.js';

    fs.writeFile(configFilename, configBody, 'utf8', err => {
        if (err) {
            console.log('ERROR: failed to write ' + configFilename + ': ' + err);
        } else {
            console.log('Saved client configuration to ' + configFilename);
        }
    });
}
