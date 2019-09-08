/**
 *   This file is part of lûd, an opinionated browser based media player.
 *   Copyright (C) 2019  Kuno Woudt <kuno@frob.nl>
 *
 *   This program is free software: you can redistribute it and/or modify
 *   it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 *   @flow
 */

const Pusher = window.Pusher;

import { pusherKey } from '/lud/config.js';

// Enable pusher logging - don't include this in production
Pusher.logToConsole = true;

const pusher = new Pusher(pusherKey, {
    cluster: 'us2',
    forceTLS: true,
    disableStats: true,
});

const commandChannel = pusher.subscribe('command-channel');

export function getCommandChannel() {
    return commandChannel;
}
