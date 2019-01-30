/**
 * This file is part of lûd, an opinionated browser based media player.
 * Copyright (C) 2018  Kuno Woudt <kuno@frob.nl>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of copyleft-next 0.3.1.  See copyleft-next-0.3.1.txt.
 *
 * @flow
 */

const config = {
    verbose: false,
    music_root: __dirname + '/../www/music/',
    index_root: __dirname + '/../data/',
    search_root: '/lud/search/',
    web_path: '/lud/music',
    www_user: 'www-data',
    www_group: 'www-data',
};

function renderItem(item) {
    location = item.path.replace(config.web_path + '/', '');

    switch (item.type) {
        case 'track':
            return (
                item.artist +
                ' - ' +
                item.title +
                ' (' +
                location +
                ', ' +
                item.disc +
                '-' +
                item.pos +
                ')'
            );
        case 'disc':
            return item.title + ' (' + location + ')';
        default:
            return item.artist + ' - ' + item.title + ' (' + location + ')';
    }
}

async function main(config, term) {
    if (term.trim() === '') {
        console.log('Total results: 0.');
        return;
    }

    const database_filename = config.index_root + 'lud.sqlite';

    const knex = require('knex')({
        client: 'sqlite3',
        connection: {
            filename: database_filename,
        },
        useNullAsDefault: true,
    });

    const offset = 0;
    const limit = 10;

    await knex
        .select()
        .from('index')
        .where('index', '=', term)
        .limit(limit)
        .offset(offset)
        .map(renderItem)
        .map(console.log);

    const { total } = await knex('index')
        .count('* as total')
        .where('index', '=', term)
        .first();

    console.log('Total results: ' + total + '.');

    knex.destroy();
}

main(config, process.argv.slice(2).join(' '));
