/**
 * This file is part of lûd, an opinionated browser based media player.
 * Copyright 2019 Kuno Woudt <kuno@frob.nl>
 * SPDX-License-Identifier: copyleft-next-0.3.1
 */

import { registerComponent } from './common.js';

const e = React.createElement;

const style = jss.default
    .createStyleSheet({
        li: {
            listStyleType: 'none',
            margin: 0,
            padding: 0,
        },

        row: {
            display: 'flex',
            flexFlow: 'row nowrap',
            padding: '0.5em 0',
        },

        cover: {
            width: '4rem',
            height: '4rem',
        },

        fixed: {
            flex: '0 0 auto',
            textAlign: 'right',
        },

        grow: {
            padding: '0 0.5em',
            flex: '1 1 auto',
        },
    })
    .attach().classes;

function QueueItem(props) {
    return e(
        'li',
        { className: style.li },
        e(
            'div',
            { className: style.row },
            e(
                'div',
                { className: style.cover + ' ' + style.fixed },
                e('img', { className: style.cover, src: props.cover }),
            ),
            e(
                'div',
                { className: style.grow },
                e('span', {}, props.title),
                e('br'),
                e('span', {}, props.artist),
            ),
            e('div', { className: style.fixed }, props.duration),
        ),
    );
}

function Queue(props) {
    return e(
        'ul',
        {},
        e(QueueItem, {
            cover: 'images/cover.jpg',
            title: 'Album Title',
            artist: 'Artist',
            duration: '59:23',
        }),
        e(QueueItem, {
            cover: '/music/labels/id-t/2002.shockers/cover.jpg',
            title: 'Shockers',
            artist: 'Various Artists',
            duration: '2:27:22',
        }),
        e(QueueItem, {
            cover: 'images/cover.jpg',
            title: 'Album Title',
            artist: 'Artist',
            duration: '59:23',
        }),
        e(QueueItem, {
            cover: '/music/artists/squarepusher/1999.selection-sixteen/cover.jpg',
            title: 'Selection Sixteen',
            artist: 'Squarepusher',
            duration: '46:22',
        }),
    );
}

registerComponent('lud-queue', Queue);
